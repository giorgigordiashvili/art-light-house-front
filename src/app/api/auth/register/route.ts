import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { first_name, email, password, password_confirmation } = body;

    // Validate required fields
    if (!first_name || !email || !password || !password_confirmation) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (password !== password_confirmation) {
      return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });
    }

    const response = await fetch("https://api.artlighthouse.ge/en/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name,
        email,
        password,
        password_confirmation,
      }),
    });

    const data = await response.json();

    console.log("🔍 Backend registration response:", {
      status: response.status,
      success: data.success,
      access_token: data.access_token ? `${data.access_token.substring(0, 10)}...` : "undefined",
      token_type: data.token_type,
      user_id: data.user?.id,
    });

    if (response.ok && data.success) {
      const responsePayload = {
        success: true,
        message: data.message,
        user: data.user,
        access_token: data.access_token,
        token_type: data.token_type,
        redirect: data.redirect,
      };

      console.log("✅ Sending registration response:", {
        success: responsePayload.success,
        access_token: responsePayload.access_token
          ? `${responsePayload.access_token.substring(0, 10)}...`
          : "undefined",
        token_type: responsePayload.token_type,
      });

      return NextResponse.json(responsePayload);
    } else {
      return NextResponse.json(
        {
          error: data.message || "Registration failed",
          errors: data.errors || {},
        },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
