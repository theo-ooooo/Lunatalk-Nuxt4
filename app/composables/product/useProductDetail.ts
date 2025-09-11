export const useProductDetail = (productId: string | string[]) => {
  // API 설정
  const config = useRuntimeConfig()

  // 상품 데이터 가져오기
  const { data: productResponse, pending: productLoading, error: productError } = useFetch(`/products/${productId}`, {
    baseURL: config.public.apiBaseUrl,
    key: `product-${productId}`
  })

  // API 응답에서 실제 상품 데이터 추출
  const product = computed(() => {
    const response = productResponse.value as any
    return response?.data || response
  })

  // 관련 상품 가져오기 (같은 카테고리의 다른 상품들)
  const { data: relatedProductsData } = useFetch('/products', {
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
    return relatedProductsData.value.products.filter(p => p.productId !== parseInt(productId as string)).slice(0, 3)
  })

  return {
    product,
    productLoading,
    productError,
    relatedProducts
  }
}
