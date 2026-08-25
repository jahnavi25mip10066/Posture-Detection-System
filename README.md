<div align="center">
  <!-- Gorgeous Animated Typing SVG -->
  <img src="https://readme-typing-svg.herokuapp.com?font=Inter&weight=600&size=45&duration=3000&pause=1000&color=0071E3&center=true&vCenter=true&lines=Stay+Upright.;Smart+Posture+Detection.;Powered+by+MediaPipe." alt="Typing SVG" />
  
  <p><b>A gorgeously minimal, real-time posture monitor running entirely in your browser.</b></p>

  <!-- Cool Shields.io Badges -->
  <p>
    <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
    <img src="https://img.shields.io/badge/MediaPipe-0071E3?style=for-the-badge&logo=google&logoColor=white" alt="MediaPipe" />
    <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
    <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
    <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
  </p>
</div>

---

## 👥 The Dream Team

This project was built by a dedicated team of five. Here is how we divided and conquered:

| Team Member | Role | Contribution |
| :--- | :--- | :--- |
| **👑 Snehal Dixit** | Team Lead | Architecture design, project management, and Vercel deployment pipeline integration. |
| **🧠 Geetesh Parashar** | AI Logic | Engineered the core MediaPipe Pose tracking and the advanced trigonometry for slouch detection. |
| **🛡️ Vaishnavi Dixit** | Edge-Cases | Developed heuristics for partial visibility ("half-body" problem). |
| **⚙️ Jhanvi Gaur** | Systems | Managed the real-time webcam data streams (`getUserMedia` API) and rendering pipelines on the HTML Canvas. |
| **🎨 Pratyasha Singh** | UI/UX Design | Crafted the minimalist, premium CSS interface and real-time status overlay animations. |

---

## 📖 The Complete Journey: From Idea to Vercel

Building this project wasn't a straight line. It was a journey of solving problems, pivoting our architecture, and pushing for the most robust, beautiful experience possible. Here is exactly how we built it, step by step.

### Step 1: The Core Idea
**🗣️ In Layman's Terms:** We wanted to build something that yells at you (nicely) when you slouch in front of your computer, because back pain is the worst. We wanted it to be smart enough to work even if your room is dark or your camera can only see half of your body.

**⚙️ In Technical Terms:** We defined the project requirements as a real-time computer vision application utilizing a Convolutional Neural Network (CNN) for pose estimation. The constraints were strict: high frame rate (30+ FPS), robust detection under partial occlusion, and a zero-configuration deployment pipeline.

### Step 2: The Initial Python Prototype
**🗣️ In Layman's Terms:** First, we built a working version using Python. Python is great because it has lots of pre-built tools for this kind of stuff. We set up the webcam, plugged it into Google's AI brain (MediaPipe), and got it to draw a skeleton over our bodies. We then wrote a small web server to show this video on a web page.

**⚙️ In Technical Terms:** The initial architecture utilized a monolithic Python backend. We used `cv2.VideoCapture(0)` via OpenCV to ingest the hardware video stream. We initialized `mediapipe.solutions.pose` with `model_complexity=2` for maximum landmark accuracy. A Flask micro-server (`app.py`) was implemented to serve the video frames using an MJPEG stream (`multipart/x-mixed-replace` boundary protocol).

### Step 3: Solving the "Edge Cases" (Lighting & Partial Bodies)
**🗣️ In Layman's Terms:** We noticed the AI got confused easily. If we leaned to the side, or if the webcam only saw our head and left shoulder, it freaked out. We fixed this by telling the math to "pick the side of the body you can see best." We also wrote a quick check to brighten the video automatically if the room was too dark.

**⚙️ In Technical Terms:** We engineered two core heuristics to improve robustness. 
1.  **Occlusion Handling:** MediaPipe provides a confidence score (`visibility`) for every localized landmark. We implemented a dynamic conditional check: `if (leftShoulder.visibility > rightShoulder.visibility)`. The algorithm swaps its anchor coordinates in real-time, allowing trigonometric calculations (via `Math.atan2`) to proceed uninterrupted on the z-axis regardless of body rotation.
2.  **Low-Light Adaptation:** We implemented a color space conversion from BGR to HSV, extracted the 'Value' (luminance) channel, computed the NumPy mean, and applied a constant scalar addition if the mean fell below a strict threshold (80).

### Step 4: The Vercel Pivot (The Great Rewrite)
**🗣️ In Layman's Terms:** We hit a huge roadblock. We wanted to put our app on Vercel so anyone in the world could use it via a simple web link. But Vercel is a cloud server. When we tried to put our Python code there, the cloud server tried to turn on *its own* webcam instead of the user's webcam! 
To fix this, we literally threw away our Python backend and rewrote the entire AI logic in JavaScript so it could run safely directly inside the user's web browser.

**⚙️ In Technical Terms:** We encountered a critical infrastructure incompatibility. Vercel utilizes stateless AWS Lambda functions (Serverless). Executing a hardware interrupt (`cv2.VideoCapture`) inside a Lambda container results in a fatal error because the container lacks peripheral I/O access to the client's local hardware.
**The Pivot:** We decommissioned the Flask backend entirely, transitioning to a Client-Side Rendering (CSR) architecture. We imported the `@mediapipe/pose` NPM CDN packages. Video capture was migrated to the browser-native `navigator.mediaDevices.getUserMedia` API.

### Step 5: Implementing Research-Grade Mathematics (The Accuracy Breakthrough)
**🗣️ In Layman's Terms:** Our initial posture math was okay, but it wasn't perfect. We researched how scientists do this, and found a brilliant paper that uses facial geometry. We updated our app to mathematically calculate the exact center of the left and right sides of your face by creating tiny invisible triangles between your eyes, ears, and nose. We measure the distances from those triangles to your shoulders. We even added a **"Calibrate"** button so the math perfectly adapts to your specific body and webcam angle!

**⚙️ In Technical Terms:** We integrated the feature extraction algorithms from a recent research paper: *"Sitting Posture Correction using YOLOv8 + SVM"*. 
Instead of simple neck angles, we extract robust spatial features:
1.  **Triangle Incenters:** We compute `LFaceCenter` and `RFaceCenter` by finding the mathematical incenter (via perimeter-weighted coordinates) of the triangle formed by the Eye, Ear, and Nose on each side of the face.
2.  **Distance Metrics:** We calculate Euclidean distances between these facial incenters and the shoulders (`s1`, `s2`), normalized by the shoulder width (`s3`).
3.  **Feature Extraction (`f1`, `f2`):**
    - `f1 = |(s1 - s2) * 10| / s3` : Tracks lateral body/head tilt. (Normal ≈ 0.031, Lean ≈ 1.4+).
    - `f2 = (s1 + s2) / s3` : Tracks forward hunch/slouch. (Normal ≈ 1.352, Hunchback < 1.1).
4.  **Dynamic Calibration:** We implemented a calibration matrix. Upon trigger, the app snapshots the user's current `f1` and `f2` states and sets localized baseline thresholds (`f2 * 0.85` for slouching) eliminating false positives across different hardware setups.

### Step 6: Polishing the UI
**🗣️ In Layman's Terms:** We didn't want it to look like a messy science project. We wanted it to feel like an expensive Apple product. We used smooth colors, perfectly rounded corners, and a clean font to make the webcam feed look beautiful. 

**⚙️ In Technical Terms:** We adopted a minimalist design system leveraging vanilla CSS3. We utilized CSS Variables (`:root`) for strict color tokenization (e.g., `--text-main`, `--card-bg`). The layout utilizes CSS Flexbox for fluid, responsive centering. The video feed (`<canvas>`) is styled with `object-fit: cover` and heavily layered box-shadows to simulate depth, while typography is driven by the highly legible `Inter` sans-serif typeface.

---

## 🚀 Instant Deployment (Vercel)

Because this app uses zero server-side logic, it is inherently **serverless** and deploys instantly to Vercel!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

**To deploy your own copy:**
1. Push this repository to your GitHub.
2. Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository.
4. Leave all build settings as default (since it's raw HTML/JS).
5. Click **Deploy!**

You will have a live, blazing-fast URL in seconds.

---

## 🛠️ Local Development

If you want to run it on your own machine without deploying:

1. Clone the repository.
2. Because browsers block webcam access for local `file://` URLs for security, you must serve it via a local server.
3. If you have Python installed, open your terminal in the folder and simply run:
   ```bash
   python -m http.server 8000
   ```
4. Open your browser and go to `http://localhost:8000`

---
<div align="center">
  <i>Developed with ❤️ for better backs everywhere.</i>
</div>
