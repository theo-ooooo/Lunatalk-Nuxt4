<template>
  <div class="min-h-screen">
    <!-- 페이지 헤더 -->
    <section class="bg-white py-20 text-center">
      <div class="max-w-6xl mx-auto px-5">
        <div class="max-w-2xl mx-auto">
          <h2 class="text-5xl font-light text-black mb-4 tracking-tight">{{ getCategoryTitle() }}</h2>
          <p class="text-base text-gray-600 font-light leading-relaxed">{{ getCategoryDescription() }}</p>
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
              @input="handleSearch"
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

    <!-- 로딩 상태 -->
    <section v-if="isLoading" class="bg-white py-20">
      <div class="max-w-6xl mx-auto px-5 text-center">
        <div class="text-lg font-light text-gray-600">Loading products...</div>
      </div>
    </section>

    <!-- 에러 상태 -->
    <section v-else-if="error" class="bg-white py-20">
      <div class="max-w-6xl mx-auto px-5 text-center">
        <div class="text-lg font-light text-red-600 mb-4">{{ error }}</div>
        <button 
          @click="refreshProducts" 
          class="px-6 py-3 bg-black text-white text-sm font-light hover:bg-gray-800 transition-colors"
        >
          Try Again
        </button>
      </div>
    </section>

    <!-- 상품 목록 -->
    <section v-else class="bg-white py-20">
      <div class="max-w-6xl mx-auto px-5">
        <div v-if="filteredProducts.length === 0" class="text-center py-30">
          <h3 class="text-2xl font-light text-black mb-2">No products found</h3>
          <p class="text-sm text-gray-600 font-light">Try adjusting your search or browse all categories</p>
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <NuxtLink 
            v-for="product in filteredProducts" 
            :key="product.productId" 
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
        </div>

        <!-- 상품 개수 표시 -->
        <div v-if="filteredProducts.length > 0" class="mt-20 text-center">
          <div class="text-sm text-gray-600 font-light">
            Showing {{ filteredProducts.length }} products
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { CategoryProductsResponse } from '~/types/api'

// 반응형 데이터
const searchQuery = ref('')
const sortBy = ref('name')

// API 연동 - useAsyncData 사용
const config = useRuntimeConfig()

// URL 쿼리 파라미터 가져오기
const route = useRoute()
const categoryName = computed(() => route.query.category || '')

// 카테고리 데이터 가져오기
const { data: categoriesData, pending: categoriesLoading, error: categoriesError } = await useFetch('/categories', {
  baseURL: config.public.apiBaseUrl,
  key: 'categories'
})

// 상품 데이터 가져오기 (카테고리별)
const { data: productsData, pending: productsLoading, error: productsError, refresh: refreshProducts } = await useFetch(() => {
  // 카테고리가 있으면 카테고리별 상품 API 호출
  if (categoryName.value) {
    console.log('categoryName from URL:', categoryName.value)
    // 카테고리 이름으로 카테고리 ID 찾기
    const categoryList = (categoriesData.value as any)?.data || categoriesData.value || []
    const category = categoryList.find((cat: any) => 
      cat.categoryName.toLowerCase() === (categoryName.value as string).toLowerCase()
    )
    if (category) {
      console.log('Found category:', category.categoryName, 'ID:', category.categoryId)
      return `/categories/${category.categoryId}/products`
    }
  }
  
  // 카테고리가 없으면 기본 상품 목록
  console.log('No category selected')
  return '/products'
}, {
  baseURL: config.public.apiBaseUrl,
  key: 'products',
  query: computed(() => ({
    pageable: { page: 0, size: 100 }
  })),
  watch: [categoryName] // 카테고리가 변경될 때마다 새로 가져오기
})

// 반응형 데이터
const allProducts = computed(() => {
  const data = productsData.value as any
  // API 응답이 배열인지 확인
  if (Array.isArray(data)) {
    return data
  }
  // 카테고리별 상품 API 응답: data.products
  if (data?.data?.products && Array.isArray(data.data.products)) {
    return data.data.products
  }
  // API 응답이 객체이고 data.content 속성이 있는 경우
  if (data?.data?.content && Array.isArray(data.data.content)) {
    return data.data.content
  }
  // API 응답이 객체이고 data 속성이 있는 경우
  if (data?.data && Array.isArray(data.data)) {
    return data.data
  }
  // API 응답이 객체이고 content 속성이 있는 경우
  if (data?.content && Array.isArray(data.content)) {
    return data.content
  }
  // 기본값으로 빈 배열 반환
  return []
})
const categories = computed(() => {
  const data = categoriesData.value as any
  // API 응답이 배열인지 확인
  if (Array.isArray(data)) {
    return data
  }
  // API 응답이 객체이고 data 속성이 있는 경우
  if (data?.data && Array.isArray(data.data)) {
    return data.data
  }
  // API 응답이 객체이고 content 속성이 있는 경우
  if (data?.content && Array.isArray(data.content)) {
    return data.content
  }
  // 기본값으로 빈 배열 반환
  return []
})
const isLoading = computed(() => productsLoading.value || categoriesLoading.value)
const error = computed(() => productsError.value || categoriesError.value)

// 메타 정보 설정
useHead({
  title: 'Products - LunaTalk',
  meta: [
    { name: 'description', content: 'Discover our curated collection' }
  ]
})

// 필터링된 상품 목록 (클라이언트 사이드 검색 및 정렬)
const filteredProducts = computed(() => {
  let filtered = [...allProducts.value]

  // 검색 필터
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(product => 
      product.name.toLowerCase().includes(query)
    )
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

// 검색 처리 (디바운스)
let searchTimeout: ReturnType<typeof setTimeout>
const handleSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    // 검색은 computed에서 자동으로 처리됨
  }, 300)
}


// 상품 이미지 가져오기 (썸네일 우선, 없으면 첫 번째 이미지)
const getProductImage = (product: any) => {
  if (product.images && product.images.length > 0) {
    // 썸네일 이미지 찾기
    const thumbnailImage = product.images.find((img: any) => img.imageType === 'PRODUCT_THUMBNAIL')
    if (thumbnailImage) {
      return `https://media-v2.lunatalk.co.kr/${thumbnailImage.imageUrl}`
    }
    // 썸네일이 없으면 첫 번째 이미지
    return `https://media-v2.lunatalk.co.kr/${product.images[0].imageUrl}`
  }
  // 기본 이미지
  return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop'
}

// 색상 값 변환
const getColorValue = (color: string) => {
  const colorMap: Record<string, string> = {
    'Black': '#000000',
    'White': '#FFFFFF',
    'Red': '#FF0000',
    'Blue': '#0000FF',
    'Green': '#008000',
    'Yellow': '#FFFF00',
    'Pink': '#FFC0CB',
    'Purple': '#800080',
    'Orange': '#FFA500',
    'Gray': '#808080',
    'Brown': '#A52A2A'
  }
  return colorMap[color] || '#CCCCCC'
}

// 카테고리별 제목과 설명
const getCategoryTitle = () => {
  if (categoryName.value) {
    const selectedCategory = categories.value.find((cat: any) => 
      cat.categoryName.toLowerCase() === (categoryName.value as string).toLowerCase()
    )
    return selectedCategory?.categoryName || 'Products'
  }
  return 'All Products'
}

const getCategoryDescription = () => {
  if (categoryName.value) {
    return 'Carefully curated products in this category'
  }
  return 'Discover our curated collection'
}

// 가격 포맷팅 함수
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW'
  }).format(price)
}
</script>