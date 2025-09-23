"use server";

// Simple server-side auth helper
export async function getAuthenticatedUserData() {
  // For basic auth, this would typically check JWT tokens or session data
  // Currently returns false since we're using client-side only auth
  return { authenticated: false };
}
