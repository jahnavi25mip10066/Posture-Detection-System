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

## ✨ Features

- **🌐 Browser Native:** Runs entirely locally via JavaScript. Zero backend, zero latency, maximum privacy.
- **🌗 Edge-Case Resilience:** Intelligently handles partial body views by dynamically calculating the most visible side of your skeleton.
- **💅 Gorgeous UI:** Built with pure HTML/CSS. Features an Apple-inspired minimalist design, soft shadows, and crisp typography.

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

## 🚀 Instant Deployment (Vercel)

Because this app uses zero server-side Python, it is inherently **serverless** and deploys instantly to Vercel!

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
