export const useProductList = () => {
  // 반응형 데이터
  const searchQuery = ref('')
  const sortBy = ref('name')

  // API 연동
  const config = useRuntimeConfig()

  // URL 쿼리 파라미터 가져오기
  const route = useRoute()
  const categoryName = computed(() => route.query.category || '')

  // 카테고리 데이터 가져오기
  const { data: categoriesData, pending: categoriesLoading, error: categoriesError } = useFetch('/categories', {
    baseURL: config.public.apiBaseUrl,
    key: 'categories'
  })

  // 상품 데이터 가져오기 (카테고리별)
  const { data: productsData, pending: productsLoading, error: productsError, refresh: refreshProducts } = useFetch(() => {
    // 카테고리가 있으면 카테고리별 상품 API 호출
    if (categoryName.value) {
      const categoryList = (categoriesData.value as any)?.data || categoriesData.value || []
      const category = categoryList.find((cat: any) => 
        cat.categoryName.toLowerCase() === (categoryName.value as string).toLowerCase()
      )
      if (category) {
        return `/categories/${category.categoryId}/products`
      }
    }
    
    // 카테고리가 없으면 기본 상품 목록
    return '/products'
  }, {
    baseURL: config.public.apiBaseUrl,
    key: 'products',
    query: computed(() => ({
      pageable: { page: 0, size: 100 }
    })),
    watch: [categoryName]
  })

  // 반응형 데이터
  const allProducts = computed(() => {
    const data = productsData.value as any
    if (Array.isArray(data)) return data
    if (data?.data?.products && Array.isArray(data.data.products)) return data.data.products
    if (data?.data?.content && Array.isArray(data.data.content)) return data.data.content
    if (data?.data && Array.isArray(data.data)) return data.data
    if (data?.content && Array.isArray(data.content)) return data.content
    return []
  })

  const categories = computed(() => {
    const data = categoriesData.value as any
    if (Array.isArray(data)) return data
    if (data?.data && Array.isArray(data.data)) return data.data
    if (data?.content && Array.isArray(data.content)) return data.content
    return []
  })

  const isLoading = computed(() => productsLoading.value || categoriesLoading.value)
  const error = computed(() => productsError.value || categoriesError.value)

  // 필터링된 상품 목록
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

  return {
    searchQuery,
    sortBy,
    allProducts,
    categories,
    filteredProducts,
    isLoading,
    error,
    refreshProducts,
    getCategoryTitle,
    getCategoryDescription
  }
}
