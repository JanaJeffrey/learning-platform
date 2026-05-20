// ============================================
// EMAIL CONFIGURATION - Resend
// ============================================
// What it does: Sends professional HTML emails
// How it works: Calls Resend API with email details

const { Resend } = require('resend');

// Initialize Resend with your API key
// Sign up at https://resend.com to get your API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Sender email (must be verified in Resend dashboard)
const FROM_EMAIL = 'noreply@learnhub.com';

// ============================================
// Send Welcome Email (when user registers)
// ============================================
async function sendWelcomeEmail(userName, userEmail) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [userEmail],
      subject: 'Welcome to LearnHub! 🎉',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2563eb, #4f46e5); color: white; padding: 30px; text-align: center; border-radius: 12px; }
            .content { padding: 30px; background: #f9fafb; border-radius: 12px; margin-top: 20px; }
            .button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 20px; }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to LearnHub, ${userName}! 🎓</h1>
            </div>
            <div class="content">
              <h2>Your learning journey starts here</h2>
              <p>We're excited to have you on board! LearnHub gives you access to:</p>
              <ul>
                <li>🎥 High-quality video lessons</li>
                <li>📊 Track your progress</li>
                <li>🎓 Earn certificates upon completion</li>
                <li>💬 Community support</li>
              </ul>
              <a href="https://learnhub.com/courses" class="button">Start Learning Now →</a>
            </div>
            <div class="footer">
              <p>© 2024 LearnHub. All rights reserved.</p>
              <p>You received this email because you created an account on LearnHub.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });
    
    console.log(`✅ Welcome email sent to ${userEmail}`);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Failed to send welcome email:', error);
    return { success: false, error };
  }
}

// ============================================
// Send Enrollment Email (when user enrolls in course)
// ============================================
async function sendEnrollmentEmail(userName, userEmail, courseTitle, coursePrice) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [userEmail],
      subject: `You're enrolled in ${courseTitle}! 🎉`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 12px; }
            .content { padding: 30px; background: #f9fafb; border-radius: 12px; margin-top: 20px; }
            .course-card { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb; }
            .button { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 20px; }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Enrollment Confirmed! 🎉</h1>
            </div>
            <div class="content">
              <h2>Hello ${userName},</h2>
              <p>You have successfully enrolled in:</p>
              <div class="course-card">
                <h3 style="margin: 0 0 10px 0;">📚 ${courseTitle}</h3>
                <p style="margin: 0; color: #6b7280;">${coursePrice === 0 ? 'Free Course' : `Price: ₦${(coursePrice * 1500).toLocaleString()}`}</p>
              </div>
              <p>You now have full access to all course materials. Start learning today!</p>
              <a href="https://learnhub.com/courses/${courseTitle.toLowerCase().replace(/ /g, '-')}" class="button">Start Learning →</a>
            </div>
            <div class="footer">
              <p>© 2024 LearnHub. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });
    
    console.log(`✅ Enrollment email sent to ${userEmail} for course ${courseTitle}`);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Failed to send enrollment email:', error);
    return { success: false, error };
  }
}

// ============================================
// Send Lesson Completion Email
// ============================================
async function sendLessonCompletionEmail(userName, userEmail, lessonTitle, courseTitle, progress) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [userEmail],
      subject: `🎯 You completed "${lessonTitle}"!`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 30px; text-align: center; border-radius: 12px; }
            .content { padding: 30px; background: #f9fafb; border-radius: 12px; margin-top: 20px; }
            .progress-bar { background: #e5e7eb; border-radius: 10px; height: 10px; margin: 20px 0; }
            .progress-fill { background: #10b981; width: ${progress}%; height: 10px; border-radius: 10px; }
            .button { display: inline-block; background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 20px; }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Great Progress! 🎯</h1>
            </div>
            <div class="content">
              <h2>You completed "${lessonTitle}"!</h2>
              <p>Great job, ${userName}! You're making excellent progress in <strong>${courseTitle}</strong>.</p>
              <div class="progress-bar">
                <div class="progress-fill"></div>
              </div>
              <p>Your overall course progress: <strong>${progress}%</strong></p>
              <a href="https://learnhub.com/courses/${courseTitle.toLowerCase().replace(/ /g, '-')}" class="button">Continue Learning →</a>
            </div>
            <div class="footer">
              <p>© 2024 LearnHub. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });
    
    console.log(`✅ Lesson completion email sent to ${userEmail}`);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Failed to send lesson completion email:', error);
    return { success: false, error };
  }
}

// ============================================
// Send Course Completion Email
// ============================================
async function sendCourseCompletionEmail(userName, userEmail, courseTitle) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [userEmail],
      subject: `🏆 Congratulations! You completed ${courseTitle}!`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: white; padding: 30px; text-align: center; border-radius: 12px; }
            .content { padding: 30px; background: #f9fafb; border-radius: 12px; margin-top: 20px; }
            .certificate { text-align: center; padding: 20px; background: white; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb; }
            .button { display: inline-block; background: #8b5cf6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 20px; }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏆 Course Completed! 🏆</h1>
            </div>
            <div class="content">
              <h2>Congratulations, ${userName}!</h2>
              <p>You have successfully completed <strong>${courseTitle}</strong>!</p>
              <div class="certificate">
                <p style="font-size: 14px; color: #6b7280;">🎓 Certificate of Completion</p>
                <p style="font-size: 12px;">This certifies that</p>
                <h3>${userName}</h3>
                <p style="font-size: 12px;">has successfully completed the course</p>
                <p><strong>${courseTitle}</strong></p>
                <p style="font-size: 10px; color: #9ca3af;">Date: ${new Date().toLocaleDateString()}</p>
              </div>
              <a href="https://learnhub.com/certificates/${courseTitle.toLowerCase().replace(/ /g, '-')}" class="button">Download Certificate →</a>
            </div>
            <div class="footer">
              <p>© 2024 LearnHub. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });
    
    console.log(`✅ Course completion email sent to ${userEmail}`);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Failed to send course completion email:', error);
    return { success: false, error };
  }
}

module.exports = {
  sendWelcomeEmail,
  sendEnrollmentEmail,
  sendLessonCompletionEmail,
  sendCourseCompletionEmail,
};