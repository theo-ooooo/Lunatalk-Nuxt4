<template>
  <div class="flex flex-col gap-4">
    <!-- 메인 이미지 -->
    <div class="overflow-hidden">
      <img 
        :src="getCurrentMainImage()" 
        :alt="product.name" 
        class="w-full h-80 object-cover" 
      />
    </div>
    
    <!-- 썸네일 갤러리 -->
    <div v-if="product && product.images && product.images.filter(img => img.imageType === 'PRODUCT_CONTENT').length > 0" class="flex gap-2 overflow-x-auto">
      <div 
        v-for="(image, index) in product.images.filter(img => img.imageType === 'PRODUCT_CONTENT')" 
        :key="`content-${index}`"
        class="w-20 h-20 overflow-hidden cursor-pointer border transition-colors flex-shrink-0"
        :class="selectedImage === index ? 'border-black' : 'border-transparent'"
        @click="handleImageClick(index)"
      >
        <img :src="getProductImageUrl(image)" :alt="`${product.name} ${index + 1}`" class="w-full h-full object-cover" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  product: any
  selectedImage: number
  getCurrentMainImage: () => string
  getProductImageUrl: (image: any) => string
}

interface Emits {
  (e: 'update:selectedImage', value: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const handleImageClick = (index: number) => {
  emit('update:selectedImage', index)
}
</script>
