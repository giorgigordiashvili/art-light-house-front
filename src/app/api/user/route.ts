import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/lib/user-service";

// This endpoint allows you to get the current user's database entry
export async function GET() {
  try {
    // Get the current authenticated user from Clerk
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the database user entry using the Clerk ID
    const dbUser = await getUserByClerkId(user.id);

    if (!dbUser) {
      return NextResponse.json({ error: "User not found in database" }, { status: 404 });
    }

    // Return the database user information
    return NextResponse.json({
      message: "Success",
      user: {
        id: dbUser.id,
        clerkId: dbUser.clerk_id,
        email: dbUser.email,
        name: dbUser.name,
        createdAt: dbUser.created_at,
        updatedAt: dbUser.updated_at,
      },
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
