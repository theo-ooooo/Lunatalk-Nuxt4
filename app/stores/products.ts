import { defineStore } from 'pinia'
import type { ProductFindResponse, CategoryResponse, PageProductFindResponse, CategoryProductsResponse } from '~/types/api'

export interface ProductsState {
  products: ProductFindResponse[]
  categories: CategoryResponse[]
  currentProduct: ProductFindResponse | null
  isLoading: boolean
  error: string | null
  pagination: {
    page: number
    size: number
    totalElements: number
    totalPages: number
  }
  filters: {
    productName: string
    categoryId: number | null
    minPrice: number
    maxPrice: number
  }
}

export const useProductsStore = defineStore('products', {
  state: (): ProductsState => ({
    products: [],
    categories: [],
    currentProduct: null,
    isLoading: false,
    error: null,
    pagination: {
      page: 0,
      size: 20,
      totalElements: 0,
      totalPages: 0
    },
    filters: {
      productName: '',
      categoryId: null,
      minPrice: 0,
      maxPrice: 0
    }
  }),

  getters: {
    getProducts: (state) => state.products,
    getCategories: (state) => state.categories,
    getCurrentProduct: (state) => state.currentProduct,
    getFilteredProducts: (state) => {
      let filtered = state.products

      if (state.filters.categoryId) {
        filtered = filtered.filter(product => product.category.categoryId === state.filters.categoryId)
      }

      if (state.filters.minPrice > 0) {
        filtered = filtered.filter(product => product.price >= state.filters.minPrice)
      }

      if (state.filters.maxPrice > 0) {
        filtered = filtered.filter(product => product.price <= state.filters.maxPrice)
      }

      if (state.filters.productName) {
        const searchTerm = state.filters.productName.toLowerCase()
        filtered = filtered.filter(product => 
          product.name.toLowerCase().includes(searchTerm)
        )
      }

      return filtered
    }
  },

  actions: {
    async fetchProducts(params?: { productName?: string; pageable: { page: number; size: number; sort?: string[] } }) {
      this.isLoading = true
      this.error = null
      
      try {
        const config = useRuntimeConfig()
        const { data, error } = await useAsyncData('products', () => 
          $fetch('/products', {
            method: 'GET',
            baseURL: config.public.apiBaseUrl,
            query: params || {
              pageable: {
                page: this.pagination.page,
                size: this.pagination.size
              }
            }
          })
        )
        
        if (error.value) {
          throw error.value
        }
        
        const response: CategoryProductsResponse = data.value
        this.products = response.products
        this.pagination = {
          page: 0,
          size: response.products.length,
          totalElements: response.products.length,
          totalPages: 1
        }
      } catch (error) {
        this.error = '상품을 불러오는데 실패했습니다.'
        console.error('Failed to fetch products:', error)
      } finally {
        this.isLoading = false
      }
    },

    async fetchProductById(id: number) {
      this.isLoading = true
      this.error = null
      
      try {
        const config = useRuntimeConfig()
        const { data, error } = await useAsyncData(`product-${id}`, () =>
          $fetch(`/products/${id}`, {
            method: 'GET',
            baseURL: config.public.apiBaseUrl
          })
        )
        
        if (error.value) {
          throw error.value
        }
        
        this.currentProduct = data.value
      } catch (error) {
        this.error = '상품 정보를 불러오는데 실패했습니다.'
        console.error('Failed to fetch product:', error)
      } finally {
        this.isLoading = false
      }
    },

    async fetchCategories() {
      try {
        const config = useRuntimeConfig()
        const { data, error } = await useAsyncData('categories', () =>
          $fetch('/categories', {
            method: 'GET',
            baseURL: config.public.apiBaseUrl
          })
        )
        
        if (error.value) {
          throw error.value
        }
        
        this.categories = data.value
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      }
    },

    async fetchProductsByCategory(categoryId: number) {
      this.isLoading = true
      this.error = null
      
      try {
        const config = useRuntimeConfig()
        const { data, error } = await useAsyncData(`category-products-${categoryId}`, () =>
          $fetch(`/categories/${categoryId}/products`, {
            method: 'GET',
            baseURL: config.public.apiBaseUrl
          })
        )
        
        if (error.value) {
          throw error.value
        }
        
        this.products = data.value.products
      } catch (error) {
        this.error = '카테고리 상품을 불러오는데 실패했습니다.'
        console.error('Failed to fetch category products:', error)
      } finally {
        this.isLoading = false
      }
    },

    setFilters(filters: Partial<ProductsState['filters']>) {
      this.filters = { ...this.filters, ...filters }
    },

    clearFilters() {
      this.filters = {
        productName: '',
        categoryId: null,
        minPrice: 0,
        maxPrice: 0
      }
    },

    setPagination(page: number, size: number) {
      this.pagination.page = page
      this.pagination.size = size
    }
  }
})
