<template>
  <div class="min-h-screen">
    <!-- 페이지 헤더 -->
    <section class="bg-white py-20 text-center">
      <div class="max-w-6xl mx-auto px-5">
        <div class="max-w-2xl mx-auto">
          <h2 class="text-5xl font-light text-black mb-4 tracking-tight">{{ getCategoryTitle(currentCategory) }}</h2>
          <p class="text-base text-gray-600 font-light leading-relaxed">{{ getCategoryDescription(currentCategory) }}</p>
        </div>
      </div>
    </section>

    <!-- 필터 및 검색 -->
    <section class="bg-white py-8 border-b border-gray-200">
      <div class="max-w-6xl mx-auto px-5">
        <div class="flex gap-5 items-center">
          <div class="flex-1 max-w-md">
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Search products..." 
              class="w-full px-4 py-3 border border-gray-200 text-sm font-light bg-white transition-colors focus:outline-none focus:border-black"
            />
          </div>
          <div class="min-w-48">
            <select 
              v-model="sortBy" 
              class="w-full px-4 py-3 border border-gray-200 text-sm font-light bg-white transition-colors focus:outline-none focus:border-black"
            >
              <option value="name">Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>
    </section>

    <!-- 상품 목록 -->
    <section class="bg-white py-20">
      <div class="max-w-6xl mx-auto px-5">
        <div v-if="filteredProducts.length === 0" class="text-center py-30">
          <h3 class="text-2xl font-light text-black mb-2">No products found</h3>
          <p class="text-sm text-gray-600 font-light">Try adjusting your search or browse all categories</p>
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <NuxtLink 
            v-for="product in filteredProducts" 
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
// 라우트 파라미터 가져오기
const route = useRoute()
const currentCategory = ref(route.query.category || 'all')

// 반응형 데이터
const searchQuery = ref('')
const sortBy = ref('name')

// 메타 정보 설정
useHead({
  title: 'Products - LunaTalk',
  meta: [
    { name: 'description', content: 'Discover our curated collection' }
  ]
})

// 상품 데이터
const products = ref([
  {
    id: 1,
    name: 'Minimalist Watch',
    description: 'Clean and timeless design with premium materials',
    price: 299000,
    isNew: true,
    category: 'acc',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop'
  },
  {
    id: 2,
    name: 'Canvas Tote Bag',
    description: 'Spacious and durable canvas tote bag',
    price: 89000,
    isNew: false,
    category: 'bag',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop'
  },
  {
    id: 3,
    name: 'Premium Notebook Set',
    description: 'High-quality paper notebook set',
    price: 45000,
    isNew: true,
    category: 'stationery',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop'
  },
  {
    id: 4,
    name: 'Leather Card Holder',
    description: 'Slim and elegant leather card holder',
    price: 129000,
    isNew: false,
    category: 'wallet',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop'
  },
  {
    id: 5,
    name: 'Wireless Earbuds',
    description: 'Premium sound quality with noise cancellation',
    price: 199000,
    isNew: true,
    category: 'acc',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop'
  },
  {
    id: 6,
    name: 'Leather Backpack',
    description: 'Classic leather backpack for everyday use',
    price: 249000,
    isNew: false,
    category: 'bag',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop'
  }
])

// 필터링된 상품 목록
const filteredProducts = computed(() => {
  let filtered = [...products.value]

  // 검색 필터
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(product => 
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query)
    )
  }

  // 카테고리 필터
  if (currentCategory.value && currentCategory.value !== 'all') {
    filtered = filtered.filter(product => product.category === currentCategory.value)
  }

  // 정렬
  if (sortBy.value === 'name') {
    filtered.sort((a, b) => a.name.localeCompare(b.name))
  } else if (sortBy.value === 'price-low') {
    filtered.sort((a, b) => a.price - b.price)
  } else if (sortBy.value === 'price-high') {
    filtered.sort((a, b) => b.price - a.price)
  }

  return filtered
})

// 카테고리별 제목과 설명
const getCategoryTitle = (category) => {
  const titles = {
    'acc': 'Accessories',
    'bag': 'Bags',
    'stationery': 'Stationery',
    'wallet': 'Wallets',
    'all': 'All Products'
  }
  return titles[category] || 'Products'
}

const getCategoryDescription = (category) => {
  const descriptions = {
    'acc': 'Carefully curated accessories for your style',
    'bag': 'Functional and stylish bags for every occasion',
    'stationery': 'Premium stationery for work and creativity',
    'wallet': 'Minimalist wallets and card holders',
    'all': 'Discover our curated collection'
  }
  return descriptions[category] || 'Discover our curated collection'
}

// 가격 포맷팅 함수
const formatPrice = (price) => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW'
  }).format(price)
}
</script>