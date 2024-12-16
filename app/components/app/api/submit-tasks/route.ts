import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { userInfo, tasks, weekNumber, totalHours } = await req.json();

    const emailHtml = `
      <h1>Weekly Task Plan Submission</h1>
      <p><strong>From:</strong> ${userInfo.name} (${userInfo.email})</p>
      <p><strong>Week Number:</strong> ${weekNumber}</p>
      <p><strong>Total Hours:</strong> ${totalHours}</p>
      
      <h2>Tasks Summary</h2>
      <table border="1" cellpadding="5">
        <tr>
          <th>Description</th>
          <th>Duration</th>
          <th>Status</th>
          <th>Mon</th>
          <th>Tue</th>
          <th>Wed</th>
          <th>Thu</th>
          <th>Fri</th>
        </tr>
        ${tasks
          .filter((task: any) => task.description)
          .map((task: any) => `
            <tr>
              <td>${task.description}</td>
              <td>${task.duration}</td>
              <td>${task.isCompleted ? 'Completed' : task.isDeferred ? 'Deferred' : 'Pending'}</td>
              <td>${task.monday || '-'}</td>
              <td>${task.tuesday || '-'}</td>
              <td>${task.wednesday || '-'}</td>
              <td>${task.thursday || '-'}</td>
              <td>${task.friday || '-'}</td>
            </tr>
          `).join('')}
      </table>
    `;

    await resend.emails.send({
      from: 'tasks@yourdomain.com', // Update this with your verified domain in Resend
      to: userInfo.managerEmail,
      subject: `Task Plan Submission - Week ${weekNumber}`,
      html: emailHtml,
    });

    return NextResponse.json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { message: 'Error sending email' },
      { status: 500 }
    );
  }
}
