type StockInfo = {
  quantity?: number | null;
  is_in_stock?: boolean;
  track_inventory?: boolean;
};

/**
 * How many units of a product a customer may hold in the cart.
 * Returns null when the stock is not limited (inventory not tracked / unknown).
 */
export const getStockLimit = (product?: StockInfo | null): number | null => {
  if (!product) return null;
  if (product.track_inventory === false) return null;
  const qty = product.quantity;
  if (typeof qty !== "number" || !Number.isFinite(qty)) return null;
  // A product reported as in stock with a non-positive quantity is not inventory-tracked
  if (qty <= 0 && product.is_in_stock) return null;
  return Math.max(0, qty);
};

/** True when one more unit can be added on top of `currentQuantity`. */
export const canAddMore = (product: StockInfo | null | undefined, currentQuantity: number) => {
  const limit = getStockLimit(product);
  return limit === null || currentQuantity < limit;
};
