import { Transporter, createTransport } from 'nodemailer';

const transporter: Transporter = createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
} as any);

export const sendEmail = async (email: string, message: string): Promise<void> => {
  console.log(`Sending email to ${email} with message: ${message}`);

  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: email,
    subject: 'Stock Alert',
    text: message,
  };

  try {
    await transporter.sendMail(mailOptions);
  
    console.log('Email sent successfully');
  } catch(error) {
    console.log('Error sending email: ', error);
  }
};
