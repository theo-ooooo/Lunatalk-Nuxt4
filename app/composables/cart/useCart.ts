export const useCart = () => {
  const cartItems = ref<any[]>([])
  const isLoading = ref(false)

  // 장바구니 아이템 가져오기
  const fetchCartItems = async () => {
    const config = useRuntimeConfig()
    const { data } = await useFetch('/cart', {
      baseURL: config.public.apiBaseUrl,
      key: 'cart-items'
    })
    
    cartItems.value = (data.value as any) || []
    return data.value
  }

  // 장바구니에 추가
  const addToCart = async (productId: number, quantity: number = 1) => {
    const config = useRuntimeConfig()
    const { data } = await useFetch('/cart', {
      method: 'POST',
      baseURL: config.public.apiBaseUrl,
      body: { productId, quantity }
    })
    
    // 장바구니 목록 새로고침
    await fetchCartItems()
    return data.value
  }

  // 수량 업데이트
  const updateQuantity = async (cartItemId: number, quantity: number) => {
    const config = useRuntimeConfig()
    const { data } = await useFetch(`/cart/${cartItemId}`, {
      method: 'PUT',
      baseURL: config.public.apiBaseUrl,
      body: { quantity }
    })
    
    // 장바구니 목록 새로고침
    await fetchCartItems()
    return data.value
  }

  // 장바구니에서 제거
  const removeFromCart = async (cartItemId: number) => {
    const config = useRuntimeConfig()
    const { data } = await useFetch(`/cart/${cartItemId}`, {
      method: 'DELETE',
      baseURL: config.public.apiBaseUrl
    })
    
    // 장바구니 목록 새로고침
    await fetchCartItems()
    return data.value
  }

  // 장바구니 총 가격
  const totalPrice = computed(() => {
    return cartItems.value.reduce((total, item) => {
      return total + (item.price * item.quantity)
    }, 0)
  })

  // 장바구니 아이템 수
  const itemCount = computed(() => {
    return cartItems.value.reduce((total, item) => {
      return total + item.quantity
    }, 0)
  })

  return {
    cartItems,
    isLoading,
    fetchCartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    totalPrice,
    itemCount
  }
}
