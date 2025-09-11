<template>
  <div class="min-h-screen">
    <!-- 로딩 상태 -->
    <section v-if="productLoading" class="py-20 text-center">
      <div class="max-w-6xl mx-auto px-5">
        <div class="text-lg font-light text-gray-600">Loading product...</div>
      </div>
    </section>

    <!-- 에러 상태 -->
    <section v-else-if="productError" class="py-20 text-center">
      <div class="max-w-6xl mx-auto px-5">
        <div class="text-lg font-light text-red-600 mb-4">Failed to load product</div>
        <NuxtLink to="/products" class="inline-block bg-black text-white px-6 py-4 text-sm font-light tracking-wide transition-colors hover:bg-gray-800 border border-black">
          Back to Products
        </NuxtLink>
      </div>
    </section>

    <!-- 상품 상세 정보 -->
    <section v-else-if="product" class="py-10">
      <div class="max-w-6xl mx-auto px-5">
        <!-- 브레드크럼 -->
        <nav class="py-5 flex items-center gap-2 text-xs font-light">
          <NuxtLink to="/" class="text-gray-600 transition-colors hover:text-black">Home</NuxtLink>
          <span class="text-gray-400">/</span>
          <NuxtLink to="/products" class="text-gray-600 transition-colors hover:text-black">Products</NuxtLink>
          <span class="text-gray-400">/</span>
          <span class="text-black">{{ product.name }}</span>
        </nav>

        <!-- 윗단: 상품 이미지와 정보 -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-20 mt-10">
          <!-- 상품 이미지 -->
          <div class="flex flex-col gap-4">
            <div class="overflow-hidden">
              <img 
                :src="getCurrentMainImage()" 
                :alt="product.name" 
                class="w-full h-80 object-cover" 
              />
            </div>
            <div v-if="product && product.images && product.images.filter(img => img.imageType === 'PRODUCT_CONTENT').length > 0" class="flex gap-2 overflow-x-auto">
              <div 
                v-for="(image, index) in product.images.filter(img => img.imageType === 'PRODUCT_CONTENT')" 
                :key="`content-${index}`"
                class="w-20 h-20 overflow-hidden cursor-pointer border transition-colors flex-shrink-0"
                :class="selectedImage === index ? 'border-black' : 'border-transparent'"
                @click="selectedImage = index"
              >
                <img :src="getProductImageUrl(image)" :alt="`${product.name} ${index + 1}`" class="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          <!-- 상품 정보 -->
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
        </div>

        <!-- 아랫단: 탭 메뉴 (가로사이즈 100%) -->
        <div class="w-full mt-20">
          <!-- 탭 메뉴 -->
          <div class="border-t border-gray-200 pt-6">
            <div class="flex">
              <button 
                v-for="tab in tabs" 
                :key="tab.id"
                class="flex-1 text-sm font-medium pb-2 border-b-2 transition-colors"
                :class="activeTab === tab.id ? 'border-black text-black' : 'border-transparent text-gray-500'"
                @click="activeTab = tab.id"
              >
                {{ tab.name }}
              </button>
            </div>
            
            <!-- 탭 컨텐츠 -->
            <div class="mt-6">
              <div v-if="activeTab === 'order'" class="text-sm text-gray-600">
                <p>주문 정보가 여기에 표시됩니다.</p>
              </div>
              <div v-else-if="activeTab === 'product'" class="text-sm text-gray-600">
                <div v-if="product && product.images && product.images.filter(img => img.imageType === 'PRODUCT_CONTENT').length > 0" class="space-y-4">
                  <div 
                    v-for="(image, index) in product.images.filter(img => img.imageType === 'PRODUCT_CONTENT')" 
                    :key="`content-${index}`"
                    class="w-full"
                  >
                    <img 
                      :src="getProductImageUrl(image)" 
                      :alt="`${product.name} 상품 이미지 ${index + 1}`" 
                      class="w-full h-auto object-cover" 
                    />
                  </div>
                </div>
                <div v-else class="text-gray-500">
                  <p>상품 이미지가 없습니다.</p>
                </div>
              </div>
              <div v-else-if="activeTab === 'review'" class="text-sm text-gray-600">
                <p>리뷰가 여기에 표시됩니다.</p>
              </div>
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
  </div>
</template>

<script setup lang="ts">
// 라우트 파라미터 가져오기
const route = useRoute()
const productId = route.params.id

// 반응형 데이터
const selectedImage = ref(0)
const quantity = ref(1)
const selectedColor = ref('')
const activeTab = ref('product')

// 탭 메뉴
const tabs = [
  { id: 'order', name: '주문 정보' },
  { id: 'product', name: '상품 정보' },
  { id: 'review', name: '리뷰' }
]

// API 설정
const config = useRuntimeConfig()

// 상품 데이터 가져오기
const { data: productResponse, pending: productLoading, error: productError } = await useFetch(`/products/${productId}`, {
  baseURL: config.public.apiBaseUrl,
  key: `product-${productId}`
})

// API 응답에서 실제 상품 데이터 추출
const product = computed(() => {
  const response = productResponse.value as any
  return response?.data || response
})

// 컨텐츠 이미지가 변경될 때 selectedImage 초기화
watch(() => product.value?.images, (newImages) => {
  if (newImages && Array.isArray(newImages)) {
    const contentImages = newImages.filter((img: any) => img.imageType === 'PRODUCT_CONTENT')
    if (contentImages.length > 0) {
      // selectedImage가 유효한 범위를 벗어나면 0으로 초기화
      if (selectedImage.value >= contentImages.length) {
        selectedImage.value = 0
      }
    } else {
      // 컨텐츠 이미지가 없으면 0으로 초기화
      selectedImage.value = 0
    }
  }
}, { immediate: true })

// 색상이 변경될 때 첫 번째 색상 자동 선택
watch(() => product.value?.colors, (newColors) => {
  if (newColors && Array.isArray(newColors) && newColors.length > 0) {
    selectedColor.value = newColors[0]
  }
}, { immediate: true })

// 관련 상품 가져오기 (같은 카테고리의 다른 상품들)
const { data: relatedProductsData } = await useFetch('/products', {
  baseURL: config.public.apiBaseUrl,
  key: `related-products-${productId}`,
  query: computed(() => {
    if (product.value?.category?.categoryId) {
      return {
        categoryId: product.value.category.categoryId,
        pageable: { page: 0, size: 3 }
      }
    }
    return { pageable: { page: 0, size: 3 } }
  }),
  watch: [() => product.value?.category?.categoryId]
})

// 관련 상품 (현재 상품 제외)
const relatedProducts = computed(() => {
  if (!relatedProductsData.value?.products) return []
  return relatedProductsData.value.products.filter(p => p.productId !== parseInt(productId)).slice(0, 3)
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

// 현재 메인 이미지 가져오기 (컨텐츠 이미지 선택 시 해당 이미지, 아니면 썸네일)
const getCurrentMainImage = () => {
  if (product.value?.images && Array.isArray(product.value.images) && product.value.images.length > 0) {
    const contentImages = product.value.images.filter((img: any) => img.imageType === 'PRODUCT_CONTENT')
    
    // 컨텐츠 이미지가 있고 선택된 인덱스가 유효한 경우
    if (contentImages.length > 0 && selectedImage.value >= 0 && selectedImage.value < contentImages.length) {
      const selectedImg = contentImages[selectedImage.value]
      if (selectedImg?.imageUrl) {
        return `https://media-v2.lunatalk.co.kr/${selectedImg.imageUrl}`
      }
    }
    
    // 컨텐츠 이미지가 없거나 선택된 인덱스가 유효하지 않은 경우 썸네일
    const thumbnailImage = product.value.images.find((img: any) => img.imageType === 'PRODUCT_THUMBNAIL')
    if (thumbnailImage?.imageUrl) {
      return `https://media-v2.lunatalk.co.kr/${thumbnailImage.imageUrl}`
    }
    
    // 썸네일도 없으면 첫 번째 이미지
    if (product.value.images[0]?.imageUrl) {
      return `https://media-v2.lunatalk.co.kr/${product.value.images[0].imageUrl}`
    }
  }
  // 기본 이미지
  return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop'
}

// 메인 상품 이미지 가져오기 (썸네일 우선)
const getMainProductImage = () => {
  if (product.value?.images && product.value.images.length > 0) {
    // 썸네일 이미지 찾기
    const thumbnailImage = product.value.images.find((img: any) => img.imageType === 'PRODUCT_THUMBNAIL')
    if (thumbnailImage) {
      return `https://media-v2.lunatalk.co.kr/${thumbnailImage.imageUrl}`
    }
    // 썸네일이 없으면 첫 번째 이미지
    return `https://media-v2.lunatalk.co.kr/${product.value.images[0].imageUrl}`
  }
  // 기본 이미지
  return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop'
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

// 상품 이미지 URL 가져오기
const getProductImageUrl = (image: any) => {
  if (typeof image === 'string') {
    return `https://media-v2.lunatalk.co.kr/${image}`
  }
  return `https://media-v2.lunatalk.co.kr/${image.imageUrl}`
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

// 가격 포맷팅 함수
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW'
  }).format(price)
}
</script>