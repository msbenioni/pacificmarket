import { Resend } from "resend";

export async function POST(request) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { business, userEmail, userName } = await request.json();

  try {
    // Send notification to business owner (if they have contact email)
    let businessEmailSent = false;
    if (business.contact_email) {
      try {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL,
          to: business.contact_email,
          subject: `New contact request from Pacific Market - ${userName}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="width: 50px; height: 50px; background: #0d4f4f; border-radius: 50%; margin: 0 auto 15px;"></div>
                <h1 style="color: #0a1628; margin: 0;">Pacific Market</h1>
              </div>
              
              <h2 style="color: #0a1628; margin-bottom: 20px;">New Contact Request</h2>
              
              <p style="color: #333; line-height: 1.6; margin-bottom: 20px;">
                Someone is interested in your business, <strong>${business.name}</strong>, and has requested your contact information through the Pacific Market registry.
              </p>
              
              <div style="background: #f8f9fc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <p style="margin: 0 0 10px 0;"><strong>Interested Party:</strong> ${userName}</p>
                <p style="margin: 0 0 10px 0;"><strong>Email:</strong> ${userEmail}</p>
                <p style="margin: 0 0 10px 0;"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
              </div>
              
              <p style="color: #333; line-height: 1.6; margin-bottom: 20px;">
                You may want to reach out to them promptly to discuss potential business opportunities.
              </p>
              
              <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; text-align: center;">
                <p style="color: #999; font-size: 12px; margin: 0;">
                  © 2024 Pacific Market. All rights reserved.
                </p>
              </div>
            </div>
          `,
        });
        businessEmailSent = true;
      } catch (error) {
        console.error('Failed to send business email:', error);
      }
    }

    // Send notification to Pacific Market team
    const teamEmail = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: process.env.RESEND_FROM_EMAIL,
      subject: `Business Contact Request: ${business.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="width: 50px; height: 50px; background: #0d4f4f; border-radius: 50%; margin: 0 auto 15px;"></div>
            <h1 style="color: #0a1628; margin: 0;">Pacific Market</h1>
          </div>
          
          <h2 style="color: #0a1628; margin-bottom: 20px;">Business Contact Request</h2>
          
          <div style="background: #f8f9fc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p style="margin: 0 0 10px 0;"><strong>Business:</strong> ${business.name}</p>
            <p style="margin: 0 0 10px 0;"><strong>Industry:</strong> ${business.industry || 'Not specified'}</p>
            <p style="margin: 0 0 10px 0;"><strong>Location:</strong> ${business.city ? `${business.city}, ${business.country}` : business.country}</p>
            <p style="margin: 0 0 10px 0;"><strong>Interested Party:</strong> ${userName}</p>
            <p style="margin: 0 0 10px 0;"><strong>Email:</strong> ${userEmail}</p>
            <p style="margin: 0 0 10px 0;"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p style="margin: 0;"><strong>Business Notified:</strong> ${businessEmailSent ? 'Yes' : 'No (no contact email)'}</p>
          </div>
          
          <p style="color: #333; line-height: 1.6; margin-bottom: 20px;">
            This contact request was generated through the Pacific Market business registry.
          </p>
          
          <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; text-align: center;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              © 2024 Pacific Market. All rights reserved.
            </p>
          </div>
        </div>
      `,
    });

    return Response.json({ 
      success: true, 
      message: "Contact request sent successfully",
      businessNotified: businessEmailSent
    });
  } catch (error) {
    console.error('Business contact error:', error);
    return new Response(error.message || "Failed to send contact request", { status: 500 });
  }
}
