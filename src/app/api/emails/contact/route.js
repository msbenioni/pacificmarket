import { Resend } from "resend";

export async function POST(request) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { name, email, subject, message, inquiryType, marketingConsent } = await request.json();

  try {
    // Send notification to Pacific Market team
    const teamEmail = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: process.env.RESEND_FROM_EMAIL, // Send to yourself for now
      subject: `Pacific Market Contact: ${inquiryType} - ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="width: 50px; height: 50px; background: #0d4f4f; border-radius: 50%; margin: 0 auto 15px;"></div>
            <h1 style="color: #0a1628; margin: 0;">Pacific Market</h1>
          </div>
          
          <h2 style="color: #0a1628; margin-bottom: 20px;">New Contact Form Submission</h2>
          
          <div style="background: #f8f9fc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p style="margin: 0 0 10px 0;"><strong>Inquiry Type:</strong> ${inquiryType}</p>
            <p style="margin: 0 0 10px 0;"><strong>From:</strong> ${name} (${email})</p>
            <p style="margin: 0 0 10px 0;"><strong>Subject:</strong> ${subject}</p>
            <p style="margin: 0 0 10px 0;"><strong>Marketing Consent:</strong> ${marketingConsent ? 'Yes' : 'No'}</p>
          </div>
          
          <div style="margin-bottom: 20px;">
            <h3 style="color: #0a1628; margin-bottom: 10px;">Message:</h3>
            <div style="background: #f8f9fc; padding: 15px; border-radius: 8px; white-space: pre-wrap;">${message}</div>
          </div>
          
          <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; text-align: center;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              © 2024 Pacific Market. All rights reserved.
            </p>
          </div>
        </div>
      `,
    });

    // Send confirmation email to user
    const userEmail = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: email,
      subject: `We've received your message - Pacific Market`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="width: 50px; height: 50px; background: #0d4f4f; border-radius: 50%; margin: 0 auto 15px;"></div>
            <h1 style="color: #0a1628; margin: 0;">Pacific Market</h1>
          </div>
          
          <h2 style="color: #0a1628; margin-bottom: 20px;">Thank you for contacting us!</h2>
          
          <p style="color: #333; line-height: 1.6; margin-bottom: 20px;">
            Hi ${name},
          </p>
          
          <p style="color: #333; line-height: 1.6; margin-bottom: 20px;">
            We've received your message regarding "${subject}" and will get back to you within 2-3 business days.
          </p>
          
          <div style="background: #f8f9fc; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <p style="margin: 0 0 5px 0;"><strong>Your message:</strong></p>
            <p style="margin: 0; font-style: italic;">${message.substring(0, 200)}${message.length > 200 ? '...' : ''}</p>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-bottom: 20px;">
            If you need to reach us urgently, you can email us directly at <a href="mailto:contact@pacificmarket.com">contact@pacificmarket.com</a>
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
      message: "Message sent successfully",
      teamEmail: teamEmail.data,
      userEmail: userEmail.data
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return new Response(error.message || "Failed to send message", { status: 500 });
  }
}
