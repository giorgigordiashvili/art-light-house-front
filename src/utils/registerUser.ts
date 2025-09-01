import axios from "axios";

/**
 * Simple registration utility using axios directly
 * Alternative approach for registration
 */
export const registerUser = async (userData: {
  first_name: string;
  email: string;
  password: string;
  password_confirmation: string;
}) => {
  try {
    const response = await axios.post("https://api.artlighthouse.ge/en/register", userData, {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 10000,
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    if (error.response) {
      // API responded with error status
      return {
        success: false,
        error: error.response.data?.message || "Registration failed",
        errors: error.response.data?.errors || {},
        status: error.response.status,
      };
    } else if (error.request) {
      // Network error
      return {
        success: false,
        error: "Network error. Please check your internet connection.",
        status: 0,
      };
    } else {
      // Other error
      return {
        success: false,
        error: error.message || "An unexpected error occurred",
        status: 500,
      };
    }
  }
};
