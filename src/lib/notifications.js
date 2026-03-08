import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Notification types
export const NOTIFICATION_TYPES = {
  BUSINESS_CLAIMED: 'business_claimed',
  BUSINESS_ADDED: 'business_added',
  BUSINESS_UPDATED: 'business_updated',
  PLAN_UPGRADED: 'plan_upgraded',
  PLAN_DOWNGRADED: 'plan_downgraded',
  PLAN_CANCELLED: 'plan_cancelled',
  PROFILE_UPDATED: 'profile_updated',
  CLAIM_SUBMITTED: 'claim_submitted',
  CLAIM_APPROVED: 'claim_approved',
  CLAIM_REJECTED: 'claim_rejected'
};

// Email templates
const getEmailTemplate = (type, data) => {
  const templates = {
    [NOTIFICATION_TYPES.BUSINESS_CLAIMED]: {
      subject: `Business Claimed: ${data.businessName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="width: 50px; height: 50px; background: #0d4f4f; border-radius: 50%; margin: 0 auto 15px;"></div>
            <h1 style="color: #0a1628; margin: 0;">Pacific Market</h1>
          </div>
          
          <h2 style="color: #0a1628; margin-bottom: 20px;">Business Claimed</h2>
          
          <p style="color: #333; line-height: 1.6; margin-bottom: 20px;">
            <strong>${data.ownerName}</strong> has claimed ownership of <strong>${data.businessName}</strong>.
          </p>
          
          <div style="background: #f8f9fc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p style="margin: 0 0 10px 0;"><strong>Business:</strong> ${data.businessName}</p>
            <p style="margin: 0 0 10px 0;"><strong>Owner:</strong> ${data.ownerName}</p>
            <p style="margin: 0 0 10px 0;"><strong>Email:</strong> ${data.ownerEmail}</p>
            <p style="margin: 0 0 10px 0;"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p style="margin: 0;"><strong>Claim ID:</strong> ${data.claimId}</p>
          </div>
          
          <p style="color: #333; line-height: 1.6; margin-bottom: 20px;">
            Please review this claim in your admin dashboard.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin" style="background: #0d4f4f; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Review Claim
            </a>
          </div>
          
          <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; text-align: center;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              © 2024 Pacific Market. All rights reserved.
            </p>
          </div>
        </div>
      `
    },
    
    [NOTIFICATION_TYPES.BUSINESS_ADDED]: {
      subject: `New Business Added: ${data.businessName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="width: 50px; height: 50px; background: #0d4f4f; border-radius: 50%; margin: 0 auto 15px;"></div>
            <h1 style="color: #0a1628; margin: 0;">Pacific Market</h1>
          </div>
          
          <h2 style="color: #0a1628; margin-bottom: 20px;">New Business Added</h2>
          
          <p style="color: #333; line-height: 1.6; margin-bottom: 20px;">
            A new business has been added to the Pacific Market registry.
          </p>
          
          <div style="background: #f8f9fc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p style="margin: 0 0 10px 0;"><strong>Business:</strong> ${data.businessName}</p>
            <p style="margin: 0 0 10px 0;"><strong>Industry:</strong> ${data.industry || 'Not specified'}</p>
            <p style="margin: 0 0 10px 0;"><strong>Location:</strong> ${data.city ? `${data.city}, ${data.country}` : data.country}</p>
            <p style="margin: 0 0 10px 0;"><strong>Added by:</strong> ${data.addedBy}</p>
            <p style="margin: 0;"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin" style="background: #0d4f4f; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Business
            </a>
          </div>
          
          <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; text-align: center;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              © 2024 Pacific Market. All rights reserved.
            </p>
          </div>
        </div>
      `
    },
    
    [NOTIFICATION_TYPES.BUSINESS_UPDATED]: {
      subject: `Business Updated: ${data.businessName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="width: 50px; height: 50px; background: #0d4f4f; border-radius: 50%; margin: 0 auto 15px;"></div>
            <h1 style="color: #0a1628; margin: 0;">Pacific Market</h1>
          </div>
          
          <h2 style="color: #0a1628; margin-bottom: 20px;">Business Updated</h2>
          
          <p style="color: #333; line-height: 1.6; margin-bottom: 20px;">
            <strong>${data.updatedBy}</strong> has updated the information for <strong>${data.businessName}</strong>.
          </p>
          
          <div style="background: #f8f9fc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p style="margin: 0 0 10px 0;"><strong>Business:</strong> ${data.businessName}</p>
            <p style="margin: 0 0 10px 0;"><strong>Updated by:</strong> ${data.updatedBy}</p>
            <p style="margin: 0 0 10px 0;"><strong>Changes:</strong> ${data.changes || 'Various fields updated'}</p>
            <p style="margin: 0;"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin" style="background: #0d4f4f; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Review Changes
            </a>
          </div>
          
          <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; text-align: center;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              © 2024 Pacific Market. All rights reserved.
            </p>
          </div>
        </div>
      `
    },
    
    [NOTIFICATION_TYPES.PLAN_UPGRADED]: {
      subject: `Plan Upgraded: ${data.businessName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="width: 50px; height: 50px; background: #c9a84c; border-radius: 50%; margin: 0 auto 15px;"></div>
            <h1 style="color: #0a1628; margin: 0;">Pacific Market</h1>
          </div>
          
          <h2 style="color: #0a1628; margin-bottom: 20px;">Plan Upgraded 🎉</h2>
          
          <p style="color: #333; line-height: 1.6; margin-bottom: 20px;">
            <strong>${data.businessName}</strong> has upgraded to the <strong>${data.newPlan}</strong> plan.
          </p>
          
          <div style="background: #f8f9fc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p style="margin: 0 0 10px 0;"><strong>Business:</strong> ${data.businessName}</p>
            <p style="margin: 0 0 10px 0;"><strong>Previous Plan:</strong> ${data.previousPlan}</p>
            <p style="margin: 0 0 10px 0;"><strong>New Plan:</strong> ${data.newPlan}</p>
            <p style="margin: 0 0 10px 0;"><strong>Owner:</strong> ${data.ownerName}</p>
            <p style="margin: 0;"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          
          <p style="color: #333; line-height: 1.6; margin-bottom: 20px;">
            This upgrade enhances their visibility and features on the Pacific Market.
          </p>
          
          <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; text-align: center;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              © 2024 Pacific Market. All rights reserved.
            </p>
          </div>
        </div>
      `
    },
    
    [NOTIFICATION_TYPES.PROFILE_UPDATED]: {
      subject: `Profile Updated: ${data.userName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="width: 50px; height: 50px; background: #0d4f4f; border-radius: 50%; margin: 0 auto 15px;"></div>
            <h1 style="color: #0a1628; margin: 0;">Pacific Market</h1>
          </div>
          
          <h2 style="color: #0a1628; margin-bottom: 20px;">Profile Updated</h2>
          
          <p style="color: #333; line-height: 1.6; margin-bottom: 20px;">
            <strong>${data.userName}</strong> has updated their profile information.
          </p>
          
          <div style="background: #f8f9fc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p style="margin: 0 0 10px 0;"><strong>User:</strong> ${data.userName}</p>
            <p style="margin: 0 0 10px 0;"><strong>Email:</strong> ${data.userEmail}</p>
            <p style="margin: 0 0 10px 0;"><strong>Changes:</strong> ${data.changes || 'Profile information updated'}</p>
            <p style="margin: 0;"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; text-align: center;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              © 2024 Pacific Market. All rights reserved.
            </p>
          </div>
        </div>
      `
    },
    
    [NOTIFICATION_TYPES.CLAIM_SUBMITTED]: {
      subject: `New Claim Submitted: ${data.businessName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="width: 50px; height: 50px; background: #00c4cc; border-radius: 50%; margin: 0 auto 15px;"></div>
            <h1 style="color: #0a1628; margin: 0;">Pacific Market</h1>
          </div>
          
          <h2 style="color: #0a1628; margin-bottom: 20px;">New Claim Submitted</h2>
          
          <p style="color: #333; line-height: 1.6; margin-bottom: 20px;">
            A new ownership claim has been submitted for <strong>${data.businessName}</strong>.
          </p>
          
          <div style="background: #f8f9fc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p style="margin: 0 0 10px 0;"><strong>Business:</strong> ${data.businessName}</p>
            <p style="margin: 0 0 10px 0;"><strong>Claimant:</strong> ${data.claimantName}</p>
            <p style="margin: 0 0 10px 0;"><strong>Email:</strong> ${data.claimantEmail}</p>
            <p style="margin: 0 0 10px 0;"><strong>Claim Type:</strong> ${data.claimType}</p>
            <p style="margin: 0;"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin" style="background: #0d4f4f; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Review Claim
            </a>
          </div>
          
          <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; text-align: center;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              © 2024 Pacific Market. All rights reserved.
            </p>
          </div>
        </div>
      `
    }
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
    
    // Default to admin email if no recipients specified
    const toEmails = recipients || [process.env.RESEND_FROM_EMAIL];
    
    // Send to all recipients
    const emailPromises = toEmails.map(email => 
      resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL,
        to: email,
        subject: template.subject,
        html: template.html
      })
    );
    
    await Promise.all(emailPromises);
    
    return { success: true, message: 'Notifications sent successfully' };
  } catch (error) {
    console.error('Notification error:', error);
    return { success: false, error: error.message };
  }
};

// Specific notification helpers
export const notifyBusinessClaimed = (businessData, ownerData) => 
  sendNotification(NOTIFICATION_TYPES.BUSINESS_CLAIMED, {
    businessName: businessData.name,
    ownerName: ownerData.name,
    ownerEmail: ownerData.email,
    claimId: businessData.claim_id
  });

export const notifyBusinessAdded = (businessData, userData) => 
  sendNotification(NOTIFICATION_TYPES.BUSINESS_ADDED, {
    businessName: businessData.name,
    industry: businessData.industry,
    city: businessData.city,
    country: businessData.country,
    addedBy: userData.name || userData.email
  });

export const notifyBusinessUpdated = (businessData, userData, changes) => 
  sendNotification(NOTIFICATION_TYPES.BUSINESS_UPDATED, {
    businessName: businessData.name,
    updatedBy: userData.name || userData.email,
    changes
  });

export const notifyPlanUpgraded = (businessData, ownerData, previousPlan, newPlan) => 
  sendNotification(NOTIFICATION_TYPES.PLAN_UPGRADED, {
    businessName: businessData.name,
    ownerName: ownerData.name,
    previousPlan,
    newPlan
  });

export const notifyProfileUpdated = (userData, changes) => 
  sendNotification(NOTIFICATION_TYPES.PROFILE_UPDATED, {
    userName: userData.name || userData.email,
    userEmail: userData.email,
    changes
  });

export const notifyClaimSubmitted = (businessData, claimantData, claimType) => 
  sendNotification(NOTIFICATION_TYPES.CLAIM_SUBMITTED, {
    businessName: businessData.name,
    claimantName: claimantData.name,
    claimantEmail: claimantData.email,
    claimType
  });
