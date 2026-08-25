# Posture Monitor
**A serverless, privacy-first posture detection web application powered by MediaPipe and research-grade computer vision mathematics.**

<p>
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/MediaPipe-0071E3?style=for-the-badge&logo=google&logoColor=white" alt="MediaPipe" />
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
</p>

---

## 👥 Core Contributors

This project was developed by a team of five software engineers. The workload was distributed evenly across architecture, machine learning, mathematics, systems, and frontend development to ensure a robust final product.

| Engineer | Primary Focus | Key Contributions |
| :--- | :--- | :--- |
| **Snehal Dixit** | Architecture & DevOps | Designed the serverless architecture, managed the Vercel CI/CD deployment pipeline, and orchestrated the integration of the final client-side processing loop. |
| **Geetesh Parashar** | Machine Learning | Handled the initialization and integration of Google's MediaPipe Pose models, tuning the complexity parameters for optimal browser performance. |
| **Vaishnavi Dixit** | Applied Mathematics | Researched and engineered the complex spatial features (triangle incenters and Euclidean distances) required to accurately classify slouching and lateral leaning. |
| **Jhanvi Gaur** | Systems & Data Pipeline | Managed the `getUserMedia` hardware interfacing, handled edge-case occlusion logic, and engineered the high-performance HTML5 Canvas rendering engine. |
| **Pratyasha Singh** | Frontend & State Management | Architected the responsive UI, designed the CSS design system, and engineered the dynamic calibration state management for localized accuracy. |

---

## 📖 Project Architecture & Development Journey

The development of this application was an iterative process of solving complex engineering problems. We transitioned through several architectural phases to achieve our goal of building a fast, private, and highly accurate posture monitor.

### Phase 1: The Monolithic Prototype
We initially approached the problem by building a traditional monolithic application using Python. The architecture relied on OpenCV to ingest video streams and a Flask micro-server to stream the processed frames to a web interface. While functional, we quickly identified severe limitations in edge-case handling. If the user sat in a dark room or partially out of frame, the skeletal tracking failed. 

To mitigate this, the team engineered custom heuristics. We implemented dynamic visibility checks to swap tracking anchors if one side of the body was occluded, and applied HSV color-space transformations to artificially enhance luminance in low-light environments.

### Phase 2: The Serverless Migration
As we prepared to deploy the application for public use, we encountered a fundamental infrastructure conflict. We intended to host the application on Vercel (a serverless cloud provider), but our Python backend relied on hardware interrupts (`cv2.VideoCapture`) to access local webcams. Cloud containers cannot access client-side hardware peripherals.

To solve this, we executed a complete architectural pivot. We deprecated the Python backend entirely and transitioned to a **Client-Side Rendering (CSR)** model. By leveraging WebAssembly and the browser-native `navigator.mediaDevices` API, we successfully ported the entire machine learning pipeline into JavaScript. This resulted in a **100% serverless application** with zero latency, zero server compute costs, and absolute privacy, as video data is processed locally and never transmitted over the network.

### Phase 3: Research-Grade Mathematics
While the new serverless architecture was highly performant, our initial method for classifying poor posture (simple neck angle calculation) was prone to false positives when the user faced the camera directly. 

To achieve professional-grade accuracy, we integrated feature extraction algorithms derived from a recent research paper on SVM-based posture correction. We implemented advanced facial geometry calculations to find the mathematical **incenter** of the triangles formed by the user's eyes, ears, and nose. By calculating the normalized Euclidean distances from these facial centers to the shoulders, we created highly robust spatial features (`f1` for lateral leaning, `f2` for forward slouching).

### Phase 4: Dynamic Calibration & UI Polish
Because human biomechanics and webcam placements vary wildly, static thresholds for the math models still yielded occasional inaccuracies. We resolved this by engineering a **Dynamic Calibration System**. 

The UI features a "Calibrate" function that allows the user to snapshot their optimal posture baseline. The application dynamically adjusts the mathematical thresholds based on this personal matrix. Finally, the heavy mathematical logic was wrapped in a premium, minimalist CSS interface utilizing soft shadowing, backdrop filters, and typography optimized for readability.

---

## 🚀 Deployment (Vercel)

This application utilizes zero server-side logic. It is entirely serverless and can be deployed instantly as a static site.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

**Deployment Steps:**
1. Fork or push this repository to your GitHub account.
2. Navigate to [Vercel](https://vercel.com) and select **Add New Project**.
3. Import the repository.
4. Leave all build settings default (the platform will auto-detect the static HTML/JS structure).
5. Deploy.

---

## 🛠️ Local Development

To run the application locally in a development environment:

1. Clone the repository to your local machine.
2. For security reasons, modern web browsers block webcam access for `file://` protocols. You must serve the directory via a local HTTP server.
3. If Python is installed, navigate to the project directory in your terminal and execute:
   ```bash
   python -m http.server 8000
   ```
4. Access the application via `http://localhost:8000` in your web browser.
