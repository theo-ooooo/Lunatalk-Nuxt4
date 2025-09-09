<template>
  <div class="bg-gray-50">
    <!-- 메인 히어로 -->
    <section class="bg-white py-30 text-center">
      <div class="max-w-2xl mx-auto px-6">
        <h2 class="text-5xl font-light text-black mb-4 tracking-tight">Curated Selection</h2>
        <p class="text-base text-gray-600 font-light leading-relaxed">Carefully selected items for your lifestyle</p>
      </div>
    </section>

    <!-- 추천 상품 -->
    <section class="bg-white py-20">
      <div class="max-w-6xl mx-auto px-6">
        <div class="flex justify-between items-center mb-10">
          <h2 class="text-4xl font-light text-black tracking-tight">Featured</h2>
          <NuxtLink to="/products" class="text-gray-600 text-sm font-light tracking-wide transition-colors hover:text-black">
            View All
          </NuxtLink>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <NuxtLink 
            v-for="product in featuredProducts" 
            :key="product.id" 
            :to="`/products/${product.id}`"
            class="group cursor-pointer"
          >
            <div class="relative overflow-hidden mb-4">
              <img 
                :src="product.image" 
                :alt="product.name" 
                class="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div 
                v-if="product.isNew" 
                class="absolute top-3 right-3 bg-black text-white px-2 py-1 text-xs font-normal tracking-wide"
              >
                NEW
              </div>
            </div>
            <div class="text-left">
              <h3 class="text-sm font-normal text-black mb-2 leading-snug">{{ product.name }}</h3>
              <p class="text-gray-600 mb-2 leading-snug text-xs font-light">{{ product.description }}</p>
              <div class="text-sm font-normal text-black">{{ formatPrice(product.price) }}</div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// 메타 정보 설정
useHead({
  title: 'LunaTalk - Curated Selection',
  meta: [
    { name: 'description', content: 'Carefully selected items for your lifestyle' }
  ]
})

// 추천 상품 데이터
const featuredProducts = ref([
  {
    id: 1,
    name: 'Minimalist Watch',
    description: 'Clean and timeless design',
    price: 299000,
    isNew: true,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop'
  },
  {
    id: 2,
    name: 'Canvas Tote Bag',
    description: 'Spacious and durable design',
    price: 89000,
    isNew: false,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop'
  },
  {
    id: 3,
    name: 'Premium Notebook',
    description: 'High-quality paper notebook',
    price: 45000,
    isNew: true,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop'
  }
])

// 가격 포맷팅 함수
const formatPrice = (price) => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW'
  }).format(price)
}
</script>