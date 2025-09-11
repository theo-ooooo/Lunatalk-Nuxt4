<template>
  <section class="bg-white py-8 border-b border-gray-200">
    <div class="max-w-6xl mx-auto px-5">
      <div class="flex gap-5 items-center">
        <div class="flex-1 max-w-md">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search products..." 
            class="w-full px-4 py-3 border border-gray-200 text-sm font-light bg-white transition-colors focus:outline-none focus:border-black"
            @input="handleSearch"
          />
        </div>
        <div class="min-w-48">
          <select 
            v-model="sortBy" 
            class="w-full px-4 py-3 border border-gray-200 text-sm font-light bg-white transition-colors focus:outline-none focus:border-black"
          >
            <option value="name">Name</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Props {
  searchQuery: string
  sortBy: string
}

interface Emits {
  (e: 'update:searchQuery', value: string): void
  (e: 'update:sortBy', value: string): void
  (e: 'search'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 검색 처리 (디바운스)
let searchTimeout: ReturnType<typeof setTimeout>
const handleSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    emit('search')
  }, 300)
}

// v-model을 위한 computed
const searchQuery = computed({
  get: () => props.searchQuery,
  set: (value) => emit('update:searchQuery', value)
})

const sortBy = computed({
  get: () => props.sortBy,
  set: (value) => emit('update:sortBy', value)
})
</script>
