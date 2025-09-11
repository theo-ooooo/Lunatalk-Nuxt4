export const useProductImages = (product: Ref<any>) => {
  const selectedImage = ref(0)

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

  return {
    selectedImage,
    getCurrentMainImage,
    getMainProductImage,
    getProductImage,
    getProductImageUrl
  }
}
