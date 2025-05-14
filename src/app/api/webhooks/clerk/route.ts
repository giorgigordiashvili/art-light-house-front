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

  // Process user.created event
  if (eventType === "user.created") {
    const { id, email_addresses, first_name, last_name } = event.data;
    const email = email_addresses?.[0]?.email_address;
    const name = `${first_name || ""} ${last_name || ""}`.trim();

    // Create the user in the database
    await prisma.user.create({
      data: {
        clerk_id: id,
        email: email || "",
        name: name || "",
      },
    });

    return new Response("User created", { status: 200 });
  }

  // Process user.updated event
  if (eventType === "user.updated") {
    const { id, email_addresses, first_name, last_name } = event.data;
    const email = email_addresses?.[0]?.email_address;
    const name = `${first_name || ""} ${last_name || ""}`.trim();

    // Update the user in the database
    await prisma.user.update({
      where: { clerk_id: id },
      data: {
        email: email || "",
        name: name || "",
      },
    });

    return new Response("User updated", { status: 200 });
  }

  // Process user.deleted event
  if (eventType === "user.deleted") {
    const { id } = event.data;

    // Delete the user from the database
    await prisma.user.delete({
      where: { clerk_id: id },
    });

    return new Response("User deleted", { status: 200 });
  }

  // Return 200 for events we don't handle
  return new Response("Webhook received", { status: 200 });
}
