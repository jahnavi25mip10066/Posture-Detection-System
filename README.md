# 🧍 Posture Monitor: A Robust Posture Detection System

Welcome to the **Posture Monitor** project! This is a simple, human-written, and incredibly robust posture detection system designed to track human pose and correct slouching in real-time.

This project was built to address the growing concern of poor ergonomics in modern workspaces, providing a lightweight, privacy-focused solution that runs entirely locally on your machine.

---

## 👥 The Team & Contributions

This project was a collaborative effort, carefully divided among our team members to ensure a high-quality, full-stack implementation. Below are the core contributors and their specific roles:

*   **Snehal Dixit (Team Lead):** 
    *   **Role:** Project Management & Core Architecture
    *   **Contribution:** Oversaw the entire development lifecycle, made the core architectural decisions regarding the tech stack (choosing MediaPipe + Flask over heavier frameworks), and handled the final integration testing to ensure the AI model communicated seamlessly with the web backend.

*   **Geetesh Parashar:** 
    *   **Role:** Core AI & Detection Logic
    *   **Contribution:** Implemented the Google MediaPipe Pose tracking pipeline. Handled the complex trigonometry required to calculate the angles between the ear, shoulder, and vertical axis to accurately determine when a user transitions from a healthy upright position to a slouching posture.

*   **Vaishnavi Dixit:** 
    *   **Role:** Edge-Case Heuristics & Image Processing
    *   **Contribution:** Focused on making the application robust in real-world environments. Developed the logic for handling partial body visibility (dynamically selecting the most visible side of the body) and engineered the `enhance_low_light` OpenCV algorithm that automatically boosts frame brightness in poor lighting conditions.

*   **Jhanvi Gaur:** 
    *   **Role:** Backend Engineering & Video Streaming
    *   **Contribution:** Set up the Flask micro-server and managed the backend routing. Engineered the MJPEG video streaming protocol in `app.py` to ensure the live camera feed could be transmitted to the web browser smoothly and without noticeable latency.

*   **Pratyasha Singh:** 
    *   **Role:** Frontend Development & UI/UX Design
    *   **Contribution:** Designed and developed the gorgeous, minimalist web interface. Wrote the pure HTML and CSS, focusing on premium typography (using the 'Inter' font), soft shadows, and an intuitive user experience that feels welcoming rather than overly technical.

---

## 📖 The Origin Story: How We Started

The idea for this project was born out of a shared realization: spending hours in front of a computer screen often leads to terrible posture, which can cause chronic back and neck pain over time. We looked at existing solutions and found them lacking. They were either too bloated, required expensive proprietary hardware, or failed the moment the lighting wasn't perfect.

We wanted a solution that was:
1.  **Simple:** No bloated software, no complicated setups. Just run it and it works.
2.  **Forgiving:** Real-world conditions aren't perfect. We don't always have studio lighting, and we don't always sit with our full body in the camera frame. We needed a system that understands human context.
3.  **Gorgeous but Minimal:** The interface shouldn't look like a 90s hacking terminal. It should look clean, modern, and inviting.

So, our team set out to build exactly that. We wrote this code to be as readable as possible, focusing on straightforward logic rather than complex, over-engineered AI architectures. 

---

## 🛠️ What We Used (Tech Stack)

We deliberately kept the tech stack incredibly lightweight and efficient:

*   **Python:** The core language, chosen for its readability, vast ecosystem, and excellent support for AI and computer vision libraries.
*   **Flask:** A micro web-framework for Python. It allows us to serve a beautiful HTML page and stream the webcam video to it with just a few lines of code. It's the absolute simplest way to build a web backend in Python without unnecessary overhead.
*   **MediaPipe:** An amazing open-source project by Google. We use their Pose detection model. It is incredibly fast and highly accurate. We specifically configured the model to `model_complexity=2` (the highest setting) so it performs exceptionally well even when only parts of the body are visible.
*   **OpenCV (`opencv-python`):** The industry standard for real-time image processing. We use it to capture frames from the webcam, automatically adjust brightness in low-light situations (using HSV color space manipulation), and draw the skeleton tracking overlay directly onto the video feed.
*   **Pure HTML/CSS:** No heavy frontend frameworks like React, Vue, or Tailwind. Just clean, semantic HTML and a gorgeous, minimalist CSS file. 

---

## 🧠 How It's Made: The Inner Workings

Here is a detailed breakdown of how the system achieves its robust performance under the hood:

### 1. Handling Low Light Environments
Before the AI even attempts to find your posture, we check if the room is too dark. In `detector.py`, the `enhance_low_light` function converts the raw camera image from the standard BGR color space to the HSV (Hue, Saturation, Value) color space. It measures the overall average of the 'Value' (brightness) channel. If the average brightness falls below a specific threshold, we manually boost the brightness matrix. This simple, human-like heuristic gives the AI model a drastically better image to work with, preventing false negatives in dim rooms.

### 2. Handling Partial Body Visibility (The "Half-Body" Problem)
Most AI models fail if they can't see your legs or your other arm. You don't need your whole body in the frame for our app. The code specifically isolates three key landmarks: your **Ear**, your **Shoulder**, and a virtual reference point directly above your shoulder. 

Because MediaPipe provides a real-time 'visibility confidence score' for every joint it detects, our code runs a dynamic check: *Can it see the left shoulder better, or the right shoulder better?* It automatically swaps its tracking logic to rely on the side of your body that is most visible. This means you can sit at an angle, lean sideways, or only have your chest and head showing, and the math still works perfectly.

### 3. The Posture Math (Trigonometry)
Once we have isolated the robust (x, y) coordinates for your Ear and Shoulder, we use basic trigonometry (the `math.atan2` function inside `calculate_angle`) to measure the angle between your neck line and a perfectly straight vertical line. 
- If your head is leaning too far forward (the angle exceeds a comfortable 20 degrees), the system flags it as slouching. The on-screen text updates and changes to red to alert you.
- If you are sitting upright with your head aligned over your shoulders, the text remains green, indicating a healthy posture.

---

## 🚀 How to Run It

Getting the project up and running takes less than 2 minutes. The application runs entirely locally on your machine, meaning **none of your video data is ever sent to the cloud.**

### Prerequisites
Make sure you have [Python 3.8+](https://www.python.org/downloads/) installed on your computer. 

### Installation

1.  Open your terminal or command prompt.
2.  Navigate to this project folder.
3.  Install the required libraries by running the following command:
    ```bash
    pip install -r requirements.txt
    ```

### Running the App

1.  In your terminal, start the server by running:
    ```bash
    python app.py
    ```
2.  You should see output indicating that the Flask server is running.
3.  Open your preferred web browser (Chrome, Safari, Edge, etc.).
4.  Navigate to this local address: **http://127.0.0.1:5000**
5.  Allow your browser to access your camera if prompted, make sure you are well-lit (or let the app adjust for you), and sit up straight!

---
*Developed with ❤️ by Snehal, Geetesh, Vaishnavi, Jhanvi, and Pratyasha.*
