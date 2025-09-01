import { AuthService } from "../lib/authService";

/**
 * Test function to verify API registration
 * This is for development testing purposes only
 */
export const testRegistration = async () => {
  try {
    const testData = {
      first_name: "Test User",
      email: "test@example.com",
      password: "testpassword123",
      password_confirmation: "testpassword123",
    };

    console.log("Testing registration with data:", testData);

    const result = await AuthService.register(testData);
    console.log("Registration successful:", result);
    return result;
  } catch (error) {
    console.error("Registration test failed:", error);
    throw error;
  }
};

// Uncomment the line below to test the registration API
// testRegistration();
