import sgMail from '@sendgrid/mail';
import { NextRequest, NextResponse } from 'next/server';

// Set the API key from environment variables
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const { name, managerEmail } = await req.json();

    // Validate input
    if (!name || !managerEmail) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields.' },
        { status: 400 }
      );
    }

    // Compose the email
    const msg = {
      to: managerEmail,
      from: 'your-email@example.com', // Replace with your verified sender email
      subject: 'Task Submission Notification',
      html: `<p>${name} has submitted their tasks for review.</p>`,
    };

    // Send the email
    await sgMail.send(msg);

    return NextResponse.json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send email.' },
      { status: 500 }
    );
  }
}
