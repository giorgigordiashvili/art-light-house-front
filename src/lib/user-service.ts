import prisma from "./prisma";

type UserData = {
  clerkId: string;
  email?: string;
  name?: string;
};

/**
 * Create or update a user in the database based on Clerk user data
 */
export async function createOrUpdateUser(userData: UserData) {
  const { clerkId, email, name } = userData;

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { clerk_id: clerkId },
    });

    if (existingUser) {
      // Update user if exists
      return await prisma.user.update({
        where: { clerk_id: clerkId },
        data: {
          email: email || existingUser.email,
          name: name || existingUser.name,
        },
      });
    } else {
      // Create new user if doesn't exist
      return await prisma.user.create({
        data: {
          clerk_id: clerkId,
          email: email || "",
          name: name || "",
        },
      });
    }
  } catch (error) {
    console.error("Error creating/updating user:", error);
    throw error;
  }
}

/**
 * Get a user by their Clerk ID
 */
export async function getUserByClerkId(clerkId: string) {
  try {
    return await prisma.user.findUnique({
      where: { clerk_id: clerkId },
    });
  } catch (error) {
    console.error("Error fetching user by Clerk ID:", error);
    throw error;
  }
}

/**
 * Delete a user by their Clerk ID
 */
export async function deleteUserByClerkId(clerkId: string) {
  try {
    return await prisma.user.delete({
      where: { clerk_id: clerkId },
    });
  } catch (error) {
    console.error("Error deleting user by Clerk ID:", error);
    throw error;
  }
}
