/**
 * Admin notification utilities
 * Sends email notifications to admin for important business events
 */

const ADMIN_EMAIL = "new@pacificdiscoverynetwork.com";

/**
 * Send notification email to admin
 */
export async function sendAdminNotification(subject, message, data = {}) {
  try {
    // In a real implementation, this would use an email service like SendGrid, Resend, etc.
    // For now, we'll log the notification and could integrate with an email service later
    
    const notification = {
      to: ADMIN_EMAIL,
      subject: `[Pacific Discovery Network] ${subject}`,
      message,
      timestamp: new Date().toISOString(),
      data
    };

    // Log for development - in production, replace with actual email sending
    console.log("📧 ADMIN NOTIFICATION:", notification);
    
    // TODO: Replace with actual email service integration
    // Example with Resend (would require npm install resend):
    // const { Resend } = require('resend');
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'hello@pacificdiscoverynetwork.com',
    //   to: ADMIN_EMAIL,
    //   subject: notification.subject,
    //   html: generateEmailHTML(notification)
    // });

    return { success: true, notification };
  } catch (error) {
    console.error("Failed to send admin notification:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Notify admin of new business creation
 */
export async function notifyNewBusinessCreated(businessData, userData) {
  const subject = `New Business Added: ${businessData.business_name}`;
  
  const message = `
A new business has been added to the Pacific Discovery Network:

Business Details:
• Name: ${businessData.business_name}
• Handle: @${businessData.business_handle}
• Industry: ${businessData.industry || 'Not specified'}
• Location: ${businessData.city}, ${businessData.country}
• Email: ${businessData.business_email}
• Status: ${businessData.status || 'pending'}

Owner Details:
• Name: ${userData.display_name || userData.email?.split('@')[0]}
• Email: ${userData.email}
• User ID: ${userData.id}

Business ID: ${businessData.id || 'Pending creation'}
Created: ${new Date().toLocaleString()}

${businessData.status === 'pending' ? '⚠️ This business is in PENDING status and requires review.' : '✅ This business is now live.'}
  `.trim();

  return sendAdminNotification(subject, message, {
    type: 'new_business',
    businessId: businessData.id,
    businessName: businessData.business_name,
    ownerEmail: userData.email,
    status: businessData.status
  });
}

/**
 * Notify admin of new business claim
 */
export async function notifyNewBusinessClaim(claimData, businessData, userData) {
  const subject = `Business Claim Request: ${businessData.business_name}`;
  
  const message = `
A business claim request has been submitted:

Business Details:
• Name: ${businessData.business_name}
• Handle: @${businessData.business_handle}
• Industry: ${businessData.industry || 'Not specified'}
• Location: ${businessData.city}, ${businessData.country}
• Current Status: ${businessData.is_claimed ? 'Already Claimed' : 'Unclaimed'}

Claim Details:
• Claim Type: ${claimData.claim_type || 'Standard Request'}
• Claim Status: ${claimData.status}
• Claim Email: ${claimData.business_email}
• Claim Phone: ${claimData.business_phone}
• Role: ${claimData.role}
• Message: ${claimData.message || 'No message provided'}

Claimant Details:
• Name: ${userData.display_name || userData.email?.split('@')[0]}
• Email: ${userData.email}
• User ID: ${userData.id}

Claim ID: ${claimData.id}
Submitted: ${new Date(claimData.created_at).toLocaleString()}

${claimData.status === 'pending' ? '⚠️ This claim requires ADMIN REVIEW.' : '✅ This claim was automatically approved.'}
  `.trim();

  return sendAdminNotification(subject, message, {
    type: 'business_claim',
    claimId: claimData.id,
    businessId: businessData.id,
    businessName: businessData.business_name,
    claimantEmail: userData.email,
    status: claimData.status
  });
}

/**
 * Generate HTML email template (for future email service integration)
 */
function generateEmailHTML(notification) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${notification.subject}</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #0d4f4f; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background: #f9f9f9; }
    .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
    .data { background: white; padding: 15px; border-radius: 5px; margin: 10px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Pacific Discovery Network</h1>
      <h2>${notification.subject}</h2>
    </div>
    <div class="content">
      <div class="data">
        <pre>${notification.message}</pre>
      </div>
      <p><strong>Time:</strong> ${new Date(notification.timestamp).toLocaleString()}</p>
    </div>
    <div class="footer">
      <p>This is an automated notification from Pacific Discovery Network.</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}
