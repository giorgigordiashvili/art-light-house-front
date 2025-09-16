import { AuthService } from "../lib/authService";
import { ApiAuthManager } from "../lib/apiAuthManager";

/**
 * Comprehensive test utilities for API authentication
 */
export const authTestUtils = {
  /**
   * Test user registration with API
   */
  testRegistration: async (customData?: any) => {
    try {
      const testData = customData || {
        first_name: "Test User",
        email: `test${Date.now()}@example.com`,
        password: "testpassword123",
        password_confirmation: "testpassword123",
      };

      console.log("🧪 Testing API registration:", testData);

      const result = await AuthService.register(testData);
      console.log("✅ Registration successful:", result);
      return result;
    } catch (error) {
      console.error("❌ Registration test failed:", error);
      throw error;
    }
  },

  /**
   * Test user login with API
   */
  testLogin: async (customData?: any) => {
    try {
      const testData = customData || {
        email: "test@example.com",
        password: "testpassword123",
      };

      console.log("🧪 Testing API login:", testData);

      const result = await AuthService.login(testData);
      console.log("✅ Login successful:", result);

      // Store auth data
      // Generate a session token if API doesn't provide one
      let tokenToStore = result.access_token;
      if (!tokenToStore && result.success) {
        tokenToStore = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        console.log("🔐 Generated session token for test:", tokenToStore);
      }

      if (tokenToStore) {
        ApiAuthManager.setToken(tokenToStore);
      }
      if (result.user) {
        ApiAuthManager.setUser(result.user);
      }

      return result;
    } catch (error) {
      console.error("❌ Login test failed:", error);
      throw error;
    }
  },

  /**
   * Test current authentication status
   */
  checkAuthStatus: () => {
    const isAuth = ApiAuthManager.isAuthenticated();
    const user = ApiAuthManager.getUser();
    const token = ApiAuthManager.getToken();

    console.log("🔍 Current API auth status:", {
      isAuthenticated: isAuth,
      user: user,
      hasToken: !!token,
      tokenLength: token?.length || 0,
    });

    return { isAuthenticated: isAuth, user, token };
  },

  /**
   * Clear all authentication data
   */
  clearAuth: () => {
    ApiAuthManager.logout();
    console.log("🧹 Authentication data cleared");
  },

  /**
   * Test login flow with predefined test user
   */
  quickLoginTest: async () => {
    try {
      // First try to register a test user
      const email = `testuser${Date.now()}@example.com`;
      const password = "testpassword123";

      console.log("🚀 Quick test: Registering test user...");
      await authTestUtils.testRegistration({
        first_name: "Test User",
        email: email,
        password: password,
        password_confirmation: password,
      });

      console.log("🚀 Quick test: Logging in with test user...");
      await authTestUtils.testLogin({
        email: email,
        password: password,
      });

      console.log("✅ Quick test completed successfully!");
    } catch (error) {
      console.error("❌ Quick test failed:", error);
    }
  },
};

// Make available globally in development
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  (window as any).authTestUtils = authTestUtils;
  console.log("🧪 Auth test utils available as window.authTestUtils");
}
