import nodemailer from "nodemailer";

const getCurrentYear = () => new Date().getFullYear();

// Create SMTP transporter using Google Workspace
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

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
  const transporter = createTransporter();
  const { business, userEmail, userName } = await request.json();

  try {
    let businessEmailSent = false;

    // Send notification to business owner if a contact email exists
    if (business.contact_email) {
      try {
        await transporter.sendMail({
          from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
          to: business.contact_email,
          subject: `New discovery enquiry for ${business.name}`,
          html: emailShell({
            title: "New discovery enquiry",
            intro: `Someone has discovered <strong>${business.name}</strong> through Pacific Discovery Network and would like to connect with your business.`,
            detailsHtml: `
              <p style="margin: 0 0 10px 0;"><strong>Business:</strong> ${business.name}</p>
              <p style="margin: 0 0 10px 0;"><strong>Name:</strong> ${userName}</p>
              <p style="margin: 0 0 10px 0;"><strong>Email:</strong> ${userEmail}</p>
              <p style="margin: 0;"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            `,
            bodyHtml: `
              Reaching out promptly can help turn discovery into a meaningful conversation, customer relationship, or business opportunity.
            `,
          }),
        });

        businessEmailSent = true;
      } catch (error) {
        console.error("Failed to send business email:", error);
      }
    }

    // Send internal notification to Pacific Discovery Network team
    await transporter.sendMail({
      from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
      to: process.env.SMTP_FROM_EMAIL,
      subject: `Discovery enquiry: ${business.name}`,
      html: emailShell({
        title: "Business discovery enquiry received",
        intro: `A new enquiry has been submitted through Pacific Discovery Network for <strong>${business.name}</strong>.`,
        detailsHtml: `
          <p style="margin: 0 0 10px 0;"><strong>Business:</strong> ${business.name}</p>
          <p style="margin: 0 0 10px 0;"><strong>Industry:</strong> ${business.industry || "Not specified"}</p>
          <p style="margin: 0 0 10px 0;"><strong>Location:</strong> ${
            business.city ? `${business.city}, ${business.country}` : business.country || "Not specified"
          }</p>
          <p style="margin: 0 0 10px 0;"><strong>Name:</strong> ${userName}</p>
          <p style="margin: 0 0 10px 0;"><strong>Email:</strong> ${userEmail}</p>
          <p style="margin: 0 0 10px 0;"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          <p style="margin: 0;"><strong>Business notified:</strong> ${
            businessEmailSent ? "Yes" : "No — no contact email available"
          }</p>
        `,
        bodyHtml: `
          This enquiry was generated through the Pacific Discovery Network discovery experience.
        `,
      }),
    });

    return Response.json({
      success: true,
      message: "Contact request sent successfully",
      businessNotified: businessEmailSent,
    });
  } catch (error) {
    console.error("Business contact error:", error);
    return new Response(error.message || "Failed to send contact request", {
      status: 500,
    });
  }
}