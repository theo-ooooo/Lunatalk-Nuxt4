<template>
  <div class="w-full mt-20">
    <!-- 탭 메뉴 -->
    <div class="border-t border-gray-200 pt-6">
      <div class="flex">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          class="flex-1 text-sm font-medium pb-2 border-b-2 transition-colors"
          :class="activeTab === tab.id ? 'border-black text-black' : 'border-transparent text-gray-500'"
          @click="handleTabClick(tab.id)"
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
</template>

<script setup lang="ts">
interface Props {
  product: any
  activeTab: string
  tabs: Array<{ id: string; name: string }>
  getProductImageUrl: (image: any) => string
}

interface Emits {
  (e: 'update:activeTab', value: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const handleTabClick = (tabId: string) => {
  emit('update:activeTab', tabId)
}
</script>
