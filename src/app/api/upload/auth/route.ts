import { NextResponse } from "next/server";
import imagekit from "@/lib/imagekit";

// GET /api/upload/auth - Get authentication parameters for ImageKit uploads
export async function GET() {
  try {
    const authParams = imagekit.getAuthenticationParameters();

    return NextResponse.json(authParams);
  } catch (error) {
    console.error("Error getting ImageKit auth parameters:", error);
    return NextResponse.json({ error: "Failed to get authentication parameters" }, { status: 500 });
  }
}
