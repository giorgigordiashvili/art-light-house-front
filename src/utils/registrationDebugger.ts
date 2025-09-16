/**
 * Registration debugging utility
 * Use this to understand the registration flow and troubleshoot issues
 */

export const debugRegistration = {
  /**
   * Log network requests for debugging
   */
  logNetworkActivity: () => {
    console.log("=== REGISTRATION DEBUG MODE ===");

    // Override fetch to log all requests
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const [url, options] = args;
      console.log(`🌐 FETCH: ${options?.method || "GET"} ${url}`);

      try {
        const response = await originalFetch(...args);
        console.log(`✅ RESPONSE: ${response.status} ${response.statusText} - ${url}`);
        return response;
      } catch (error) {
        console.error(`❌ FETCH ERROR: ${url}`, error);
        throw error;
      }
    };
  },

  /**
   * Monitor Cloudflare challenges
   */
  monitorCloudflare: () => {
    // Listen for Cloudflare challenge completion
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          const addedNodes = Array.from(mutation.addedNodes);
          addedNodes.forEach((node) => {
            if (node instanceof HTMLElement) {
              // Check for Cloudflare challenge elements
              if (node.innerHTML?.includes("cloudflare") || node.innerHTML?.includes("challenge")) {
                console.log("🔄 Cloudflare challenge detected");
              }
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  },

  /**
   * Test the registration API directly
   */
  testApiDirectly: async (testData?: any) => {
    const defaultTestData = {
      first_name: "Test User",
      email: `test${Date.now()}@example.com`,
      password: "testpassword123",
      password_confirmation: "testpassword123",
    };

    const data = testData || defaultTestData;

    try {
      console.log("🧪 Testing registration API directly:", data);

      const response = await fetch("https://api.artlighthouse.ge/en/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      console.log(`📊 Response status: ${response.status}`);
      const responseData = await response.json();
      console.log("📊 Response data:", responseData);

      return { success: response.ok, data: responseData, status: response.status };
    } catch (error) {
      console.error("🚨 Direct API test failed:", error);
      return { success: false, error };
    }
  },

  /**
   * Test the login API directly
   */
  testLoginDirectly: async (testData?: any) => {
    const defaultTestData = {
      email: "test@example.com",
      password: "testpassword123",
      password_confirmation: "testpassword123",
    };

    const data = testData || defaultTestData;

    try {
      console.log("🧪 Testing login API directly:", data);

      const response = await fetch("https://api.artlighthouse.ge/en/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      console.log(`📊 Login response status: ${response.status}`);
      const responseData = await response.json();
      console.log("📊 Login response data:", responseData);

      return { success: response.ok, data: responseData, status: response.status };
    } catch (error) {
      console.error("🚨 Direct login API test failed:", error);
      return { success: false, error };
    }
  },
};

// Auto-enable debugging in development
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  (window as any).authDebugger = debugRegistration;
  console.log("🔧 Auth debugger available as window.authDebugger");
  console.log("🔧 Available methods:");
  console.log("  - window.authDebugger.testApiDirectly() // Test registration");
  console.log("  - window.authDebugger.testLoginDirectly() // Test login");
  console.log("  - window.authDebugger.logNetworkActivity() // Monitor requests");
  console.log("  - window.authDebugger.monitorCloudflare() // Monitor CF challenges");
}
