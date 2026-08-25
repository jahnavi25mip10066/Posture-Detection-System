import cv2
from flask import Flask, render_template, Response
from detector import PostureDetector

# Initialize the Flask web application. It's incredibly simple!
app = Flask(__name__)

# Create one instance of our detector to use for the whole app.
detector = PostureDetector()

def generate_frames():
    """
    This connects to your webcam and processes it frame by frame forever.
    It's built as a Python 'generator' which makes streaming video to a webpage very easy.
    """
    # Open webcam (index 0 is usually the default laptop camera)
    camera = cv2.VideoCapture(0)
    
    while True:
        # Grab a picture from the webcam
        success, frame = camera.read()
        
        # If the camera failed or got disconnected, stop.
        if not success:
            break
            
        # Pass the picture into our detector to draw the skeleton and check posture
        processed_frame = detector.process_frame(frame)
        
        # Convert the picture into JPEG format so the web browser understands it
        ret, buffer = cv2.imencode('.jpg', processed_frame)
        frame_bytes = buffer.tobytes()
        
        # Send it to the web page!
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

@app.route('/')
def index():
    """
    When someone goes to the website, show them the beautiful index.html page.
    """
    return render_template('index.html')

@app.route('/video_feed')
def video_feed():
    """
    The index.html page connects to this URL to get the live video stream.
    """
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    # Start the application! Go to http://127.0.0.1:5000 in your browser to see it.
    app.run(debug=True)
