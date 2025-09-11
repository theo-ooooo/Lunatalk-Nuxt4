<template>
  <div class="min-h-screen">
    <!-- 로딩 상태 -->
    <LoadingState v-if="productLoading">
      Loading product...
    </LoadingState>

    <!-- 에러 상태 -->
    <ErrorState 
      v-else-if="productError" 
      message="Failed to load product"
      back-url="/products"
      back-text="Back to Products"
    />

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
          <ProductImageGallery 
            :product="product"
            v-model:selected-image="selectedImage"
            :get-current-main-image="getCurrentMainImage"
            :get-product-image-url="getProductImageUrl"
          />

          <!-- 상품 정보 -->
          <ProductInfo 
            :product="product"
            :quantity="quantity"
            :selected-color="selectedColor"
            :format-price="formatPrice"
            :increase-quantity="increaseQuantity"
            :decrease-quantity="decreaseQuantity"
            :add-to-cart="addToCart"
            :buy-now="buyNow"
          />
        </div>

        <!-- 아랫단: 탭 메뉴 (가로사이즈 100%) -->
        <ProductTabs 
          :product="product"
          v-model:active-tab="activeTab"
          :tabs="tabs"
          :get-product-image-url="getProductImageUrl"
        />
      </div>
    </section>

    <!-- 상품이 없을 때 -->
    <EmptyState 
      v-else
      title="Product Not Found"
      description="The requested product does not exist or has been removed."
      action-url="/products"
      action-text="Back to Products"
    />

    <!-- 관련 상품 -->
    <RelatedProducts 
      :product="product"
      :related-products="relatedProducts"
      :get-product-image="getProductImage"
      :format-price="formatPrice"
    />
  </div>
</template>

<script setup lang="ts">
// 상품 관련 composables 직접 import
import { useProductDetail } from '~/composables/product/useProductDetail'
import { useProductImages } from '~/composables/product/useProductImages'
import { useProductPurchase } from '~/composables/product/useProductPurchase'

// 라우트 파라미터 가져오기
const route = useRoute()
const productId = route.params.id

// 탭 메뉴
const activeTab = ref('product')
const tabs = [
  { id: 'order', name: '주문 정보' },
  { id: 'product', name: '상품 정보' },
  { id: 'review', name: '리뷰' }
]

// 상품 관련 composables 사용
const { product, productLoading, productError, relatedProducts } = useProductDetail(productId)
const { selectedImage, getCurrentMainImage, getProductImage, getProductImageUrl } = useProductImages(product)
const { quantity, selectedColor, increaseQuantity, decreaseQuantity, addToCart, buyNow, formatPrice } = useProductPurchase(product)

// 메타 정보 설정
useHead(() => ({
  title: product.value ? `${product.value.name} - LunaTalk` : 'Product Detail - LunaTalk',
  meta: [
    { name: 'description', content: product.value?.description || 'Product detail information' }
  ]
}))

</script>