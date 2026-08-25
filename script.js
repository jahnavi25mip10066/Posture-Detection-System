const videoElement = document.getElementById('input_video');
const canvasElement = document.getElementById('output_canvas');
const canvasCtx = canvasElement.getContext('2d');
const statusOverlay = document.getElementById('status-overlay');
const calibrateBtn = document.getElementById('calibrate-btn');

// --- MATHEMATICAL MODELS (Based on Paper 1: Sitting Posture Correction) ---

// Distance between two points
function distance(p1, p2) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

// Incenter of a triangle (weighted formula from research paper)
function incenter(A, B, C) {
    const a = distance(B, C);
    const b = distance(A, C);
    const c = distance(A, B);
    const perimeter = a + b + c;
    
    // Prevent division by zero
    if (perimeter === 0) return A; 

    return {
        x: (a * A.x + b * B.x + c * C.x) / perimeter,
        y: (a * A.y + b * B.y + c * C.y) / perimeter
    };
}

// Global calibration baselines
let baselineF1 = 0.031; // Default normal lean
let baselineF2 = 1.352; // Default normal slouch (from Paper 1, Table 2)
let isCalibrated = false;

// Calibration Trigger
let currentF1 = baselineF1;
let currentF2 = baselineF2;

calibrateBtn.addEventListener('click', () => {
    baselineF1 = currentF1;
    baselineF2 = currentF2;
    isCalibrated = true;
    
    // Visual feedback
    calibrateBtn.innerText = "✅ Calibrated!";
    calibrateBtn.style.backgroundColor = "var(--success)";
    setTimeout(() => {
        calibrateBtn.innerText = "🎯 Recalibrate";
        calibrateBtn.style.backgroundColor = "var(--accent)";
    }, 2000);
});

// The main AI Loop
function onResults(results) {
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
    
    let status = "Waiting for you...";
    let statusColor = "#1d1d1f";

    if (results.poseLandmarks) {
        // Draw the skeletal tracking lines
        drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS,
            {color: 'rgba(255, 255, 255, 0.7)', lineWidth: 3});
        drawLandmarks(canvasCtx, results.poseLandmarks,
            {color: '#0071e3', lineWidth: 2, radius: 4});

        // Keypoints tracked (from YOLOv8 paper specs):
        const nose = results.poseLandmarks[0];
        const leftEye = results.poseLandmarks[2];
        const rightEye = results.poseLandmarks[5];
        const leftEar = results.poseLandmarks[7];
        const rightEar = results.poseLandmarks[8];
        const leftShoulder = results.poseLandmarks[11];
        const rightShoulder = results.poseLandmarks[12];
        
        // Derived points: Incenter of face triangles
        const LFaceCenter = incenter(leftEye, leftEar, nose);
        const RFaceCenter = incenter(rightEye, rightEar, nose);

        // Distances calculated
        const s1 = distance(LFaceCenter, leftShoulder);
        const s2 = distance(RFaceCenter, rightShoulder);
        const s3 = distance(leftShoulder, rightShoulder);

        // Prevent division by zero if shoulders overlap (rare)
        if (s3 > 0) {
            // Feature extraction for posture classification
            currentF1 = Math.abs((s1 - s2) * 10) / s3; // f1: measures left/right lean
            currentF2 = (s1 + s2) / s3;               // f2: measures forward hunch/slouch
            
            // Dynamic thresholds based on calibration (or paper defaults)
            // Paper normal: f2 = 1.352, hunch = 0.971
            const slouchThreshold = isCalibrated ? (baselineF2 * 0.85) : 1.1; 
            
            // Paper normal: f1 = 0.031, lean = 1.4+
            const leanThreshold = isCalibrated ? (baselineF1 + 1.0) : 1.2;

            if (currentF2 < slouchThreshold) {
                status = "Slouching (Hunchback)!";
                statusColor = "var(--danger)";
            } else if (currentF1 > leanThreshold) {
                status = "Leaning to the side!";
                statusColor = "var(--warning)";
            } else {
                status = "Great Posture!";
                statusColor = "var(--success)";
            }
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
    modelComplexity: 2, 
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
