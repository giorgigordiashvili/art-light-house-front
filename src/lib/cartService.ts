import apiClient from "./api";
import { ApiAuthManager } from "./apiAuthManager";

export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface CartResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: any;
}

export class CartService {
  private apiClient = apiClient;

  /**
   * Add item to cart
   */
  async addToCart(productId: number, quantity: number = 1): Promise<CartResponse> {
    try {
      // Debug: Log the parameters received
      console.log("🔍 CartService Debug - Received Parameters:", {
        productId,
        productIdType: typeof productId,
        productIdValue: productId,
        isValidNumber: !isNaN(Number(productId)),
        isNull: productId === null,
        isUndefined: productId === undefined,
        quantity,
        quantityType: typeof quantity,
      });

      // Check if user has access token (more flexible check)
      const token = ApiAuthManager.getToken();
      if (!token) {
        throw new Error("Access token required to add items to cart. Please log in.");
      }

      // Log authentication status for debugging
      console.log("🔐 Cart authentication check:", {
        hasToken: !!token,
        hasUser: !!ApiAuthManager.getUser(),
        isFullyAuthenticated: ApiAuthManager.isAuthenticated(),
      });

      // Use FormData for Laravel compatibility
      const formData = new FormData();
      formData.append("productId", productId.toString()); // Changed from "product_id" to "productid"
      formData.append("quantity", quantity.toString());

      // Debug: Log what we're actually sending in FormData
      console.log("🔍 FormData Debug - What we're sending:");
      for (const [key, value] of formData.entries()) {
        console.log(`  ${key}: "${value}" (type: ${typeof value})`);
      }

      // Debug: Log the full request details
      console.log("🔍 Request Debug:", {
        url: "/en/add-to-cart",
        method: "POST",
        hasToken: !!token,
        formDataEntries: Array.from(formData.entries()),
      });

      const response = await this.apiClient.post("/en/add-to-cart", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return {
        success: true,
        message: "Item added to cart successfully",
        data: response.data,
      };
    } catch (error: any) {
      console.error("Error adding item to cart:", error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || "Failed to add item to cart",
      };
    }
  }

  /**
   * Get cart contents
   */
  async getCart(): Promise<CartItem[]> {
    try {
      const token = ApiAuthManager.getToken();
      if (!token) {
        return []; // Return empty cart if not authenticated
      }

      const response = await this.apiClient.get("/cart");

      if (response.data && Array.isArray(response.data.items)) {
        return response.data.items.map((item: any) => ({
          id: item.id,
          productId: item.product_id || item.productId,
          productName: item.product_name || item.name || "Unknown Product",
          price: parseFloat(item.price || 0),
          quantity: parseInt(item.quantity || 1),
          image: item.image || item.product_image,
        }));
      }

      return [];
    } catch (error: any) {
      console.error("Error fetching cart:", error);
      return [];
    }
  }

  /**
   * Update cart item quantity
   */
  async updateCartItem(productId: number, quantity: number): Promise<CartResponse> {
    try {
      const token = ApiAuthManager.getToken();
      if (!token) {
        throw new Error("Access token required to update cart items. Please log in.");
      }

      const formData = new FormData();
      formData.append("productid", productId.toString()); // Changed from "product_id" to "productid"
      formData.append("quantity", quantity.toString());

      const response = await this.apiClient.put("/cart/update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return {
        success: true,
        message: "Cart item updated successfully",
        data: response.data,
      };
    } catch (error: any) {
      console.error("Error updating cart item:", error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || "Failed to update cart item",
      };
    }
  }

  /**
   * Remove item from cart
   */
  async removeFromCart(productId: number): Promise<CartResponse> {
    try {
      const token = ApiAuthManager.getToken();
      if (!token) {
        throw new Error("Access token required to remove cart items. Please log in.");
      }

      const response = await this.apiClient.delete(`/cart/remove/${productId}`);

      return {
        success: true,
        message: "Item removed from cart successfully",
        data: response.data,
      };
    } catch (error: any) {
      console.error("Error removing item from cart:", error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || "Failed to remove item from cart",
      };
    }
  }

  /**
   * Clear entire cart
   */
  async clearCart(): Promise<CartResponse> {
    try {
      const token = ApiAuthManager.getToken();
      if (!token) {
        throw new Error("Access token required to clear cart. Please log in.");
      }

      const response = await this.apiClient.delete("/cart/clear");

      return {
        success: true,
        message: "Cart cleared successfully",
        data: response.data,
      };
    } catch (error: any) {
      console.error("Error clearing cart:", error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || "Failed to clear cart",
      };
    }
  }
}
