🌊 AquaLens — OceanScan AI
AI-powered underwater sonar intelligence for detecting, classifying, and visualizing marine debris and anomalies.

AquaLens (OceanScan AI) is a full-stack computer-vision platform designed to analyze Side-Scan Sonar (SSS) imagery and turn difficult-to-interpret underwater scans into actionable information.

The system combines sonar-image enhancement, AI-based detection, classification, geo-tagging, and GIS visualization in a single workflow.

🚀 Project Overview
Underwater sonar imagery can contain noise, low-contrast regions, seabed clutter, marine debris, and unknown anomalies. Manual inspection of large sonar datasets can be time-consuming and requires trained analysts.

AquaLens aims to simplify this workflow by providing an AI-assisted pipeline:

Side-Scan Sonar Image
        ↓
Image Preprocessing & Enhancement
        ↓
AI Detection / Classification
        ↓
Debris & Anomaly Analysis
        ↓
Geo-Tagging
        ↓
GIS Visualization
        ↓
Detection Report
✨ Key Features
🖼️ Side-Scan Sonar Image Processing

🔍 Sonar Image Enhancement

🤖 AI-Based Object Detection

🧠 Marine Debris & Anomaly Classification

⚠️ Risk / Detection Information

📍 Geo-Tagging Support

🗺️ Interactive GIS Visualization

📊 Detection Dashboard

📄 Inspection / Detection Reporting

🔌 REST API Backend

🗄️ PostgreSQL Database Support

💻 Modern React Web Interface

🧠 AI & Image Processing
The project is designed around a computer-vision pipeline for underwater sonar imagery.

Image Processing
OpenCV

NumPy

Image enhancement

Noise reduction

Normalization

Contrast improvement

AI / Computer Vision
PyTorch

CNN-based models

YOLO-based object detection

Classification

Anomaly detection concepts

The AI pipeline can be extended as additional labelled sonar datasets become available.

🏗️ Technology Stack
Frontend
Technology	Purpose
React	User interface
Vite	Frontend development/build
TypeScript / JavaScript	Application logic
Tailwind CSS	UI styling
Leaflet	GIS / interactive maps
Backend
Technology	Purpose
Python	Core backend and AI processing
FastAPI	REST API
SQLAlchemy	Database ORM
OpenCV	Image processing
NumPy	Numerical processing
PyTorch	AI / deep learning
Database
PostgreSQL

Supabase PostgreSQL

SQLite fallback for local development

📁 Project Structure
aquaLens/
│
├── project/
│   │
│   ├── backend/
│   │   ├── main.py
│   │   ├── requirements.txt
│   │   ├── .env
│   │   └── ...
│   │
│   └── frontend/
│       ├── package.json
│       ├── src/
│       └── ...
│
├── README.md
└── package.json
⚙️ Installation & Setup
1. Clone the repository
git clone <YOUR_REPOSITORY_URL>
cd aquaLens
2. Backend Setup
Navigate to the backend:

cd project/backend
Create a virtual environment:

python -m venv venv
Activate it on Windows:

venv\Scripts\activate
Install dependencies:

pip install -r requirements.txt
3. Environment Variables
Create a .env file inside:

project/backend/.env
Example:

DATABASE_URL=your_postgresql_connection_string
Important: Never commit database passwords, API keys, tokens, or other secrets to GitHub.

For public repositories, use an .env.example file instead.

4. Start the Backend
From:

project/backend
run:

python main.py
The API will normally be available at:

http://localhost:8000
FastAPI documentation:

http://localhost:8000/docs
5. Frontend Setup
Open a new terminal:

cd project/frontend
Install dependencies:

npm install
Start the development server:

npm run dev
The frontend will normally run at:

http://localhost:5173
🔄 Application Workflow
1. Upload / Input
A Side-Scan Sonar image is provided to the application.

2. Preprocessing
The image can undergo:

Noise reduction

Contrast enhancement

Normalization

Other preprocessing operations

3. AI Analysis
The processed image is passed through the AI pipeline to identify:

Known marine debris

Potential hazards

Unknown anomalies

Relevant visual patterns

4. Classification
Detected objects or regions can be categorized according to the trained model.

5. Geo-Tagging
When suitable location metadata is available, detections can be associated with geographic coordinates.

6. Visualization
Results can be displayed through an interactive GIS dashboard.

7. Reporting
Detection information can be organized into inspection or analysis reports.

🗺️ GIS Intelligence
AquaLens uses interactive mapping to provide a geographic view of underwater findings.

The GIS layer can be used to visualize:

Detection locations

Marine debris

Potential hazards

Unknown anomalies

Survey areas

Historical observations

🗄️ Database
The application supports PostgreSQL-based storage through SQLAlchemy.

Typical information can include:

Detection
├── ID
├── Detection Type
├── Confidence
├── Risk Information
├── Latitude
├── Longitude
├── Image / Scan Reference
└── Timestamp
For local development, the project can also use a SQLite fallback when a PostgreSQL connection is not configured.

🔐 Security
Do not commit sensitive credentials.

Recommended .gitignore entries:

.env
*.db
__pycache__/
venv/
node_modules/
dist/
*.log
Use:

.env.example
to document required environment variables without exposing their values.

📌 Current Project Scope
AquaLens is focused on the following core areas:

Side-Scan Sonar image analysis

Underwater debris detection

Anomaly detection

AI-assisted classification

Image enhancement

GIS visualization

Marine inspection support

The system is intended as an AI-assisted analysis platform and should not be treated as a replacement for expert marine or operational validation.

🔮 Future Enhancements
Potential development areas include:

🎯 Improved sonar detection accuracy

🧠 More advanced anomaly-detection models

📚 Larger labelled sonar datasets

🚤 AUV / ROV integration

⚡ Edge / real-time inference

📡 Live sonar data streaming

🗺️ Advanced spatial analytics

📈 Historical change detection

📄 Automated inspection reports

🔔 Real-time detection alerts

👥 Team — AquaLens
Team Members

Yogeshwaran K

Dharanesh CS

Karthic S

Koushik Prabhu CR

Lishalini K

Mythili J

👨‍💻 Project Contribution
Koushik Prabhu CR

Contributions included:

Project prototype development

Website / UI development

Project structure and functionality

Problem analysis

Solution planning

Team coordination

📸 Project
OceanScan AI
AquaLens provides a unified interface for turning underwater sonar imagery into structured marine intelligence.

SEE THE SEABED.
DETECT THE UNKNOWN.
MAP THE OCEAN.
📄 License
This project is intended for academic, research, and prototype development purposes.

Add the appropriate open-source license to this repository before distributing the project publicly.

⭐ Support
If you find the project useful, consider giving the repository a ⭐ on GitHub.

Built with Python • React • FastAPI • OpenCV • PyTorch • PostgreSQL • GIS

