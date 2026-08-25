const videoElement = document.getElementById('input_video');
const canvasElement = document.getElementById('output_canvas');
const canvasCtx = canvasElement.getContext('2d');
const statusOverlay = document.getElementById('status-overlay');

// Basic Math to calculate the angle for slouching
function calculateAngle(a, b, c) {
    const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
    let angle = Math.abs((radians * 180.0) / Math.PI);
    if (angle > 180.0) {
        angle = 360 - angle;
    }
    return angle;
}

// The main loop that runs every time a frame is processed
function onResults(results) {
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    
    // 1. Draw the actual video frame
    canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
    
    let status = "Waiting for you...";
    let statusColor = "#1d1d1f";

    // 2. If it sees a body, do the math!
    if (results.poseLandmarks) {
        // Draw the skeletal tracking lines
        drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS,
            {color: 'rgba(255, 255, 255, 0.7)', lineWidth: 3});
        drawLandmarks(canvasCtx, results.poseLandmarks,
            {color: '#0071e3', lineWidth: 2, radius: 4});

        // 7=Left Ear, 11=Left Shoulder, 8=Right Ear, 12=Right Shoulder
        const leftEar = results.poseLandmarks[7];
        const leftShoulder = results.poseLandmarks[11];
        const rightEar = results.poseLandmarks[8];
        const rightShoulder = results.poseLandmarks[12];
        
        let ear, shoulder;
        
        // Pick the side of the body that is most visible!
        if (leftShoulder.visibility > rightShoulder.visibility) {
            ear = leftEar;
            shoulder = leftShoulder;
        } else {
            ear = rightEar;
            shoulder = rightShoulder;
        }

        // Create a perfect vertical line above the shoulder
        const verticalPoint = { x: shoulder.x, y: shoulder.y - 0.1 };
        
        // Calculate the angle
        const neckAngle = calculateAngle(ear, shoulder, verticalPoint);

        // Alert the user!
        if (neckAngle > 20 && neckAngle < 160) {
            status = "Slouching! Sit up straight.";
            statusColor = "var(--danger)";
        } else {
            status = "Great Posture!";
            statusColor = "var(--success)";
        }
    }

    // Update the UI
    statusOverlay.innerText = status;
    statusOverlay.style.color = statusColor;
    canvasCtx.restore();
}

// Initialize the MediaPipe AI model
const pose = new Pose({locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
}});

pose.setOptions({
    modelComplexity: 1, // Balanced for web browsers
    smoothLandmarks: true,
    enableSegmentation: false,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});

pose.onResults(onResults);

// Connect the webcam to the AI model
const camera = new Camera(videoElement, {
    onFrame: async () => {
        await pose.send({image: videoElement});
    },
    width: 800,
    height: 600
});

// Start it up!
camera.start();
