<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- 페이지 헤더 -->
    <section class="bg-white py-20 text-center">
      <div class="max-w-6xl mx-auto px-5">
        <h2 class="text-4xl font-light text-black mb-2 tracking-tight">Shopping Cart</h2>
        <p class="text-sm text-gray-600 font-light">{{ cartItems.length }} items in your cart</p>
      </div>
    </section>

    <!-- 장바구니 내용 -->
    <section class="py-20">
      <div class="max-w-6xl mx-auto px-5">
        <div v-if="cartItems.length === 0" class="text-center py-20">
          <h3 class="text-2xl font-light text-black mb-2">Your cart is empty</h3>
          <p class="text-sm text-gray-600 mb-8">Add some items to get started</p>
          <NuxtLink to="/products" class="inline-block bg-black text-white px-6 py-4 text-sm font-light tracking-wide transition-colors hover:bg-gray-800">
            Continue Shopping
          </NuxtLink>
        </div>
        
        <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <!-- 장바구니 아이템 목록 -->
          <div class="lg:col-span-2">
            <div class="bg-white p-8">
              <div v-for="item in cartItems" :key="item.id" class="grid grid-cols-12 gap-6 items-center py-6 border-b border-gray-200 last:border-b-0">
                <div class="col-span-2">
                  <img :src="item.image" :alt="item.name" class="w-full h-24 object-cover" />
                </div>
                <div class="col-span-5">
                  <h3 class="text-base font-normal text-black mb-1">{{ item.name }}</h3>
                  <p class="text-xs text-gray-600 mb-2">{{ item.description }}</p>
                  <div class="text-sm font-normal text-black">{{ formatPrice(item.price) }}</div>
                </div>
                <div class="col-span-3">
                  <div class="flex items-center gap-2">
                    <button @click="decreaseQuantity(item.id)" class="w-8 h-8 border border-gray-200 bg-white text-base font-light transition-colors hover:border-black">-</button>
                    <span class="min-w-10 text-center text-sm">{{ item.quantity }}</span>
                    <button @click="increaseQuantity(item.id)" class="w-8 h-8 border border-gray-200 bg-white text-base font-light transition-colors hover:border-black">+</button>
                  </div>
                </div>
                <div class="col-span-1 text-right">
                  <div class="text-base font-normal text-black">{{ formatPrice(item.price * item.quantity) }}</div>
                </div>
                <div class="col-span-1 text-right">
                  <button @click="removeItem(item.id)" class="w-8 h-8 border-none bg-none cursor-pointer text-xl text-gray-400 transition-colors hover:text-black">×</button>
                </div>
              </div>
            </div>
          </div>

          <!-- 주문 요약 -->
          <div class="lg:col-span-1">
            <div class="bg-white p-8 sticky top-32">
              <h3 class="text-lg font-light text-black mb-6">Order Summary</h3>
              <div class="space-y-4">
                <div class="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{{ formatPrice(subtotal) }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>{{ formatPrice(shipping) }}</span>
                </div>
                <div class="flex justify-between text-base font-normal text-black border-t border-gray-200 pt-4">
                  <span>Total</span>
                  <span>{{ formatPrice(total) }}</span>
                </div>
              </div>
              <button class="w-full bg-black text-white px-6 py-4 text-sm font-light tracking-wide transition-colors hover:bg-gray-800 mt-6 mb-4">
                Proceed to Checkout
              </button>
              <NuxtLink to="/products" class="block text-center text-gray-600 text-xs transition-colors hover:text-black">
                Continue Shopping
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// 메타 정보 설정
useHead({
  title: 'Shopping Cart - LunaTalk',
  meta: [
    { name: 'description', content: 'Review your items and proceed to checkout' }
  ]
})

// 장바구니 아이템 (실제로는 상태 관리 라이브러리 사용)
const cartItems = ref([
  {
    id: 1,
    name: 'Minimalist Watch',
    description: 'Clean and timeless design',
    price: 199000,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=250&fit=crop'
  },
  {
    id: 4,
    name: 'Canvas Tote Bag',
    description: 'Eco-friendly and spacious',
    price: 129000,
    quantity: 2,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=250&fit=crop'
  }
])

// 계산된 값들
const subtotal = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
})

const shipping = computed(() => {
  return subtotal.value >= 100000 ? 0 : 3000
})

const total = computed(() => {
  return subtotal.value + shipping.value
})

// 수량 조절 함수
const increaseQuantity = (itemId) => {
  const item = cartItems.value.find(item => item.id === itemId)
  if (item) {
    item.quantity++
  }
}

const decreaseQuantity = (itemId) => {
  const item = cartItems.value.find(item => item.id === itemId)
  if (item && item.quantity > 1) {
    item.quantity--
  }
}

// 아이템 제거 함수
const removeItem = (itemId) => {
  cartItems.value = cartItems.value.filter(item => item.id !== itemId)
}

// 가격 포맷팅 함수
const formatPrice = (price) => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW'
  }).format(price)
}
</script>
