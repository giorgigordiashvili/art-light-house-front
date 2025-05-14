"use server";

import { auth } from "@clerk/nextjs/server";

// Example of a server action that checks authentication
export async function getAuthenticatedUserData() {
  const { userId } = await auth();

  // If no userId, the user is not logged in
  if (!userId) {
    return { authenticated: false };
  }

  // User is authenticated
  return {
    authenticated: true,
    userId,
  };
}
