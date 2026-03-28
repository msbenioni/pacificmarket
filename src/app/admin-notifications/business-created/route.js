import { notifyNewBusinessCreated } from "@/utils/notifyAdmin";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { businessData, userData } = await request.json();

    if (!businessData || !userData) {
      return NextResponse.json(
        { error: "Missing required data: businessData and userData" },
        { status: 400 }
      );
    }

    // Send admin notification
    const result = await notifyNewBusinessCreated(businessData, userData);

    if (result.success) {
      return NextResponse.json(
        { 
          message: "Admin notification sent successfully",
          notification: result.notification 
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: "Failed to send notification", details: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in business-created notification API:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
