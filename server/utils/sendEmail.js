const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // If email configuration is not set, log the URL to the console instead
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log("====================================");
    console.log("EMAIL SIMULATION:");
    console.log(`To: ${options.email}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Message: \n${options.message}`);
    console.log("====================================");
    return;
  }

  // Create a transporter
  const transporter = nodemailer.createTransport({
    service: "gmail", // Can be changed based on the user's provider
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Define the email options
  const mailOptions = {
    from: `Pdf Podcast <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.htmlMessage || options.message.replace(/\n/g, "<br>"),
  };

  // Send the email
  const info = await transporter.sendMail(mailOptions);
  console.log("Message sent: %s", info.messageId);
};

module.exports = sendEmail;
