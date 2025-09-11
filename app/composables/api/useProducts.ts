export const useProducts = () => {
  const config = useRuntimeConfig()

  // 모든 상품 가져오기
  const fetchProducts = async (params?: any) => {
    const { data, pending, error } = await useFetch('/products', {
      baseURL: config.public.apiBaseUrl,
      key: 'products',
      query: params
    })
    
    return { data, pending, error }
  }

  // 카테고리별 상품 가져오기
  const fetchProductsByCategory = async (categoryId: number, params?: any) => {
    const { data, pending, error } = await useFetch(`/categories/${categoryId}/products`, {
      baseURL: config.public.apiBaseUrl,
      key: `products-category-${categoryId}`,
      query: params
    })
    
    return { data, pending, error }
  }

  // 상품 검색
  const searchProducts = async (query: string, params?: any) => {
    const { data, pending, error } = await useFetch('/products/search', {
      baseURL: config.public.apiBaseUrl,
      key: `products-search-${query}`,
      query: { q: query, ...params }
    })
    
    return { data, pending, error }
  }

  return {
    fetchProducts,
    fetchProductsByCategory,
    searchProducts
  }
}
