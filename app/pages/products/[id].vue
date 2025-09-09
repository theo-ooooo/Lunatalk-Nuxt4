<template>
  <div class="min-h-screen">
    <!-- 상품 상세 정보 -->
    <section v-if="product" class="py-10">
      <div class="max-w-6xl mx-auto px-5">
        <!-- 브레드크럼 -->
        <nav class="py-5 flex items-center gap-2 text-xs font-light">
          <NuxtLink to="/" class="text-gray-600 transition-colors hover:text-black">Home</NuxtLink>
          <span class="text-gray-400">/</span>
          <NuxtLink to="/products" class="text-gray-600 transition-colors hover:text-black">Products</NuxtLink>
          <span class="text-gray-400">/</span>
          <span class="text-black">{{ product.name }}</span>
        </nav>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-20 mt-10">
          <!-- 상품 이미지 -->
          <div class="flex flex-col gap-4">
            <div class="overflow-hidden">
              <img :src="product.image" :alt="product.name" class="w-full h-96 object-cover" />
            </div>
            <div class="flex gap-2">
              <div 
                v-for="(image, index) in product.images" 
                :key="index"
                class="w-20 h-20 overflow-hidden cursor-pointer border transition-colors"
                :class="selectedImage === index ? 'border-black' : 'border-transparent'"
                @click="selectedImage = index"
              >
                <img :src="image" :alt="`${product.name} ${index + 1}`" class="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          <!-- 상품 정보 -->
          <div class="flex flex-col gap-6">
            <div class="flex justify-between items-start gap-4">
              <h1 class="text-4xl font-light text-black tracking-tight leading-tight flex-1">{{ product.name }}</h1>
              <div class="flex gap-2">
                <span v-if="product.isNew" class="bg-black text-white px-2 py-1 text-xs font-normal tracking-wide">NEW</span>
                <span v-if="product.isBest" class="bg-gray-600 text-white px-2 py-1 text-xs font-normal tracking-wide">BEST</span>
              </div>
            </div>

            <div class="flex items-center gap-4">
              <span class="text-2xl font-normal text-black">{{ formatPrice(product.price) }}</span>
              <span v-if="product.originalPrice" class="text-lg text-gray-400 line-through">{{ formatPrice(product.originalPrice) }}</span>
              <span v-if="product.discount" class="bg-black text-white px-2 py-1 text-xs font-normal tracking-wide">{{ product.discount }}% 할인</span>
            </div>

            <div>
              <p class="text-gray-600 leading-relaxed text-sm font-light">{{ product.description }}</p>
            </div>

            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-base font-normal text-black mb-4 tracking-wide">Features</h3>
              <ul class="space-y-2">
                <li v-for="feature in product.features" :key="feature" class="text-gray-600 text-sm font-light flex items-start">
                  <span class="text-black font-bold mr-2">•</span>
                  {{ feature }}
                </li>
              </ul>
            </div>

            <div class="flex items-center gap-4">
              <label class="text-sm font-light text-black tracking-wide">Quantity:</label>
              <div class="flex items-center border border-gray-200">
                <button @click="decreaseQuantity" class="bg-white px-4 py-3 text-base font-light transition-colors hover:bg-gray-50 text-black">-</button>
                <span class="px-4 py-3 min-w-16 text-center font-light text-sm text-black">{{ quantity }}</span>
                <button @click="increaseQuantity" class="bg-white px-4 py-3 text-base font-light transition-colors hover:bg-gray-50 text-black">+</button>
              </div>
            </div>

            <div class="flex gap-4">
              <button class="flex-1 px-6 py-4 border border-gray-200 text-sm font-light tracking-wide transition-all hover:bg-gray-50 hover:border-black text-black" @click="addToCart">
                Add to Cart
              </button>
              <button class="flex-1 px-6 py-4 bg-black text-white text-sm font-light tracking-wide transition-colors hover:bg-gray-800" @click="buyNow">
                Buy Now
              </button>
            </div>

            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-base font-normal text-black mb-4 tracking-wide">Shipping Information</h3>
              <ul class="space-y-2">
                <li class="text-gray-600 text-sm font-light flex items-start">
                  <span class="text-black font-bold mr-2">•</span>
                  Free shipping on orders over ₩50,000
                </li>
                <li class="text-gray-600 text-sm font-light flex items-start">
                  <span class="text-black font-bold mr-2">•</span>
                  Standard delivery: 2-3 business days
                </li>
                <li class="text-gray-600 text-sm font-light flex items-start">
                  <span class="text-black font-bold mr-2">•</span>
                  Same-day delivery: Orders before 2 PM
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 상품이 없을 때 -->
    <section v-else class="py-20 text-center">
      <div class="max-w-6xl mx-auto px-5">
        <h2 class="text-4xl font-light text-black mb-4 tracking-tight">Product Not Found</h2>
        <p class="text-gray-600 mb-8 text-sm font-light">The requested product does not exist or has been removed.</p>
        <NuxtLink to="/products" class="inline-block bg-black text-white px-6 py-4 text-sm font-light tracking-wide transition-colors hover:bg-gray-800 border border-black">
          Back to Products
        </NuxtLink>
      </div>
    </section>

    <!-- 관련 상품 -->
    <section v-if="product" class="bg-white py-20 border-t border-gray-200">
      <div class="max-w-6xl mx-auto px-5">
        <h2 class="text-4xl font-light text-black mb-10 tracking-tight text-center">Related Products</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <NuxtLink 
            v-for="relatedProduct in relatedProducts" 
            :key="relatedProduct.id" 
            :to="`/products/${relatedProduct.id}`"
            class="group cursor-pointer"
          >
            <div class="relative overflow-hidden mb-4">
              <img 
                :src="relatedProduct.image" 
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
  </div>
</template>

<script setup>
// 라우트 파라미터 가져오기
const route = useRoute()
const productId = route.params.id

// 반응형 데이터
const selectedImage = ref(0)
const quantity = ref(1)

// 상품 데이터 (실제로는 API에서 가져와야 함)
const products = ref([
  {
    id: 1,
    name: 'Minimalist Watch',
    description: 'Clean and timeless design with premium materials. Perfect for everyday wear and special occasions.',
    price: 299000,
    originalPrice: 399000,
    discount: 25,
    rating: 4.8,
    reviewCount: 1247,
    isNew: true,
    isBest: true,
    category: 'acc',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1594534475808-b18fc33b045e?w=600&h=600&fit=crop'
    ],
    features: [
      'Swiss movement',
      'Sapphire crystal glass',
      'Water resistant to 50m',
      'Genuine leather strap',
      '2-year warranty'
    ]
  },
  {
    id: 2,
    name: 'Canvas Tote Bag',
    description: 'Spacious and durable canvas tote bag perfect for daily use. Features multiple compartments and reinforced handles.',
    price: 89000,
    rating: 4.6,
    reviewCount: 892,
    isNew: false,
    isBest: true,
    category: 'bag',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=600&h=600&fit=crop'
    ],
    features: [
      '100% organic cotton canvas',
      'Reinforced handles',
      'Multiple interior pockets',
      'Machine washable',
      'Dimensions: 40cm x 35cm x 15cm'
    ]
  },
  {
    id: 3,
    name: 'Premium Notebook Set',
    description: 'High-quality paper notebook set with elegant design. Perfect for writing, sketching, and note-taking.',
    price: 45000,
    rating: 4.5,
    reviewCount: 456,
    isNew: true,
    isBest: false,
    category: 'stationery',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=600&fit=crop'
    ],
    features: [
      'Premium paper quality',
      'Lay-flat binding',
      'Elastic closure',
      'Ribbon bookmark',
      'Set of 3 notebooks'
    ]
  },
  {
    id: 4,
    name: 'Leather Card Holder',
    description: 'Slim and elegant leather card holder with RFID blocking technology. Holds up to 8 cards comfortably.',
    price: 129000,
    rating: 4.7,
    reviewCount: 234,
    isNew: false,
    isBest: true,
    category: 'wallet',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=600&h=600&fit=crop'
    ],
    features: [
      'Genuine Italian leather',
      'RFID blocking technology',
      'Holds up to 8 cards',
      'Slim profile design',
      'Handcrafted construction'
    ]
  }
])

// 현재 상품 찾기
const product = computed(() => {
  return products.value.find(p => p.id === parseInt(productId))
})

// 관련 상품 (현재 상품 제외)
const relatedProducts = computed(() => {
  return products.value.filter(p => p.id !== parseInt(productId)).slice(0, 3)
})

// 메타 정보 설정
useHead(() => ({
  title: product.value ? `${product.value.name} - LunaTalk` : 'Product Detail - LunaTalk',
  meta: [
    { name: 'description', content: product.value?.description || 'Product detail information' }
  ]
}))

// 수량 조절 함수
const increaseQuantity = () => {
  quantity.value++
}

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

// 장바구니 담기
const addToCart = () => {
  // 실제로는 장바구니 로직 구현
  alert(`${product.value.name}을(를) ${quantity.value}개 장바구니에 담았습니다.`)
}

// 바로 구매
const buyNow = () => {
  // 실제로는 결제 페이지로 이동
  alert(`${product.value.name}을(를) ${quantity.value}개 바로 구매합니다.`)
}

// 가격 포맷팅 함수
const formatPrice = (price) => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW'
  }).format(price)
}
</script>