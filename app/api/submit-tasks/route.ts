import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY || ""); // Fallback for safety

export async function POST(req: NextRequest) {
  try {
    // Parse the incoming request body
    const { name, managerEmail } = await req.json();

    // Validate required fields
    if (!name || !managerEmail) {
      return NextResponse.json(
        { success: false, message: "Missing required fields." },
        { status: 400 }
      );
    }

    // Send the email via Resend
    const emailResponse = await resend.emails.send({
      from: "Your Name <your-email@example.com>", // Replace with your sender email
      to: managerEmail,
      subject: "Task Submission Notification",
      html: `<p>${name} has submitted their tasks for review.</p>`,
    });

    return NextResponse.json({ success: true, message: emailResponse });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send email." },
      { status: 500 }
    );
  }
}
