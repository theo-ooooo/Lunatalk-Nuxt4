export const useCart = () => {
  const cartStore = useCartStore()

  const fetchCartItems = async () => {
    return await cartStore.fetchCartItems()
  }

  const addToCart = async (productId: number, quantity: number = 1) => {
    return await cartStore.addToCart(productId, quantity)
  }

  const removeFromCart = async (cartItemId: number) => {
    return await cartStore.removeFromCart(cartItemId)
  }

  const updateQuantity = async (cartItemId: number, quantity: number) => {
    return await cartStore.updateQuantity(cartItemId, quantity)
  }

  const clearCart = async () => {
    return await cartStore.clearCart()
  }

  return {
    fetchCartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    items: computed(() => cartStore.getCartItems),
    totalItems: computed(() => cartStore.getTotalItems),
    totalPrice: computed(() => cartStore.getTotalPrice),
    isLoading: computed(() => cartStore.isLoading),
    error: computed(() => cartStore.error)
  }
}
