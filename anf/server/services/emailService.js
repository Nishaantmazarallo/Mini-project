const nodemailer = require('nodemailer');
const config = require('../config');

class EmailService {
  constructor() {
    // Check if email configuration is available
    this.isConfigured = config.email.host && config.email.user && config.email.pass;

    if (this.isConfigured) {
      this.transporter = nodemailer.createTransport({
        host: config.email.host,
        port: config.email.port,
        secure: config.email.secure,
        auth: {
          user: config.email.user,
          pass: config.email.pass
        }
      });
    } else {
      console.log('Email service not configured - emails will be logged instead of sent');
    }
  }

  // Send enrollment confirmation email
  async sendEnrollmentConfirmation(studentData) {
    if (!this.isConfigured) {
      console.log(`[EMAIL SIMULATION] Enrollment confirmation email would be sent to ${studentData.email}`);
      return true;
    }

    const mailOptions = {
      from: config.email.from,
      to: studentData.email,
      subject: 'Welcome to ANF Academy - Enrollment Confirmation',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #4CAF50; color: white; padding: 20px; text-align: center;">
            <h1>Welcome to ANF Academy!</h1>
          </div>

          <div style="padding: 20px; background-color: #f9f9f9;">
            <h2>Enrollment Confirmation</h2>
            <p>Dear ${studentData.name},</p>

            <p>Thank you for enrolling with ANF Academy! We are excited to have you join our learning community.</p>

            <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3>Enrollment Details:</h3>
              <ul>
                <li><strong>Student Name:</strong> ${studentData.name}</li>
                <li><strong>Age:</strong> ${studentData.age}</li>
                <li><strong>Level:</strong> ${studentData.level}</li>
                <li><strong>Enrollment ID:</strong> ${studentData.id}</li>
                <li><strong>Enrollment Date:</strong> ${new Date().toLocaleDateString()}</li>
              </ul>
            </div>

            <p>Our team will contact you shortly to discuss the next steps and schedule your classes.</p>

            <div style="background-color: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3>What's Next?</h3>
              <ul>
                <li>You will receive a welcome call from our team</li>
                <li>We'll discuss your learning goals and schedule</li>
                <li>You'll get access to our learning materials</li>
                <li>Regular progress updates will be provided</li>
              </ul>
            </div>

            <p>If you have any questions, please don't hesitate to contact us:</p>
            <ul>
              <li><strong>Phone:</strong> +91 9944971008</li>
              <li><strong>Email:</strong> anfacademy@gmail.com</li>
            </ul>

            <p>We look forward to helping you achieve your learning goals!</p>

            <div style="text-align: center; margin-top: 30px;">
              <p><strong>Best regards,<br>ANF Academy Team</strong></p>
            </div>
          </div>

          <div style="background-color: #333; color: white; padding: 10px; text-align: center; font-size: 12px;">
            <p>&copy; 2024 ANF Academy. All rights reserved.</p>
          </div>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Enrollment confirmation email sent to ${studentData.email}`);
      return true;
    } catch (error) {
      console.error('Error sending enrollment confirmation email:', error);
      return false;
    }
  }

  // Send contact form response email
  async sendContactResponse(contactData) {
    if (!this.isConfigured) {
      console.log(`[EMAIL SIMULATION] Contact response email would be sent to ${contactData.email}`);
      return true;
    }

    const mailOptions = {
      from: config.email.from,
      to: contactData.email,
      subject: 'Thank you for contacting ANF Academy',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #2196F3; color: white; padding: 20px; text-align: center;">
            <h1>Thank You for Contacting Us!</h1>
          </div>

          <div style="padding: 20px; background-color: #f9f9f9;">
            <h2>We Received Your Message</h2>
            <p>Dear ${contactData.name},</p>

            <p>Thank you for reaching out to ANF Academy. We have received your inquiry and our team will get back to you within 24 hours.</p>

            <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3>Your Message Details:</h3>
              <ul>
                <li><strong>Name:</strong> ${contactData.name}</li>
                <li><strong>Email:</strong> ${contactData.email}</li>
                <li><strong>Phone:</strong> ${contactData.phone || 'Not provided'}</li>
                <li><strong>Program Interest:</strong> ${contactData.program || 'General inquiry'}</li>
                <li><strong>Message:</strong> ${contactData.message}</li>
              </ul>
            </div>

            <p>In the meantime, you can:</p>
            <ul>
              <li>Visit our website for more information about our programs</li>
              <li>Call us directly at +91 9944971008</li>
              <li>Follow us on social media for updates</li>
            </ul>

            <div style="background-color: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3>Our Contact Information:</h3>
              <p><strong>Address:</strong> Ramanputhur Market Road, behind Little Flower Nursery and Primary School, opposite Joseph AC Hall, Ramanputhur, Simon Nagar, Nagercoil, Tamil Nadu 629004</p>
              <p><strong>Phone:</strong> +91 9944971008</p>
              <p><strong>Email:</strong> anfacademy@gmail.com</p>
              <p><strong>Business Hours:</strong> Monday - Friday: 9:00 AM - 6:00 PM</p>
            </div>

            <p>We appreciate your interest in ANF Academy and look forward to assisting you!</p>

            <div style="text-align: center; margin-top: 30px;">
              <p><strong>Best regards,<br>ANF Academy Team</strong></p>
            </div>
          </div>

          <div style="background-color: #333; color: white; padding: 10px; text-align: center; font-size: 12px;">
            <p>&copy; 2024 ANF Academy. All rights reserved.</p>
          </div>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Contact response email sent to ${contactData.email}`);
      return true;
    } catch (error) {
      console.error('Error sending contact response email:', error);
      return false;
    }
  }

  // Send admin notification for new enrollment
  async sendAdminEnrollmentNotification(studentData) {
    if (!this.isConfigured) {
      console.log(`[EMAIL SIMULATION] Admin enrollment notification would be sent for student ${studentData.name}`);
      return true;
    }

    const mailOptions = {
      from: config.email.from,
      to: config.email.adminEmail,
      subject: 'New Student Enrollment - ANF Academy',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #FF9800; color: white; padding: 20px; text-align: center;">
            <h1>New Student Enrollment Alert</h1>
          </div>

          <div style="padding: 20px; background-color: #f9f9f9;">
            <h2>New Enrollment Received</h2>
            <p>A new student has enrolled in ANF Academy. Please review the details below:</p>

            <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3>Student Information:</h3>
              <ul>
                <li><strong>Student Name:</strong> ${studentData.name}</li>
                <li><strong>Age:</strong> ${studentData.age}</li>
                <li><strong>Email:</strong> ${studentData.email}</li>
                <li><strong>Phone:</strong> ${studentData.phone}</li>
                <li><strong>Level:</strong> ${studentData.level}</li>
                <li><strong>Parent Name:</strong> ${studentData.parent_name || 'Not provided'}</li>
                <li><strong>Parent Phone:</strong> ${studentData.parent_phone || 'Not provided'}</li>
                <li><strong>Enrollment ID:</strong> ${studentData.id}</li>
                <li><strong>Enrollment Date:</strong> ${new Date().toLocaleDateString()}</li>
                <li><strong>Status:</strong> ${studentData.status}</li>
              </ul>
            </div>

            <div style="background-color: #fff3e0; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3>Action Required:</h3>
              <ul>
                <li>Review the enrollment details</li>
                <li>Contact the student/parent to confirm enrollment</li>
                <li>Schedule initial assessment if required</li>
                <li>Update enrollment status in the system</li>
              </ul>
            </div>

            <p>You can view all enrollments in the admin panel or contact the student directly using the provided information.</p>

            <div style="text-align: center; margin-top: 30px;">
              <p><strong>ANF Academy Admin System</strong></p>
            </div>
          </div>

          <div style="background-color: #333; color: white; padding: 10px; text-align: center; font-size: 12px;">
            <p>&copy; 2024 ANF Academy. All rights reserved.</p>
          </div>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Admin enrollment notification sent to ${config.email.adminEmail}`);
      return true;
    } catch (error) {
      console.error('Error sending admin enrollment notification:', error);
      return false;
    }
  }

  // Send admin notification for new contact inquiry
  async sendAdminContactNotification(contactData) {
    if (!this.isConfigured) {
      console.log(`[EMAIL SIMULATION] Admin contact notification would be sent for inquiry from ${contactData.name}`);
      return true;
    }

    const mailOptions = {
      from: config.email.from,
      to: config.email.adminEmail,
      subject: 'New Contact Inquiry - ANF Academy',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #9C27B0; color: white; padding: 20px; text-align: center;">
            <h1>New Contact Inquiry Alert</h1>
          </div>

          <div style="padding: 20px; background-color: #f9f9f9;">
            <h2>New Contact Form Submission</h2>
            <p>A new contact inquiry has been received. Please review the details below:</p>

            <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3>Contact Information:</h3>
              <ul>
                <li><strong>Name:</strong> ${contactData.name}</li>
                <li><strong>Email:</strong> ${contactData.email}</li>
                <li><strong>Phone:</strong> ${contactData.phone || 'Not provided'}</li>
                <li><strong>Program Interest:</strong> ${contactData.program || 'General inquiry'}</li>
                <li><strong>Submission Date:</strong> ${new Date().toLocaleDateString()}</li>
              </ul>
            </div>

            <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3>Message:</h3>
              <p style="font-style: italic;">"${contactData.message}"</p>
            </div>

            <div style="background-color: #f3e5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3>Action Required:</h3>
              <ul>
                <li>Review the inquiry details</li>
                <li>Respond to the inquiry within 24 hours</li>
                <li>Update inquiry status in the system</li>
                <li>Follow up if additional information is needed</li>
              </ul>
            </div>

            <p>Please ensure timely response to maintain our service standards.</p>

            <div style="text-align: center; margin-top: 30px;">
              <p><strong>ANF Academy Admin System</strong></p>
            </div>
          </div>

          <div style="background-color: #333; color: white; padding: 10px; text-align: center; font-size: 12px;">
            <p>&copy; 2024 ANF Academy. All rights reserved.</p>
          </div>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Admin contact notification sent to ${config.email.adminEmail}`);
      return true;
    } catch (error) {
      console.error('Error sending admin contact notification:', error);
      return false;
    }
  }

  // Send welcome email for new user registration
  async sendWelcomeEmail(userData) {
    if (!this.isConfigured) {
      console.log(`[EMAIL SIMULATION] Welcome email would be sent to ${userData.email}`);
      return true;
    }

    const mailOptions = {
      from: config.email.from,
      to: userData.email,
      subject: 'Welcome to ANF Academy - Account Created',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #673AB7; color: white; padding: 20px; text-align: center;">
            <h1>Welcome to ANF Academy!</h1>
          </div>

          <div style="padding: 20px; background-color: #f9f9f9;">
            <h2>Account Successfully Created</h2>
            <p>Dear ${userData.name},</p>

            <p>Welcome to ANF Academy! Your account has been successfully created and you now have access to our platform.</p>

            <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3>Account Details:</h3>
              <ul>
                <li><strong>Name:</strong> ${userData.name}</li>
                <li><strong>Email:</strong> ${userData.email}</li>
                <li><strong>User ID:</strong> ${userData.id}</li>
                <li><strong>Registration Date:</strong> ${new Date().toLocaleDateString()}</li>
              </ul>
            </div>

            <div style="background-color: #e8eaf6; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3>Getting Started:</h3>
              <ul>
                <li>Explore our course offerings</li>
                <li>Complete your profile information</li>
                <li>Browse available programs</li>
                <li>Contact us for enrollment assistance</li>
              </ul>
            </div>

            <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>

            <div style="text-align: center; margin-top: 30px;">
              <p><strong>Best regards,<br>ANF Academy Team</strong></p>
            </div>
          </div>

          <div style="background-color: #333; color: white; padding: 10px; text-align: center; font-size: 12px;">
            <p>&copy; 2024 ANF Academy. All rights reserved.</p>
          </div>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Welcome email sent to ${userData.email}`);
      return true;
    } catch (error) {
      console.error('Error sending welcome email:', error);
      return false;
    }
  }
}

module.exports = EmailService;
