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

### Core Endpoints
- `GET /api/health` - Health check endpoint with server status and environment info

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile (requires authentication)

### Student Management
- `GET /api/students` - Get all enrolled students
- `POST /api/students/enroll` - Submit new enrollment with email notifications
- `GET /api/students/stats` - Get enrollment statistics and analytics

### Course Management
- `GET /api/courses` - Get all courses with filtering and pagination
- `POST /api/courses` - Create new course
- `GET /api/courses/:id` - Get specific course details
- `PUT /api/courses/:id` - Update course information
- `DELETE /api/courses/:id` - Delete course

### Contact System
- `POST /api/contact/inquiry` - Submit contact form inquiry with email notifications
- `GET /api/contact/inquiries` - Get all contact inquiries (admin only)
- `GET /api/contact/inquiries/:id` - Get specific inquiry details
- `PUT /api/contact/inquiries/:id/status` - Update inquiry status

### Gallery Management
- `GET /api/gallery` - Get all gallery images
- `POST /api/gallery/upload` - Upload new image (with validation)
- `DELETE /api/gallery/:id` - Delete gallery image

### Testimonials
- `GET /api/testimonials` - Get all testimonials
- `POST /api/testimonials` - Submit new testimonial
- `GET /api/testimonials/:id` - Get specific testimonial
- `PUT /api/testimonials/:id` - Update testimonial
- `DELETE /api/testimonials/:id` - Delete testimonial

### Admin Dashboard (Admin Only)
- `GET /api/admin/dashboard` - Comprehensive dashboard statistics
- `GET /api/admin/users` - User management
- `GET /api/admin/analytics` - Detailed analytics and reports
- `GET /api/admin/system` - System health and configuration

## Database Schema

The backend uses SQLite with a comprehensive database schema that includes the following tables:

### Core Tables
- **users** - User accounts with authentication and roles
- **students** - Student enrollment data with contact information
- **courses** - Course catalog with pricing and scheduling
- **contact_inquiries** - Contact form submissions and inquiries
- **testimonials** - Customer testimonials and reviews
- **gallery_images** - Image gallery for the website

### Key Features
- Automatic table creation and initialization
- Foreign key relationships and constraints
- Indexes for optimal query performance
- Data validation and integrity checks
- Migration support for schema updates

### Database File
The SQLite database file (`database.sqlite`) is automatically created in the server directory and includes all necessary tables and initial data.

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

## Security Features

The backend includes comprehensive security measures:

### Authentication & Authorization
- JWT-based authentication with secure token handling
- Password hashing using bcrypt
- Role-based access control (admin, student, teacher)
- Protected admin routes with middleware

### Input Validation & Sanitization
- Comprehensive input validation using express-validator
- SQL injection prevention through parameterized queries
- XSS protection through input sanitization
- File upload validation and security checks

### Rate Limiting & DDoS Protection
- Configurable rate limiting to prevent abuse
- Helmet.js for security headers
- CORS configuration for cross-origin requests
- Request size limits and file upload restrictions

### Error Handling & Logging
- Global error handling middleware
- Comprehensive logging with Morgan
- Graceful error responses without information leakage
- Request/response logging for debugging

## Troubleshooting

### Common Issues
- **Port 5000 in use**: Change the port in `server/config/index.js`
- **Database connection errors**: Check file permissions and SQLite installation
- **Email service errors**: Verify email configuration in environment variables
- **File upload errors**: Check upload directory permissions and size limits

### Debug Mode
Set `NODE_ENV=development` in your environment variables to enable detailed error messages and logging.

### Health Check
Always test the health endpoint first: `GET /api/health`

### Dependencies Check
Ensure all dependencies are installed:
```bash
cd server
npm install
```

### Environment Variables
Create a `.env` file in the server directory with required configuration values.
