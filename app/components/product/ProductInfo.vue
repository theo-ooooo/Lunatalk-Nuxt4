<template>
  <div class="flex flex-col gap-8">
    <!-- 상품명 -->
    <div>
      <h1 class="text-3xl font-bold text-black mb-2">{{ product.name }}</h1>
    </div>

    <!-- 가격 정보 -->
    <div class="flex items-center gap-3">
      <span class="text-2xl font-bold text-black">{{ formatPrice(product.price) }}</span>
      <span v-if="product.originalPrice && product.originalPrice > product.price" class="text-lg text-gray-500 line-through">{{ formatPrice(product.originalPrice) }}</span>
    </div>

    <!-- 리뷰 정보 -->
    <div class="flex items-center gap-2">
      <span class="text-sm text-gray-600">0 리뷰</span>
    </div>

    <!-- 색상 선택 -->
    <div v-if="product.colors && product.colors.length > 0">
      <h3 class="text-sm font-medium text-black mb-3">색상</h3>
      <div class="flex gap-2">
        <button 
          v-for="color in product.colors" 
          :key="color"
          class="px-4 py-2 border border-gray-300 text-sm hover:border-black transition-colors"
          :class="selectedColor === color ? 'border-black bg-gray-50' : 'bg-white'"
          @click="selectedColor = color"
        >
          {{ color }}
        </button>
      </div>
    </div>

    <!-- 수량 조절 -->
    <div class="flex items-center gap-4">
      <h3 class="text-sm font-medium text-black">수량</h3>
      <div class="flex items-center border border-gray-300">
        <button @click="decreaseQuantity" class="px-3 py-2 hover:bg-gray-50 text-lg">-</button>
        <span class="px-4 py-2 min-w-12 text-center text-sm">{{ quantity }}</span>
        <button @click="increaseQuantity" class="px-3 py-2 hover:bg-gray-50 text-lg">+</button>
      </div>
    </div>

    <!-- 총 상품 가격 -->
    <div class="border-t border-gray-200 pt-4">
      <div class="flex justify-between items-center">
        <span class="text-sm font-medium text-black">총 상품 가격</span>
        <span class="text-lg font-bold text-black">{{ formatPrice(product.price * quantity) }}</span>
      </div>
    </div>

    <!-- 구매 버튼 -->
    <div class="flex gap-3">
      <button class="flex-1 px-6 py-4 bg-black text-white font-medium hover:bg-gray-800 transition-colors" @click="buyNow">
        구매하기
      </button>
      <button class="flex-1 px-6 py-4 border border-gray-300 text-black font-medium hover:bg-gray-50 transition-colors" @click="addToCart">
        장바구니
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  product: any
  quantity: number
  selectedColor: string
  formatPrice: (price: number) => string
  increaseQuantity: () => void
  decreaseQuantity: () => void
  addToCart: () => void
  buyNow: () => void
}

defineProps<Props>()
</script>
