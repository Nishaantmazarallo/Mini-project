# Backend Setup Instructions

## Prerequisites
- Node.js installed on your system
- npm (comes with Node.js)

## Setup Steps

1. **Navigate to the server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the backend server:**
   ```bash
   npm start
   ```

4. **Verify the server is running:**
   Open your browser and go to: `http://localhost:5000/api/health`
   You should see a JSON response indicating the server is running.

## API Endpoints

- `GET /api/health` - Health check endpoint
- `GET /api/students` - Get all enrolled students
- `POST /api/enroll` - Submit new enrollment
- `GET /api/stats` - Get enrollment statistics

## Database
The backend uses SQLite and automatically creates a `database.sqlite` file in the server directory to store student enrollment data.

## Frontend Integration
The React frontend is configured to send enrollment requests to `http://localhost:5000/api/enroll`. Make sure the backend server is running before testing the enrollment form.

## Viewing Enrollment Data
To view all submitted enrollment details:

1. **Access Admin Page**: Navigate to `/admin/enrollments` in your browser
2. **View All Data**: The admin page displays all enrollment submissions in a table format
3. **Export Data**: Click "Export to CSV" to download all enrollment data
4. **Refresh**: Use the refresh button to update the data in real-time

The admin page provides:
- Total enrollment statistics
- Breakdown by course level
- Detailed view of each submission
- Export functionality for data analysis

## Troubleshooting
- If port 5000 is already in use, change the port in `server/server.js`
- Check that all dependencies are installed correctly
- Verify that Node.js is properly installed on your system
