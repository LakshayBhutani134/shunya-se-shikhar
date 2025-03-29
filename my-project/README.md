# My Project

This project is a web application that consists of a Next.js frontend and a Flask backend, with connectivity to a MySQL database. The application is designed to manage user data, including usernames, user IDs, and rating scores.

## Project Structure

```
my-project
├── frontend          # Contains the Next.js frontend application
│   ├── pages        # Next.js pages
│   ├── public       # Static assets
│   ├── styles       # Global styles
│   ├── package.json # Frontend dependencies and scripts
│   └── next.config.js # Next.js configuration
├── backend           # Contains the Flask backend application
│   ├── app.py       # Entry point for the Flask application
│   ├── requirements.txt # Python dependencies
│   ├── models       # Database models
│   ├── routes       # API routes
│   └── config.py    # Configuration settings
└── .gitignore       # Files to ignore in Git
```

## Setup Instructions

### Frontend

1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```

### Backend

1. Navigate to the `backend` directory.
2. Create a virtual environment (optional but recommended):
   ```
   python -m venv venv
   ```
3. Activate the virtual environment:
   - On Windows:
     ```
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```
     source venv/bin/activate
     ```
4. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
5. Run the Flask application:
   ```
   python app.py
   ```

## Usage

- The frontend will be accessible at `http://localhost:3000`.
- The backend API will be accessible at `http://localhost:5000/api/users`.

## Contributing

Feel free to submit issues or pull requests for any improvements or bug fixes.