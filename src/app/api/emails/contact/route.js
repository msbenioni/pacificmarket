import { Resend } from "resend";

const getCurrentYear = () => new Date().getFullYear();

const emailShell = ({
  accent = "#0d4f4f",
  title,
  intro,
  detailsHtml = "",
  bodyHtml = "",
}) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #ffffff;">
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="width: 56px; height: 56px; background: ${accent}; border-radius: 50%; margin: 0 auto 16px;"></div>
      <h1 style="color: #0a1628; margin: 0; font-size: 28px; line-height: 1.2;">Pacific Discovery Network</h1>
      <p style="color: #6b7280; font-size: 14px; margin: 8px 0 0 0;">Trusted Pacific business discovery platform</p>
    </div>

    <h2 style="color: #0a1628; margin-bottom: 16px; font-size: 24px; line-height: 1.3;">${title}</h2>

    <p style="color: #334155; line-height: 1.7; margin-bottom: 20px; font-size: 15px;">
      ${intro}
    </p>

    ${
      detailsHtml
        ? `
      <div style="background: #f8f9fc; padding: 20px; border-radius: 12px; margin-bottom: 20px; border: 1px solid #e5e7eb;">
        ${detailsHtml}
      </div>
    `
        : ""
    }

    ${
      bodyHtml
        ? `
      <div style="color: #334155; line-height: 1.7; margin-bottom: 20px; font-size: 15px;">
        ${bodyHtml}
      </div>
    `
        : ""
    }

    <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 32px; text-align: center;">
      <p style="color: #94a3b8; font-size: 12px; margin: 0;">
        © ${getCurrentYear()} Pacific Discovery Network. All rights reserved.
      </p>
    </div>
  </div>
`;

export async function POST(request) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { name, email, subject, message, inquiryType, marketingConsent } =
    await request.json();

  try {
    // Send notification to Pacific Discovery Network team
    const teamEmail = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: process.env.RESEND_FROM_EMAIL,
      subject: `New enquiry: ${inquiryType} - ${subject}`,
      html: emailShell({
        title: "New contact enquiry received",
        intro: `A new message has been submitted through the Pacific Discovery Network contact form.`,
        detailsHtml: `
          <p style="margin: 0 0 10px 0;"><strong>Enquiry type:</strong> ${inquiryType}</p>
          <p style="margin: 0 0 10px 0;"><strong>From:</strong> ${name} (${email})</p>
          <p style="margin: 0 0 10px 0;"><strong>Subject:</strong> ${subject}</p>
          <p style="margin: 0;"><strong>Marketing consent:</strong> ${marketingConsent ? "Yes" : "No"}</p>
        `,
        bodyHtml: `
          <h3 style="color: #0a1628; margin: 0 0 10px 0; font-size: 16px;">Message</h3>
          <div style="background: #f8f9fc; padding: 15px; border-radius: 8px; white-space: pre-wrap; border: 1px solid #e5e7eb;">
            ${message}
          </div>
        `,
      }),
    });

    // Send confirmation email to user
    const userEmail = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: email,
      subject: `We’ve received your message — Pacific Discovery Network`,
      html: emailShell({
        title: "Thank you for reaching out",
        intro: `Hi ${name},<br /><br />Thank you for contacting Pacific Discovery Network. We’ve received your message and will review it as soon as possible.`,
        detailsHtml: `
          <p style="margin: 0 0 10px 0;"><strong>Subject:</strong> ${subject}</p>
          <p style="margin: 0 0 10px 0;"><strong>Enquiry type:</strong> ${inquiryType}</p>
          <p style="margin: 0;"><strong>Email:</strong> ${email}</p>
        `,
        bodyHtml: `
          <div style="background: #f8f9fc; padding: 15px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #e5e7eb;">
            <p style="margin: 0 0 6px 0; font-weight: 600; color: #0a1628;">Your message</p>
            <p style="margin: 0; font-style: italic; color: #334155;">
              ${message.substring(0, 200)}${message.length > 200 ? "..." : ""}
            </p>
          </div>

          <p style="margin: 0;">
            If your enquiry is urgent, you can reply directly to this email or contact us at
            <a href="mailto:${process.env.RESEND_FROM_EMAIL}" style="color: #0d4f4f;"> ${process.env.RESEND_FROM_EMAIL}</a>.
          </p>
        `,
      }),
    });

    return Response.json({
      success: true,
      message: "Message sent successfully",
      teamEmail: teamEmail.data,
      userEmail: userEmail.data,
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return new Response(error.message || "Failed to send message", {
      status: 500,
    });
  }
}