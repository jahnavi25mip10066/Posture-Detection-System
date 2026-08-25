const videoElement = document.getElementById('input_video');
const canvasElement = document.getElementById('output_canvas');
const canvasCtx = canvasElement.getContext('2d');
const statusOverlay = document.getElementById('status-overlay');

// Helper function to calculate 2D distance between two points
function calculateDistance(a, b) {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
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

        // Get key landmarks
        const leftEar = results.poseLandmarks[7];
        const rightEar = results.poseLandmarks[8];
        const leftShoulder = results.poseLandmarks[11];
        const rightShoulder = results.poseLandmarks[12];
        const nose = results.poseLandmarks[0];
        
        // 1. Calculate Shoulder Width (baseline for scale)
        const shoulderWidth = calculateDistance(leftShoulder, rightShoulder);
        
        // 2. Calculate average vertical drop from ears to shoulders
        // If you slouch, your head drops closer to your shoulders
        const leftDrop = leftShoulder.y - leftEar.y;
        const rightDrop = rightShoulder.y - rightEar.y;
        const averageDrop = (leftDrop + rightDrop) / 2.0;

        // 3. Posture Ratio (How high the head is compared to shoulder width)
        // A healthy posture usually has a ratio > 0.5 (head is high up)
        // If they slouch, the ratio drops significantly.
        const postureRatio = averageDrop / shoulderWidth;

        // 4. Lean Forward Check using Z-axis (Depth)
        // If the nose's Z is significantly smaller than shoulders, they are leaning into the screen
        const averageShoulderZ = (leftShoulder.z + rightShoulder.z) / 2.0;
        const isLeaningForward = nose.z < (averageShoulderZ - 0.15); // Adjust threshold as needed

        // Alert the user!
        // We trigger bad posture if their head drops (slouch) OR if they lean too far into the camera
        if (postureRatio < 0.4 || isLeaningForward) {
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
    modelComplexity: 2, // Upgraded to highest accuracy model (Level 2)
    smoothLandmarks: true,
    enableSegmentation: false,
    minDetectionConfidence: 0.6,
    minTrackingConfidence: 0.6
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
