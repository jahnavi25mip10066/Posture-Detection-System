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

## 📖 The Story of This Project

Building this app wasn't a straight line. We set out to solve a simple problem—preventing terrible posture and back pain from long computer sessions—but we quickly realized that building a system that is robust, fast, and accessible to everyone is a major engineering challenge. 

If you're curious about how this all came together, here is the step-by-step journey of how we built it.

### Phase 1: The Python Prototype & Solving Edge Cases
We started by building a traditional Python application. We hooked into the webcam using OpenCV and fed the video frames into Google's **MediaPipe Pose** model. It worked, but it was fragile. If you sat in a dark room, or if the webcam could only see half of your body, the AI completely lost track of your skeleton.

To fix this, we wrote custom heuristics (rules) into the code. 
*   **For lighting:** We converted the video to the HSV color space to measure the exact luminance (brightness) of the room. If it fell below a certain threshold, the code artificially boosted the brightness of the frame before giving it to the AI. 
*   **For the "Half-Body" problem:** We utilized MediaPipe's visibility confidence scores. The code constantly evaluates whether it can see your left shoulder or right shoulder better, dynamically swapping its tracking points so you can sit sideways or partially out of frame without breaking the math.

### Phase 2: The Great Serverless Pivot
With a working Python prototype (using a small Flask web server), we hit our biggest roadblock: Deployment. 

We wanted to host the app on **Vercel** so anyone could use it via a simple web link. However, Vercel runs on cloud servers. When our Python code ran on the cloud, it tried to turn on a webcam *inside the cloud server* instead of the user's laptop! 

We had to make a tough architectural decision. We completely threw away our Python backend and **rewrote the entire application in JavaScript**. By migrating to a Client-Side Rendering (CSR) architecture and using the browser's native `navigator.mediaDevices.getUserMedia` API, we forced the AI to run natively inside the user's browser via WebAssembly. 

This was a massive win. It meant the app became **100% serverless**, insanely fast (zero latency), completely private (no video ever leaves your computer), and perfectly compatible with Vercel deployment.

### Phase 3: Research-Grade Mathematics
With the app running beautifully on the web, we noticed our posture math was still a bit too simple. We were just calculating the angle of the neck, which often failed if the user was looking straight into the camera.

We turned to scientific research and integrated feature extraction algorithms based on a recent paper: *"Sitting Posture Correction using YOLOv8 + SVM"*. 
Instead of a simple neck angle, we wrote code to calculate the **incenter** (the mathematical center) of the invisible triangles formed by your eyes, ears, and nose. We then measured the exact distances from the center of your face to your shoulders. 

To make it flawless, we added a **"Calibrate" button** to the UI. When you sit up straight and click it, the app takes a mathematical snapshot of those facial distances specifically for *your* body and *your* camera angle. It then uses those exact baseline metrics to confidently alert you if you begin to slouch forward or lean too far to the side.

### Phase 4: The Final Polish
Finally, we wrapped all of this heavy math in a gorgeous, Apple-inspired interface. We utilized pure CSS to create soft shadows, rounded borders, blurred overlays (`backdrop-filter`), and crisp typography using the 'Inter' font. We wanted it to feel less like a messy science project and more like a premium health tool.

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
