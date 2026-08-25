import cv2
import mediapipe as mp
import numpy as np
import math

class PostureDetector:
    def __init__(self):
        # Initialize MediaPipe Pose. MediaPipe is made by Google and is incredible at this.
        self.mp_pose = mp.solutions.pose
        self.mp_drawing = mp.solutions.drawing_utils
        
        # We use model_complexity=2 for the absolute highest accuracy.
        # It's slightly heavier, but it makes detection in low light or when 
        # only half the body is visible much, much better.
        self.pose = self.mp_pose.Pose(
            static_image_mode=False,
            model_complexity=2, 
            enable_segmentation=False,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )

    def enhance_low_light(self, image):
        """
        A simple, human-like heuristic to brighten the image if it's too dark.
        This literally just checks how dark it is, and if it's dark, it adds light.
        """
        # Convert to HSV color space to easily check brightness (Value channel)
        hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
        h, s, v = cv2.split(hsv)
        
        # Calculate the average brightness of the frame
        avg_brightness = np.mean(v)
        
        # If it's too dark (below 80 on a 0-255 scale), we brighten it up
        if avg_brightness < 80:
            # Add 50 to the brightness channel, capping at 255
            v = cv2.add(v, 50)
            
            # Put the image back together
            final_hsv = cv2.merge((h, s, v))
            image = cv2.cvtColor(final_hsv, cv2.COLOR_HSV2BGR)
            
        return image

    def calculate_angle(self, point1, point2, point3):
        """
        Calculates the angle between three points. 
        We use this to see how much your neck is bending forward.
        """
        # Basic trigonometry to find the angle
        angle = math.degrees(
            math.atan2(point3[1] - point2[1], point3[0] - point2[0]) - 
            math.atan2(point1[1] - point2[1], point1[0] - point2[0])
        )
        
        # Keep it clean, between 0 and 180 degrees
        angle = abs(angle)
        if angle > 180:
            angle = 360 - angle
            
        return angle

    def process_frame(self, frame):
        """
        This is where the magic happens for every single video frame.
        """
        # 1. Automatically handle low light conditions
        enhanced_frame = self.enhance_low_light(frame)
        
        # 2. Convert color format for our AI model
        rgb_frame = cv2.cvtColor(enhanced_frame, cv2.COLOR_BGR2RGB)
        
        # 3. Find the posture/skeleton!
        results = self.pose.process(rgb_frame)
        
        status = "Waiting for you..."
        color = (255, 255, 255) # White text by default
        
        if results.pose_landmarks:
            landmarks = results.pose_landmarks.landmark
            
            # We want to check the Ear, Shoulder, and a point above the shoulder.
            # We check both left and right sides, so if you turn to the side, it still works!
            
            left_ear = [landmarks[self.mp_pose.PoseLandmark.LEFT_EAR.value].x, 
                        landmarks[self.mp_pose.PoseLandmark.LEFT_EAR.value].y]
            left_shoulder = [landmarks[self.mp_pose.PoseLandmark.LEFT_SHOULDER.value].x, 
                             landmarks[self.mp_pose.PoseLandmark.LEFT_SHOULDER.value].y]
            
            right_ear = [landmarks[self.mp_pose.PoseLandmark.RIGHT_EAR.value].x, 
                         landmarks[self.mp_pose.PoseLandmark.RIGHT_EAR.value].y]
            right_shoulder = [landmarks[self.mp_pose.PoseLandmark.RIGHT_SHOULDER.value].x, 
                              landmarks[self.mp_pose.PoseLandmark.RIGHT_SHOULDER.value].y]

            # Which side of the body can the camera see better? Let's use that one.
            left_visibility = landmarks[self.mp_pose.PoseLandmark.LEFT_SHOULDER.value].visibility
            right_visibility = landmarks[self.mp_pose.PoseLandmark.RIGHT_SHOULDER.value].visibility
            
            if left_visibility > right_visibility:
                ear = left_ear
                shoulder = left_shoulder
            else:
                ear = right_ear
                shoulder = right_shoulder

            # To see if you're slouching, we check the angle of your neck.
            # We create an imaginary straight line going UP from your shoulder.
            vertical_point = [shoulder[0], shoulder[1] - 0.1]
            
            # Then we see how far your ear leans away from that straight vertical line.
            neck_angle = self.calculate_angle(ear, shoulder, vertical_point)

            # Simple logic: if your head is leaning too far forward (angle > 20), you are slouching.
            if 20 < neck_angle < 160: 
                status = "Slouching! Sit up straight."
                color = (0, 0, 255) # Red for bad posture (BGR format for OpenCV)
            else:
                status = "Great Posture!"
                color = (0, 255, 0) # Green for good posture
                
            # Draw the gorgeous skeleton on the video feed
            self.mp_drawing.draw_landmarks(
                frame, 
                results.pose_landmarks, 
                self.mp_pose.POSE_CONNECTIONS,
                self.mp_drawing.DrawingSpec(color=(255, 255, 255), thickness=2, circle_radius=2), # Dots
                self.mp_drawing.DrawingSpec(color=(200, 200, 200), thickness=2, circle_radius=2)  # Lines
            )

        # Write the status text directly onto the video feed
        cv2.putText(frame, status, (30, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, color, 2, cv2.LINE_AA)
                    
        return frame
