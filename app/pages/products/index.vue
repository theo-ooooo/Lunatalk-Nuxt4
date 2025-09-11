<template>
  <div class="min-h-screen">
    <!-- 페이지 헤더 -->
    <ProductPageHeader 
      :title="getCategoryTitle()"
      :description="getCategoryDescription()"
    />

    <!-- 필터 및 검색 -->
    <ProductFilters 
      v-model:search-query="searchQuery"
      v-model:sort-by="sortBy"
      @search="handleSearch"
    />

    <!-- 로딩 상태 -->
    <LoadingState v-if="isLoading">
      Loading products...
    </LoadingState>

    <!-- 에러 상태 -->
    <ErrorState 
      v-else-if="error" 
      :message="error"
      back-url="/products"
      back-text="Try Again"
    />

    <!-- 상품 목록 -->
    <ProductGrid 
      v-else
      :products="filteredProducts"
      :get-product-image="getProductImage"
      :format-price="formatPrice"
      :get-color-value="getColorValue"
    />
  </div>
</template>

<script setup lang="ts">
// 상품 리스트 관련 composable 직접 import
import { useProductList } from '~/composables/product/useProductList'

const { 
  searchQuery, 
  sortBy, 
  filteredProducts, 
  isLoading, 
  error, 
  refreshProducts, 
  getCategoryTitle, 
  getCategoryDescription 
} = useProductList()

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

// 가격 포맷팅 함수
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW'
  }).format(price)
}

// 메타 정보 설정
useHead({
  title: 'Products - LunaTalk',
  meta: [
    { name: 'description', content: 'Discover our curated collection' }
  ]
})
</script>