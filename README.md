# Math Tutor - Shunya Se Shikhar

A comprehensive web application for practicing and solving math problems with AI-powered solution checking using OCR technology. This platform helps students improve their mathematical skills through interactive problem-solving with immediate feedback.

## 📋 Project Overview

**Math Tutor** is an educational platform that:
- Presents mathematical problems of varying difficulty levels
- Allows users to upload images of their handwritten solutions
- Uses AI to analyze and check mathematical work
- Provides detailed feedback on solutions
- Awards points based on correctness
- Tracks user progress over time

## 🛠️ Tech Stack

### Frontend
- **Next.js** - React framework
- **Axios** - API requests
- **KaTeX** - Math rendering

### Backend
- **Flask** - Python web framework
- **SQLAlchemy** - ORM for database operations
- **Werkzeug** - Password hashing and security
- **LangGraph** - AI pipeline orchestration
- **Google Gemini API** - OCR and solution analysis

### Database
- **MySQL** - Relational database

## 🗂️ Project Structure
```
my-project/
├── frontend/               # Next.js frontend application
│   ├── src/
│   │   ├── pages/          # Routes and page components
│   │   ├── services/       # API services
│   │   └── components/     # Reusable UI components
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
│
├── backend/                # Flask backend application
│   ├── app.py              # Main application entry point
│   ├── config.py           # Configuration settings
│   ├── extensions.py       # Flask extensions
│   ├── routes/             # API routes
│   │   ├── user_routes.py  # User authentication and management
│   │   ├── problem_routes.py # Problem and solution management
│   │   └── ocr.py          # OCR and solution analysis
│   ├── models/             # Database models
│   │   ├── user.py         # User model
│   │   ├── problem.py      # Problem and submissions models
│   │   └── rating_history.py # User rating history
│   └── requirements.txt    # Backend dependencies
│
└── questions.json          # Problem dataset
```

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v14+)
- Python (v3.8+)
- MySQL Server
- Git

### Step 1: Clone the Repository

git clone https://github.com/yourusername/math-tutor.git
cd math-tutor

### Step 2: Frontend Setup

cd my-project/frontend
npm install
npm run dev
The frontend will be available at http://localhost:3000

### Step 3: Backend Setup

cd my-project/backend

# Create and activate virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

### Step 4: Database Configuration
Create a MySQL database named math_tutor
Update the database connection string in backend/config.py:

SQLALCHEMY_DATABASE_URI = 'mysql://root:YOUR_PASSWORD@localhost/math_tutor'

Replace YOUR_PASSWORD with your MySQL root password.

### Step 5: Environment Variables
Create a .env file in the backend/routes/ directory:

GOOGLE_API_KEY=YOUR_GOOGLE_API_KEY

Replace YOUR_GOOGLE_API_KEY with your Google API key for the Gemini API. You can obtain one at Google AI Studio.

### Step 6: Run the Backend
python app.py

The backend API will be available at http://localhost:5000

### Step 7: Initialize the Database
To create all the necessary tables in your database:
The backend API will be available at http://localhost:5000

flask db init
flask db migrate -m "Initial migration"
flask db upgrade

### Step 8: Import Problem Data
The application uses a JSON file with math problems:
# Copy questions.json to the proper location
cp questions.json my-project/

## 📝 Usage Guide

### User Authentication

- **Sign Up**: Create a new account with username and password
- **Login**: Access your account
- **Password Reset**: Reset forgotten passwords

### Solving Math Problems

1. View problems organized by difficulty level
2. Solve problems on paper
3. Upload images of your solutions
4. Receive immediate AI-powered feedback
5. Earn points for correct answers

### Point System

- **Full Solutions**: Earn 10 points for fully correct solutions
- **Partial Credit**: Earn 7 points for partially correct solutions
- **Correct Answers Only**: Earn 5 points for correct answers without proper work
- **Incorrect Solutions**: Lose 3 points for incorrect solutions
- **Level Progression**: Advance to higher difficulty levels as you accumulate points

## 🌟 Features

### OCR-Powered Solution Checking

The application uses Google's Gemini 2.5 Pro model to:
- Extract handwritten mathematics from images
- Parse mathematical expressions and steps
- Compare against system solutions
- Generate detailed feedback on student work

### Dynamic Problem Difficulty

- Problems are organized by difficulty levels (1-5)
- Users progress to higher levels as they earn points
- New problems unlock as users advance

### Progress Tracking

- Points persistence across sessions
- Visual feedback for correct/incorrect answers
- User rating history
