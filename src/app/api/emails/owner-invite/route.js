import { Resend } from "resend";

export async function POST(request) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { ownerEmail, ownerName, businessName, businessId } = await request.json();

  // Always use production URL for email links
  const appUrl = process.env.NEXT_PUBLIC_APP_PROD_URL;

  try {
    const invitationUrl = `${appUrl}/customer-portal?business=${businessId}`;
    
    const data = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: ownerEmail,
      subject: `You're invited to manage ${businessName} on Pacific Discovery Network`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="width: 50px; height: 50px; background: #0d4f4f; border-radius: 50%; margin: 0 auto 15px;"></div>
            <h1 style="color: #0a1628; margin: 0;">Pacific Discovery Network</h1>
          </div>
          
          <h2 style="color: #0a1628; margin-bottom: 20px;">You're Invited to Manage a Business</h2>
          
          <p style="color: #333; line-height: 1.6; margin-bottom: 20px;">
            Hi ${ownerName},
          </p>
          
          <p style="color: #333; line-height: 1.6; margin-bottom: 20px;">
            You have been invited to manage <strong>${businessName}</strong> on Pacific Discovery Network. 
            This will give you access to update business information, respond to customer inquiries, and manage the business profile.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${invitationUrl}" 
               style="display: inline-block; background: #0d4f4f; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 8px; font-weight: bold;">
              Accept Invitation
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-bottom: 20px;">
            If you don't have an account yet, we'll help you create one when you click the link above.
          </p>
          
          <p style="color: #666; font-size: 14px; margin-bottom: 20px;">
            This invitation will expire in 7 days. If you need help, please contact support.
          </p>
          
          <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; text-align: center;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              © 2024 Pacific Discovery Network. All rights reserved.
            </p>
          </div>
        </div>
      `,
    });

    return Response.json({ data });
  } catch (error) {
    return new Response(error.message || "Resend error", { status: 500 });
  }
}
