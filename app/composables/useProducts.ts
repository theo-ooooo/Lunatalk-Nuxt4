export const useProducts = () => {
  const productsStore = useProductsStore()

  const fetchProducts = async (params?: { productName?: string; pageable: { page: number; size: number; sort?: string[] } }) => {
    return await productsStore.fetchProducts(params)
  }

  const fetchProductById = async (id: number) => {
    return await productsStore.fetchProductById(id)
  }

  const fetchCategories = async () => {
    return await productsStore.fetchCategories()
  }

  const fetchProductsByCategory = async (categoryId: number) => {
    return await productsStore.fetchProductsByCategory(categoryId)
  }

  const searchProducts = async (productName: string) => {
    return await productsStore.fetchProducts({ productName, pageable: { page: 0, size: 20 } })
  }

  const setFilters = (filters: any) => {
    productsStore.setFilters(filters)
  }

  const clearFilters = () => {
    productsStore.clearFilters()
  }

  const setPagination = (page: number, size: number) => {
    productsStore.setPagination(page, size)
  }

  return {
    fetchProducts,
    fetchProductById,
    fetchCategories,
    fetchProductsByCategory,
    searchProducts,
    setFilters,
    clearFilters,
    setPagination,
    products: computed(() => productsStore.getFilteredProducts),
    categories: computed(() => productsStore.categories),
    currentProduct: computed(() => productsStore.currentProduct),
    pagination: computed(() => productsStore.pagination),
    isLoading: computed(() => productsStore.isLoading),
    error: computed(() => productsStore.error)
  }
}
