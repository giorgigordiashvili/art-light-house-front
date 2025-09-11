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
      // Check if user is authenticated
      if (!ApiAuthManager.isAuthenticated()) {
        throw new Error("Authentication required to add items to cart");
      }

      // Use FormData for Laravel compatibility
      const formData = new FormData();
      formData.append("product_id", productId.toString());
      formData.append("quantity", quantity.toString());

      const response = await this.apiClient.post("/add-to-cart", formData, {
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
      if (!ApiAuthManager.isAuthenticated()) {
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
      if (!ApiAuthManager.isAuthenticated()) {
        throw new Error("Authentication required to update cart items");
      }

      const formData = new FormData();
      formData.append("product_id", productId.toString());
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
      if (!ApiAuthManager.isAuthenticated()) {
        throw new Error("Authentication required to remove cart items");
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
      if (!ApiAuthManager.isAuthenticated()) {
        throw new Error("Authentication required to clear cart");
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
