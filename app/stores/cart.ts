import { defineStore } from 'pinia'
import type { CartFindResponse, CreateCartItemRequest, UpdateCartItemRequest } from '~/types/api'

export interface CartState {
  items: CartFindResponse[]
  isLoading: boolean
  error: string | null
}

export const useCartStore = defineStore('cart', {
  state: (): CartState => ({
    items: [],
    isLoading: false,
    error: null
  }),

  getters: {
    getCartItems: (state) => state.items,
    getTotalItems: (state) => state.items.reduce((total, item) => total + item.quantity, 0),
    getTotalPrice: (state) => state.items.reduce((total, item) => total + (item.product.price * item.quantity), 0),
    getItemById: (state) => (cartItemId: number) => state.items.find(item => item.cartItemId === cartItemId)
  },

  actions: {
    async fetchCartItems() {
      this.isLoading = true
      this.error = null
      
      try {
        const config = useRuntimeConfig()
        const authStore = useAuthStore()
        
        const { data, error } = await useFetch('/cart-items', {
          baseURL: config.public.apiBaseUrl,
          headers: authStore.accessToken ? {
            'Authorization': `Bearer ${authStore.accessToken}`
          } : {},
          key: 'cart-items'
        })
        
        if (error.value) {
          throw error.value
        }
        
        this.items = data.value as CartFindResponse[]
      } catch (error) {
        this.error = '장바구니를 불러오는데 실패했습니다.'
        console.error('Failed to fetch cart items:', error)
      } finally {
        this.isLoading = false
      }
    },

    async addToCart(productId: number, quantity: number = 1) {
      this.isLoading = true
      this.error = null
      
      try {
        const config = useRuntimeConfig()
        const authStore = useAuthStore()
        
        const { data: response } = await useFetch('/cart-items', {
          method: 'POST',
          baseURL: config.public.apiBaseUrl,
          headers: authStore.accessToken ? {
            'Authorization': `Bearer ${authStore.accessToken}`
          } : {},
          body: { productId, quantity }
        })
        
        // 장바구니 목록 새로고침
        await this.fetchCartItems()
        
        return response.value as any
      } catch (error) {
        this.error = '장바구니에 상품을 추가하는데 실패했습니다.'
        console.error('Failed to add item to cart:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async updateQuantity(cartItemId: number, quantity: number) {
      this.isLoading = true
      this.error = null
      
      try {
        const config = useRuntimeConfig()
        const authStore = useAuthStore()
        
        await useFetch(`/cart-items/${cartItemId}`, {
          method: 'PUT',
          baseURL: config.public.apiBaseUrl,
          headers: authStore.accessToken ? {
            'Authorization': `Bearer ${authStore.accessToken}`
          } : {},
          body: { quantity }
        })
        
        // 장바구니 목록 새로고침
        await this.fetchCartItems()
      } catch (error) {
        this.error = '상품 수량을 변경하는데 실패했습니다.'
        console.error('Failed to update cart item:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async removeFromCart(cartItemId: number) {
      this.isLoading = true
      this.error = null
      
      try {
        const config = useRuntimeConfig()
        const authStore = useAuthStore()
        
        await useFetch(`/cart-items/${cartItemId}`, {
          method: 'DELETE',
          baseURL: config.public.apiBaseUrl,
          headers: authStore.accessToken ? {
            'Authorization': `Bearer ${authStore.accessToken}`
          } : {}
        })
        
        // 장바구니 목록 새로고침
        await this.fetchCartItems()
      } catch (error) {
        this.error = '상품을 제거하는데 실패했습니다.'
        console.error('Failed to remove cart item:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async clearCart() {
      this.isLoading = true
      this.error = null
      
      try {
        // 모든 장바구니 아이템 제거
        const removePromises = this.items.map(item => this.removeFromCart(item.cartItemId))
        await Promise.all(removePromises)
      } catch (error) {
        this.error = '장바구니를 비우는데 실패했습니다.'
        console.error('Failed to clear cart:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    }
  }
})
