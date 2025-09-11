<template>
  <section v-if="product && relatedProducts.length > 0" class="bg-white py-20 border-t border-gray-200">
    <div class="max-w-6xl mx-auto px-5">
      <h2 class="text-4xl font-light text-black mb-10 tracking-tight text-center">Related Products</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        <NuxtLink 
          v-for="relatedProduct in relatedProducts" 
          :key="relatedProduct.productId" 
          :to="`/products/${relatedProduct.productId}`"
          class="group cursor-pointer"
        >
          <div class="relative overflow-hidden mb-4">
            <img 
              :src="getProductImage(relatedProduct)" 
              :alt="relatedProduct.name" 
              class="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div class="text-left">
            <h3 class="text-sm font-normal text-black mb-2 leading-snug">{{ relatedProduct.name }}</h3>
            <p class="text-sm font-normal text-black mb-4">{{ formatPrice(relatedProduct.price) }}</p>
            <span class="text-gray-600 text-xs font-light border-b border-transparent transition-colors hover:text-black hover:border-black pb-0.5">
              View Details
            </span>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Props {
  product: any
  relatedProducts: any[]
  getProductImage: (product: any) => string
  formatPrice: (price: number) => string
}

defineProps<Props>()
</script>
