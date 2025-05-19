import Product from "../models/Product";

interface CartItem {
  productId: number;
  quantity: number;
}

interface CartItemWithDetails {
  product: Product;
  quantity: number;
  total: number;
}

interface CartSummary {
  items: CartItemWithDetails[];
  total: number;
}

export const getCartItems = async (cart: Record<string, CartItem>, userId: number): Promise<CartSummary> => {
  const cartItems = [];
  let total = 0;

  // Filter cart items for current user
  for (const [key, item] of Object.entries(cart)) {
    if (!key.startsWith(userId + "_")) continue;
    
    const product = await Product.findByPk(item.productId);
    if (product) {
      const itemTotal = product.price * item.quantity;
      cartItems.push({
        product,
        quantity: item.quantity,
        total: itemTotal,
      });
      total += itemTotal;
    }
  }

  return {
    items: cartItems,
    total
  }
}