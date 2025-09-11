<template>
  <section class="bg-white py-20">
    <div class="max-w-6xl mx-auto px-5">
      <div v-if="products.length === 0" class="text-center py-30">
        <h3 class="text-2xl font-light text-black mb-2">No products found</h3>
        <p class="text-sm text-gray-600 font-light">Try adjusting your search or browse all categories</p>
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        <ProductCard 
          v-for="product in products" 
          :key="product.productId"
          :product="product"
          :get-product-image="getProductImage"
          :format-price="formatPrice"
          :get-color-value="getColorValue"
        />
      </div>

      <!-- 상품 개수 표시 -->
      <div v-if="products.length > 0" class="mt-20 text-center">
        <div class="text-sm text-gray-600 font-light">
          Showing {{ products.length }} products
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Props {
  products: any[]
  getProductImage: (product: any) => string
  formatPrice: (price: number) => string
  getColorValue: (color: string) => string
}

defineProps<Props>()
</script>
