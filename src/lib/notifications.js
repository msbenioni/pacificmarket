import { Resend } from "resend";
import { createPageUrl } from "@/utils";

const resend = new Resend(process.env.RESEND_API_KEY);

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
};

const getAdminUrl = () =>
  `${process.env.NEXT_PUBLIC_SITE_URL}${createPageUrl("AdminDashboard")}`;

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
  };

  return templates[type];
};

// Main notification function
export const sendNotification = async (type, data, recipients = null) => {
  try {
    const template = getEmailTemplate(type, data);

    if (!template) {
      throw new Error(`No template found for notification type: ${type}`);
    }

    const toEmails = recipients || [process.env.RESEND_FROM_EMAIL];

    const emailPromises = toEmails.map((email) =>
      resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL,
        to: email,
        subject: template.subject,
        html: template.html,
      })
    );

    await Promise.all(emailPromises);

    return { success: true, message: "Notifications sent successfully" };
  } catch (error) {
    console.error("Notification error:", error);
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