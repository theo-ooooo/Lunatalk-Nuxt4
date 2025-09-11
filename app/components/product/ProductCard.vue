<template>
  <NuxtLink 
    :to="`/products/${product.productId}`"
    class="group cursor-pointer"
  >
    <div class="relative overflow-hidden mb-4">
      <img 
        :src="getProductImage(product)" 
        :alt="product.name" 
        class="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div 
        v-if="product.visibility === 'VISIBLE'" 
        class="absolute top-3 right-3 bg-black text-white px-2 py-1 text-xs font-normal tracking-wide"
      >
        NEW
      </div>
    </div>
    <div class="text-left">
      <h3 class="text-sm font-normal text-black mb-2 leading-snug">{{ product.name }}</h3>
      <p class="text-gray-600 mb-2 leading-snug text-xs font-light">{{ product.category?.categoryName || 'Uncategorized' }}</p>
      <div class="text-sm font-normal text-black">{{ formatPrice(product.price) }}</div>
      <div v-if="product.colors && product.colors.length > 0" class="mt-2">
        <div class="flex gap-1">
          <div 
            v-for="color in product.colors.slice(0, 3)" 
            :key="color"
            class="w-4 h-4 rounded-full border border-gray-300"
            :style="{ backgroundColor: getColorValue(color) }"
            :title="color"
          ></div>
          <span v-if="product.colors.length > 3" class="text-xs text-gray-500 ml-1">+{{ product.colors.length - 3 }}</span>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
interface Props {
  product: any
  getProductImage: (product: any) => string
  formatPrice: (price: number) => string
  getColorValue: (color: string) => string
}

defineProps<Props>()
</script>
