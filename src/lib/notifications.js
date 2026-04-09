import { createPageUrl } from "@/utils";
import nodemailer from "nodemailer";

// Create SMTP transporter using Google Workspace
const createTransporter = () => {
  const required = [
    "SMTP_HOST",
    "SMTP_PORT", 
    "SMTP_USER",
    "SMTP_PASS",
    "SMTP_FROM_EMAIL",
    "SMTP_FROM_NAME",
  ];

  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`Missing required SMTP env var: ${key}`);
    }
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Notification types
export const NOTIFICATION_TYPES = {
  BUSINESS_CLAIMED: "business_claimed",
  BUSINESS_ADDED: "business_added",
  BUSINESS_UPDATED: "business_updated",
  PLAN_UPGRADED: "plan_upgraded",
  PLAN_DOWNGRADED: "plan_downgraded",
  PLAN_CANCELLED: "plan_cancelled",
  PROFILE_UPDATED: "profile_updated",
  CLAIM_SUBMITTED: "claim_submitted",
  CLAIM_APPROVED: "claim_approved",
  CLAIM_REJECTED: "claim_rejected",
  USER_CREATED: "user_created",

  WELCOME_CONFIRMED: "welcome_confirmed",
  REMINDER_NO_BUSINESS: "reminder_no_business",
  ADMIN_BUSINESS_PENDING_APPROVAL: "admin_business_pending_approval",
  ADMIN_CLAIM_PENDING_APPROVAL: "admin_claim_pending_approval",
};

const getAdminUrl = () =>
  `${process.env.NEXT_PUBLIC_SITE_URL || 'https://pacificdiscoverynetwork.com'}${createPageUrl("AdminDashboard")}`;

const getCurrentYear = () => new Date().getFullYear();

const baseEmailShell = ({
  accent = "#0d4f4f",
  title,
  intro,
  detailsHtml = "",
  bodyHtml = "",
  ctaText = "",
  ctaHref = "",
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

    ${
      ctaText && ctaHref
        ? `
      <div style="text-align: center; margin: 32px 0;">
        <a href="${ctaHref}" style="background: ${accent}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600;">
          ${ctaText}
        </a>
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

// Email templates
const getEmailTemplate = (type, data) => {
  const templates = {
    [NOTIFICATION_TYPES.BUSINESS_CLAIMED]: {
      subject: `Business ownership claimed: ${data.businessName}`,
      html: baseEmailShell({
        title: "Business ownership claimed",
        intro: `<strong>${data.ownerName}</strong> has claimed ownership of <strong>${data.businessName}</strong> on Pacific Discovery Network.`,
        detailsHtml: `
          <p style="margin: 0 0 10px 0;"><strong>Business:</strong> ${data.businessName}</p>
          <p style="margin: 0 0 10px 0;"><strong>Owner:</strong> ${data.ownerName}</p>
          <p style="margin: 0 0 10px 0;"><strong>Email:</strong> ${data.ownerEmail}</p>
          <p style="margin: 0 0 10px 0;"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          <p style="margin: 0;"><strong>Claim ID:</strong> ${data.claimId}</p>
        `,
        bodyHtml: `
          Please review this claim in the admin dashboard to confirm ownership and maintain trusted business discovery across the network.
        `,
        ctaText: "Review claim",
        ctaHref: getAdminUrl(),
      }),
    },

    [NOTIFICATION_TYPES.BUSINESS_ADDED]: {
      subject: `New business published: ${data.businessName}`,
      html: baseEmailShell({
        title: "New business added to the network",
        intro: `A new business has been added to Pacific Discovery Network and is now part of the discovery experience.`,
        detailsHtml: `
          <p style="margin: 0 0 10px 0;"><strong>Business:</strong> ${data.businessName}</p>
          <p style="margin: 0 0 10px 0;"><strong>Industry:</strong> ${data.industry || "Not specified"}</p>
          <p style="margin: 0 0 10px 0;"><strong>Location:</strong> ${
            data.city ? `${data.city}, ${data.country}` : data.country || "Not specified"
          }</p>
          <p style="margin: 0 0 10px 0;"><strong>Added by:</strong> ${data.addedBy}</p>
          <p style="margin: 0;"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        `,
        bodyHtml: `
          Review the business to ensure its profile is positioned well for discovery, trust, and visibility.
        `,
        ctaText: "View in admin",
        ctaHref: getAdminUrl(),
      }),
    },

    [NOTIFICATION_TYPES.BUSINESS_UPDATED]: {
      subject: `Business profile updated: ${data.businessName}`,
      html: baseEmailShell({
        title: "Business profile updated",
        intro: `<strong>${data.updatedBy}</strong> has updated the profile for <strong>${data.businessName}</strong>.`,
        detailsHtml: `
          <p style="margin: 0 0 10px 0;"><strong>Business:</strong> ${data.businessName}</p>
          <p style="margin: 0 0 10px 0;"><strong>Updated by:</strong> ${data.updatedBy}</p>
          <p style="margin: 0 0 10px 0;"><strong>Changes:</strong> ${data.changes || "Profile details updated"}</p>
          <p style="margin: 0;"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        `,
        bodyHtml: `
          Reviewing profile changes helps keep business discovery accurate, premium, and trustworthy.
        `,
        ctaText: "Review changes",
        ctaHref: getAdminUrl(),
      }),
    },

    [NOTIFICATION_TYPES.PLAN_UPGRADED]: {
      subject: `Plan upgraded: ${data.businessName}`,
      html: baseEmailShell({
        accent: "#c9a84c",
        title: "Plan upgraded",
        intro: `<strong>${data.businessName}</strong> has upgraded to the <strong>${data.newPlan}</strong> plan.`,
        detailsHtml: `
          <p style="margin: 0 0 10px 0;"><strong>Business:</strong> ${data.businessName}</p>
          <p style="margin: 0 0 10px 0;"><strong>Previous plan:</strong> ${data.previousPlan}</p>
          <p style="margin: 0 0 10px 0;"><strong>New plan:</strong> ${data.newPlan}</p>
          <p style="margin: 0 0 10px 0;"><strong>Owner:</strong> ${data.ownerName}</p>
          <p style="margin: 0;"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        `,
        bodyHtml: `
          This upgrade gives the business stronger visibility, a more premium presence, and enhanced opportunities to be discovered across the network.
        `,
      }),
    },

    [NOTIFICATION_TYPES.PLAN_DOWNGRADED]: {
      subject: `Plan changed: ${data.businessName}`,
      html: baseEmailShell({
        accent: "#f59e0b",
        title: "Plan downgraded",
        intro: `<strong>${data.businessName}</strong> has moved from <strong>${data.previousPlan}</strong> to <strong>${data.newPlan}</strong>.`,
        detailsHtml: `
          <p style="margin: 0 0 10px 0;"><strong>Business:</strong> ${data.businessName}</p>
          <p style="margin: 0 0 10px 0;"><strong>Previous plan:</strong> ${data.previousPlan}</p>
          <p style="margin: 0 0 10px 0;"><strong>New plan:</strong> ${data.newPlan}</p>
          <p style="margin: 0 0 10px 0;"><strong>Owner:</strong> ${data.ownerName}</p>
          <p style="margin: 0;"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        `,
        bodyHtml: `
          Their visibility and available features may now differ from their previous plan level.
        `,
      }),
    },

    [NOTIFICATION_TYPES.PLAN_CANCELLED]: {
      subject: `Plan cancelled: ${data.businessName}`,
      html: baseEmailShell({
        accent: "#dc2626",
        title: "Plan cancelled",
        intro: `The active plan for <strong>${data.businessName}</strong> has been cancelled.`,
        detailsHtml: `
          <p style="margin: 0 0 10px 0;"><strong>Business:</strong> ${data.businessName}</p>
          <p style="margin: 0 0 10px 0;"><strong>Owner:</strong> ${data.ownerName}</p>
          <p style="margin: 0 0 10px 0;"><strong>Cancelled plan:</strong> ${data.previousPlan || "Not specified"}</p>
          <p style="margin: 0;"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        `,
        bodyHtml: `
          Review the account if any visibility, billing, or profile access changes need to be confirmed.
        `,
        ctaText: "Review account",
        ctaHref: getAdminUrl(),
      }),
    },

    [NOTIFICATION_TYPES.PROFILE_UPDATED]: {
      subject: `Profile updated: ${data.userName}`,
      html: baseEmailShell({
        title: "Profile updated",
        intro: `<strong>${data.userName}</strong> has updated their account profile.`,
        detailsHtml: `
          <p style="margin: 0 0 10px 0;"><strong>User:</strong> ${data.userName}</p>
          <p style="margin: 0 0 10px 0;"><strong>Email:</strong> ${data.userEmail}</p>
          <p style="margin: 0 0 10px 0;"><strong>Changes:</strong> ${data.changes || "Profile information updated"}</p>
          <p style="margin: 0;"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        `,
        bodyHtml: `
          Keeping profile details current supports a smoother and more trusted experience across the platform.
        `,
      }),
    },

    [NOTIFICATION_TYPES.CLAIM_SUBMITTED]: {
      subject: `Ownership claim submitted: ${data.businessName}`,
      html: baseEmailShell({
        accent: "#00c4cc",
        title: "New ownership claim submitted",
        intro: `A new ownership claim has been submitted for <strong>${data.businessName}</strong>.`,
        detailsHtml: `
          <p style="margin: 0 0 10px 0;"><strong>Business:</strong> ${data.businessName}</p>
          <p style="margin: 0 0 10px 0;"><strong>Claimant:</strong> ${data.claimantName}</p>
          <p style="margin: 0 0 10px 0;"><strong>Email:</strong> ${data.claimantEmail}</p>
          <p style="margin: 0 0 10px 0;"><strong>Claim type:</strong> ${data.claimType}</p>
          <p style="margin: 0;"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        `,
        bodyHtml: `
          Please review the claim to help maintain profile accuracy and trusted business discovery across the network.
        `,
        ctaText: "Review claim",
        ctaHref: getAdminUrl(),
      }),
    },

    [NOTIFICATION_TYPES.CLAIM_APPROVED]: {
      subject: `Ownership claim approved: ${data.businessName}`,
      html: baseEmailShell({
        accent: "#16a34a",
        title: "Ownership claim approved",
        intro: `The ownership claim for <strong>${data.businessName}</strong> has been approved.`,
        detailsHtml: `
          <p style="margin: 0 0 10px 0;"><strong>Business:</strong> ${data.businessName}</p>
          <p style="margin: 0 0 10px 0;"><strong>Claimant:</strong> ${data.claimantName}</p>
          <p style="margin: 0 0 10px 0;"><strong>Email:</strong> ${data.claimantEmail}</p>
          <p style="margin: 0;"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        `,
        bodyHtml: `
          The business can now continue building a stronger presence and trusted visibility on Pacific Discovery Network.
        `,
      }),
    },

    [NOTIFICATION_TYPES.CLAIM_REJECTED]: {
      subject: `Ownership claim declined: ${data.businessName}`,
      html: baseEmailShell({
        accent: "#dc2626",
        title: "Ownership claim declined",
        intro: `The ownership claim for <strong>${data.businessName}</strong> was not approved.`,
        detailsHtml: `
          <p style="margin: 0 0 10px 0;"><strong>Business:</strong> ${data.businessName}</p>
          <p style="margin: 0 0 10px 0;"><strong>Claimant:</strong> ${data.claimantName}</p>
          <p style="margin: 0 0 10px 0;"><strong>Email:</strong> ${data.claimantEmail}</p>
          <p style="margin: 0 0 10px 0;"><strong>Reason:</strong> ${data.reason || "Additional verification required"}</p>
          <p style="margin: 0;"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        `,
        bodyHtml: `
          Review the claim record if follow-up or additional verification is needed.
        `,
        ctaText: "Open admin dashboard",
        ctaHref: getAdminUrl(),
      }),
    },

    [NOTIFICATION_TYPES.USER_CREATED]: {
      subject: `New user registered: ${data.userName}`,
      html: baseEmailShell({
        accent: "#00c4cc",
        title: "New user account created",
        intro: `A new user has registered an account on Pacific Discovery Network.`,
        detailsHtml: `
          <p style="margin: 0 0 10px 0;"><strong>User:</strong> ${data.userName}</p>
          <p style="margin: 0 0 10px 0;"><strong>Email:</strong> ${data.userEmail}</p>
          <p style="margin: 0 0 10px 0;"><strong>User ID:</strong> ${data.userId}</p>
          <p style="margin: 0 0 10px 0;"><strong>Registration date:</strong> ${new Date().toLocaleDateString()}</p>
          <p style="margin: 0;"><strong>Registration time:</strong> ${new Date().toLocaleTimeString()}</p>
        `,
        bodyHtml: `
          Welcome new users to the platform and monitor account activity to ensure a trusted and secure business discovery network.
        `,
        ctaText: "View admin dashboard",
        ctaHref: getAdminUrl(),
      }),
    },

    [NOTIFICATION_TYPES.WELCOME_CONFIRMED]: {
      subject: `Welcome to Pacific Discovery Network`,
      html: baseEmailShell({
        accent: "#00c4cc",
        title: "Welcome to Pacific Discovery Network",
        intro: `Thank you for joining Pacific Discovery Network. Your account is now confirmed and ready to use.`,
        bodyHtml: `
          <p style="margin: 0 0 12px 0;">You can now log in and start building your presence.</p>
          <p style="margin: 0 0 12px 0;">Next steps:</p>
          <ul style="padding-left: 20px; margin: 0 0 12px 0;">
            <li>Claim your business if it already exists in the network</li>
            <li>Add your business if it is not yet listed</li>
          </ul>
          <p style="margin: 0;">If you need help at any point, just reply to this email and we can assist.</p>
        `,
        ctaText: "Log in now",
        ctaHref: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://pacificdiscoverynetwork.com'}/BusinessLogin`,
      }),
    },

    [NOTIFICATION_TYPES.REMINDER_NO_BUSINESS]: {
      subject: `Need help adding or claiming your business?`,
      html: baseEmailShell({
        accent: "#f59e0b",
        title: "Complete your business setup",
        intro: `We noticed you have not yet claimed or added a business on Pacific Discovery Network.`,
        bodyHtml: `
          <p style="margin: 0 0 12px 0;">To get the most from your account, your next step is to either:</p>
          <ul style="padding-left: 20px; margin: 0 0 12px 0;">
            <li>Claim an existing business listing</li>
            <li>Add a new business to the network</li>
          </ul>
          <p style="margin: 0;">If you have had any problems with this process, reply to this email and we will help you.</p>
        `,
        ctaText: "Log in and continue",
        ctaHref: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://pacificdiscoverynetwork.com'}/BusinessLogin`,
      }),
    },

    [NOTIFICATION_TYPES.ADMIN_BUSINESS_PENDING_APPROVAL]: {
      subject: `New business awaiting approval: ${data.businessName}`,
      html: baseEmailShell({
        accent: "#f59e0b",
        title: "New business awaiting approval",
        intro: `A new business has been added to Pacific Discovery Network and requires review.`,
        detailsHtml: `
          <p style="margin: 0 0 10px 0;"><strong>Business:</strong> ${data.businessName}</p>
          <p style="margin: 0 0 10px 0;"><strong>Added by:</strong> ${data.addedBy}</p>
          <p style="margin: 0 0 10px 0;"><strong>Business ID:</strong> ${data.businessId}</p>
          <p style="margin: 0;"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        `,
        bodyHtml: `
          Please review this business to ensure it meets the quality standards before it appears in the discovery network.
        `,
        ctaText: "Review business",
        ctaHref: getAdminUrl(),
      }),
    },

    [NOTIFICATION_TYPES.ADMIN_CLAIM_PENDING_APPROVAL]: {
      subject: `New claim awaiting approval: ${data.businessName}`,
      html: baseEmailShell({
        accent: "#f59e0b",
        title: "New business claim awaiting approval",
        intro: `A new ownership claim has been submitted and requires review.`,
        detailsHtml: `
          <p style="margin: 0 0 10px 0;"><strong>Business:</strong> ${data.businessName}</p>
          <p style="margin: 0 0 10px 0;"><strong>Claimant:</strong> ${data.claimantName}</p>
          <p style="margin: 0 0 10px 0;"><strong>Email:</strong> ${data.claimantEmail}</p>
          <p style="margin: 0 0 10px 0;"><strong>Claim ID:</strong> ${data.claimId}</p>
          <p style="margin: 0;"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        `,
        bodyHtml: `
          Please review this ownership claim to verify the authenticity before approving the transfer.
        `,
        ctaText: "Review claim",
        ctaHref: getAdminUrl(),
      }),
    },
  };

  return templates[type];
};

// Main notification function
export const sendNotification = async (type, data, recipients = null) => {
  try {
    console.log("=== NOTIFICATION DEBUG ===");
    console.log("Type:", type);
    console.log("Data:", data);
    console.log("Recipients:", recipients);
    console.log("SMTP_HOST:", process.env.SMTP_HOST);
    console.log("SMTP_USER:", process.env.SMTP_USER);
    console.log("SMTP_FROM_EMAIL:", process.env.SMTP_FROM_EMAIL);
    console.log("ADMIN_NOTIFICATION_EMAIL:", process.env.ADMIN_NOTIFICATION_EMAIL);

    const template = getEmailTemplate(type, data);

    if (!template) {
      throw new Error(`No template found for notification type: ${type}`);
    }

    console.log("Template found:", template.subject);

    const transporter = createTransporter();
    const toEmails = recipients || [process.env.ADMIN_NOTIFICATION_EMAIL || process.env.SMTP_FROM_EMAIL];

    console.log("Sending to emails:", toEmails);

    const emailPromises = toEmails.map((email) =>
      transporter.sendMail({
        from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
        to: email,
        subject: template.subject,
        html: template.html,
        text: template.subject, // Basic text fallback
      })
    );

    await Promise.all(emailPromises);

    console.log("Emails sent successfully");
    return { success: true, message: "Notifications sent successfully" };
  } catch (error) {
    console.error("=== NOTIFICATION ERROR ===");
    console.error("Error details:", error);
    console.error("Error message:", error.message);
    console.error("Stack trace:", error.stack);
    return { success: false, error: error.message };
  }
};

// Specific notification helpers
export const notifyBusinessClaimed = (businessData, ownerData) =>
  sendNotification(NOTIFICATION_TYPES.BUSINESS_CLAIMED, {
    businessName: businessData.name,
    ownerName: ownerData.name,
    ownerEmail: ownerData.email,
    claimId: businessData.claim_id,
  });

export const notifyBusinessAdded = (businessData, userData) =>
  sendNotification(NOTIFICATION_TYPES.BUSINESS_ADDED, {
    businessName: businessData.name,
    industry: businessData.industry,
    city: businessData.city,
    country: businessData.country,
    addedBy: userData.name || userData.email,
  });

export const notifyBusinessUpdated = (businessData, userData, changes) =>
  sendNotification(NOTIFICATION_TYPES.BUSINESS_UPDATED, {
    businessName: businessData.name,
    updatedBy: userData.name || userData.email,
    changes,
  });

export const notifyPlanUpgraded = (businessData, ownerData, previousPlan, newPlan) =>
  sendNotification(NOTIFICATION_TYPES.PLAN_UPGRADED, {
    businessName: businessData.name,
    ownerName: ownerData.name,
    previousPlan,
    newPlan,
  });

export const notifyPlanDowngraded = (businessData, ownerData, previousPlan, newPlan) =>
  sendNotification(NOTIFICATION_TYPES.PLAN_DOWNGRADED, {
    businessName: businessData.name,
    ownerName: ownerData.name,
    previousPlan,
    newPlan,
  });

export const notifyPlanCancelled = (businessData, ownerData, previousPlan) =>
  sendNotification(NOTIFICATION_TYPES.PLAN_CANCELLED, {
    businessName: businessData.name,
    ownerName: ownerData.name,
    previousPlan,
  });

export const notifyProfileUpdated = (userData, changes) =>
  sendNotification(NOTIFICATION_TYPES.PROFILE_UPDATED, {
    userName: userData.name || userData.email,
    userEmail: userData.email,
    changes,
  });

export const notifyClaimSubmitted = (businessData, claimantData, claimType) =>
  sendNotification(NOTIFICATION_TYPES.CLAIM_SUBMITTED, {
    businessName: businessData.name,
    claimantName: claimantData.name,
    claimantEmail: claimantData.email,
    claimType,
  });

export const notifyClaimApproved = (businessData, claimantData) =>
  sendNotification(NOTIFICATION_TYPES.CLAIM_APPROVED, {
    businessName: businessData.name,
    claimantName: claimantData.name,
    claimantEmail: claimantData.email,
  });

export const notifyClaimRejected = (businessData, claimantData, reason) =>
  sendNotification(NOTIFICATION_TYPES.CLAIM_REJECTED, {
    businessName: businessData.name,
    claimantName: claimantData.name,
    claimantEmail: claimantData.email,
    reason,
  });

export const notifyUserCreated = (userData) =>
  sendNotification(NOTIFICATION_TYPES.USER_CREATED, {
    userName: userData.name || userData.email,
    userEmail: userData.email,
    userId: userData.id,
  });

export const notifyUserSignedUp = (userData) =>
  sendNotification(NOTIFICATION_TYPES.USER_CREATED, {
    userName: userData.displayName || userData.email,
    userEmail: userData.email,
    userId: userData.id,
  });

export const notifyWelcomeConfirmed = (userData) =>
  sendNotification(NOTIFICATION_TYPES.WELCOME_CONFIRMED, {
    email: userData.email,
  }, [userData.email]);

export const notifyReminderNoBusiness = (userData) =>
  sendNotification(NOTIFICATION_TYPES.REMINDER_NO_BUSINESS, {
    email: userData.email,
  }, [userData.email]);

export const notifyAdminBusinessPendingApproval = (businessData, userData) =>
  sendNotification(NOTIFICATION_TYPES.ADMIN_BUSINESS_PENDING_APPROVAL, {
    businessName: businessData.name,
    addedBy: userData.email,
    businessId: businessData.id,
  });

export const notifyAdminClaimPendingApproval = (businessData, claimData) =>
  sendNotification(NOTIFICATION_TYPES.ADMIN_CLAIM_PENDING_APPROVAL, {
    businessName: businessData.name,
    claimantName: claimData.name || claimData.email,
    claimantEmail: claimData.email,
    claimId: claimData.id,
  });