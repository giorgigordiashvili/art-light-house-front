import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { Webhook } from "svix";
import prisma from "@/lib/prisma";

// This is the Clerk webhook handler
export async function POST(request: Request) {
  // Get the Clerk webhook secret from environment variables
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("Missing CLERK_WEBHOOK_SECRET");
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = (await headerPayload).get("svix-id");
  const svix_timestamp = (await headerPayload).get("svix-timestamp");
  const svix_signature = (await headerPayload).get("svix-signature");

  // If there are no headers, return 400
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  // Get the body
  const payload = await request.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with the secret
  const webhook = new Webhook(WEBHOOK_SECRET);

  let event: WebhookEvent;

  // Verify the webhook
  try {
    event = webhook.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (error) {
    console.error("Error verifying webhook", error);
    return new Response("Error verifying webhook", { status: 400 });
  }

  // Handle the different webhook events
  const eventType = event.type;
  console.log(`Received Clerk webhook event: ${eventType}`);
  console.log("Full event data:", JSON.stringify(event.data, null, 2));

  // Process user.created event
  if (eventType === "user.created") {
    try {
      const { id, email_addresses, first_name, last_name } = event.data;
      const email = email_addresses?.[0]?.email_address;
      const name = `${first_name || ""} ${last_name || ""}`.trim();

      console.log(`Processing user creation:`, {
        clerk_id: id,
        email: email,
        name: name,
        email_addresses: email_addresses,
        first_name: first_name,
        last_name: last_name,
      });

      // Validate required fields
      if (!id) {
        console.error("Missing required field: clerk_id");
        return new Response("Missing required field: clerk_id", { status: 400 });
      }

      // Check if user already exists to prevent duplicate creation
      console.log(`Checking if user with clerk_id ${id} already exists...`);
      const existingUser = await prisma.user.findUnique({
        where: { clerk_id: id },
      });

      if (existingUser) {
        console.log(`User with Clerk ID ${id} already exists:`, existingUser);
        return new Response("User already exists", { status: 200 });
      }

      // Create the user in the database with explicit field mapping
      const userData = {
        clerk_id: id,
        email: email || null, // Use null instead of empty string for nullable fields
        name: name || null, // Use null instead of empty string for nullable fields
      };

      console.log(`Creating user with data:`, userData);

      const newUser = await prisma.user.create({
        data: userData,
      });

      console.log(`Successfully created user:`, newUser);
      return new Response("User created", { status: 200 });
    } catch (error) {
      console.error("Error creating user:", error);

      // Provide more detailed error information
      if (error instanceof Error) {
        console.error("Error details:", {
          message: error.message,
          stack: error.stack,
          name: error.name,
        });

        // Check for specific Prisma errors
        if (error.message.includes("P2002")) {
          console.error("Unique constraint violation - user might already exist");
          return new Response("User already exists (unique constraint)", { status: 409 });
        }

        if (error.message.includes("P2003")) {
          console.error("Foreign key constraint failed");
          return new Response("Database constraint error", { status: 500 });
        }

        if (error.message.includes("database")) {
          console.error("Database connection error");
          return new Response("Database connection error", { status: 500 });
        }
      }

      return new Response(
        `Error creating user: ${error instanceof Error ? error.message : "Unknown error"}`,
        { status: 500 }
      );
    }
  }

  // Process user.updated event
  if (eventType === "user.updated") {
    try {
      const { id, email_addresses, first_name, last_name } = event.data;
      const email = email_addresses?.[0]?.email_address;
      const name = `${first_name || ""} ${last_name || ""}`.trim();

      console.log(`Updating user with Clerk ID: ${id}, Email: ${email}, Name: ${name}`);

      // Update the user in the database
      const updatedUser = await prisma.user.update({
        where: { clerk_id: id },
        data: {
          email: email || "",
          name: name || "",
        },
      });

      console.log(`Successfully updated user:`, updatedUser);
      return new Response("User updated", { status: 200 });
    } catch (error) {
      console.error("Error updating user:", error);
      // If user doesn't exist, we might want to create them instead
      if (error instanceof Error && error.message.includes("Record to update not found")) {
        console.log(`User with Clerk ID ${event.data.id} not found, creating new user`);
        // Redirect to user creation logic
        const { id, email_addresses, first_name, last_name } = event.data;
        const email = email_addresses?.[0]?.email_address;
        const name = `${first_name || ""} ${last_name || ""}`.trim();

        try {
          const newUser = await prisma.user.create({
            data: {
              clerk_id: id,
              email: email || "",
              name: name || "",
            },
          });
          console.log(`Successfully created user during update:`, newUser);
          return new Response("User created during update", { status: 200 });
        } catch (createError) {
          console.error("Error creating user during update:", createError);
          return new Response("Error creating user during update", { status: 500 });
        }
      }
      return new Response("Error updating user", { status: 500 });
    }
  }

  // Process user.deleted event
  if (eventType === "user.deleted") {
    try {
      const { id } = event.data;

      console.log(`Deleting user with Clerk ID: ${id}`);

      // Delete the user from the database
      const deletedUser = await prisma.user.delete({
        where: { clerk_id: id },
      });

      console.log(`Successfully deleted user:`, deletedUser);
      return new Response("User deleted", { status: 200 });
    } catch (error) {
      console.error("Error deleting user:", error);
      // If user doesn't exist, consider it successful
      if (error instanceof Error && error.message.includes("Record to delete does not exist")) {
        console.log(
          `User with Clerk ID ${event.data.id} not found, considering deletion successful`
        );
        return new Response("User not found, deletion considered successful", { status: 200 });
      }
      return new Response("Error deleting user", { status: 500 });
    }
  }

  // Return 200 for events we don't handle
  return new Response("Webhook received", { status: 200 });
}
