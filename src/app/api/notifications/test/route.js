import { sendNotification } from "@/lib/notifications";
import { NOTIFICATION_TYPES } from "@/lib/notifications";

export async function POST(request) {
  try {
    const { type, testData } = await request.json();
    
    if (!type || !NOTIFICATION_TYPES[type]) {
      return Response.json({ 
        error: 'Invalid notification type', 
        availableTypes: Object.keys(NOTIFICATION_TYPES) 
      }, { status: 400 });
    }
    
    // Test data for different notification types
    const defaultTestData = {
      [NOTIFICATION_TYPES.BUSINESS_CLAIMED]: {
        businessName: "Test Pacific Business",
        ownerName: "John Doe",
        ownerEmail: "john@example.com",
        claimId: "TEST-123"
      },
      [NOTIFICATION_TYPES.BUSINESS_ADDED]: {
        businessName: "New Pacific Restaurant",
        industry: "Food & Hospitality",
        city: "Auckland",
        country: "New Zealand",
        addedBy: "Jane Smith"
      },
      [NOTIFICATION_TYPES.BUSINESS_UPDATED]: {
        businessName: "Updated Business",
        updatedBy: "Admin User",
        changes: "Updated contact information and business hours"
      },
      [NOTIFICATION_TYPES.PLAN_UPGRADED]: {
        businessName: "Growing Business",
        ownerName: "Business Owner",
        previousPlan: "Basic",
        newPlan: "Premium"
      },
      [NOTIFICATION_TYPES.PROFILE_UPDATED]: {
        userName: "Test User",
        userEmail: "user@example.com",
        changes: "Updated profile picture and bio"
      },
      [NOTIFICATION_TYPES.CLAIM_SUBMITTED]: {
        businessName: "Claimed Business",
        claimantName: "Claimant Name",
        claimantEmail: "claimant@example.com",
        claimType: "owner"
      }
    };
    
    const data = testData || defaultTestData[type];
    
    // Send test notification
    const result = await sendNotification(type, data);
    
    if (result.success) {
      return Response.json({ 
        success: true, 
        message: `Test ${type} notification sent successfully`,
        data: {
          type,
          testData: data,
          timestamp: new Date().toISOString()
        }
      });
    } else {
      return Response.json({ 
        error: 'Failed to send test notification', 
        details: result.error 
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('Test notification error:', error);
    return Response.json({ 
      error: 'Internal server error', 
      message: error.message 
    }, { status: 500 });
  }
}

// GET endpoint to show available notification types
export async function GET() {
  return Response.json({
    message: "Notification Test API",
    availableTypes: Object.entries(NOTIFICATION_TYPES).map(([key, value]) => ({
      type: key,
      name: value
    })),
    usage: {
      endpoint: "/api/notifications/test",
      method: "POST",
      body: {
        type: "business_claimed",
        testData: {
          businessName: "Test Business",
          ownerName: "Test Owner",
          ownerEmail: "test@example.com",
          claimId: "TEST-123"
        }
      }
    }
  });
}
