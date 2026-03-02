import { Resend } from "resend";

export async function POST(request) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { ownerEmail, ownerName, businessName, businessId } = await request.json();

  try {
    const data = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: ownerEmail,
      subject: `You're invited to manage ${businessName} on Pacific Market`,
      html: `<p>Hi ${ownerName},</p><p>You have been invited to manage <strong>${businessName}</strong> on Pacific Market.</p><p>Open the registry to accept: <a href="${process.env.NEXT_PUBLIC_APP_URL}/customer-portal?business=${businessId}">View invitation</a></p>`,
    });

    return Response.json({ data });
  } catch (error) {
    return new Response(error.message || "Resend error", { status: 500 });
  }
}
