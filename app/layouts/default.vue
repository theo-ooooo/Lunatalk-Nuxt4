<template>
  <div class="min-h-screen flex flex-col bg-white text-gray-900">
    <!-- 헤더 -->
    <header
      :class="[
        'sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/70 transition-all duration-300',
        isScrolled ? 'bg-white/90 border-b border-gray-200 shadow-sm' : 'bg-white/40'
      ]"
    >
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="flex justify-between items-center h-16 lg:h-20">
          <NuxtLink to="/" class="flex items-center gap-3 group">
            <img src="/logo.jpg" alt="LunaTalk" class="h-9 w-auto rounded-sm" />
            <span class="sr-only">LunaTalk 홈</span>
          </NuxtLink>

          <!-- 데스크톱 네비 -->
          <nav v-if="categories && categories.length > 0" class="hidden md:flex items-center gap-8">
            <NavItem 
              v-for="category in categories" 
              :key="category.categoryId"
              :label="category?.categoryName?.toUpperCase() || ''" 
              :to="`/products?category=${category?.categoryName?.toLowerCase() || ''}`" 
              :active="isActive(category?.categoryName?.toLowerCase() || '')" 
            />
          </nav>

          <!-- 우측 액션 -->
          <div class="hidden md:flex items-center gap-3">
            <IconButton to="/cart" aria-label="장바구니">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="m1 1 4 4h13l3 8H8"></path>
              </svg>
            </IconButton>
            <IconButton to="/login" aria-label="로그인">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </IconButton>
          </div>

          <!-- 모바일 토글 -->
          <button
            @click="open = !open"
            class="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-full border border-gray-200 text-gray-600 hover:text-black hover:border-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10"
            :aria-expanded="open"
            aria-controls="mobile-menu"
          >
            <span class="sr-only">메뉴 열기</span>
            <svg v-if="!open" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <line x1="3" x2="21" y1="6" y2="6" />
              <line x1="3" x2="21" y1="12" y2="12" />
              <line x1="3" x2="21" y1="18" y2="18" />
            </svg>
            <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <!-- 모바일 메뉴 -->
        <transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 -translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-2"
        >
          <div v-if="open" id="mobile-menu" class="md:hidden pb-4">
            <div class="grid gap-1 rounded-xl border border-gray-200 p-2 bg-white">
              <MobileNavItem 
                v-for="category in categories" 
                :key="category.categoryId"
                :label="category?.categoryName?.toUpperCase() || ''" 
                :to="`/products?category=${category?.categoryName?.toLowerCase() || ''}`" 
                :active="isActive(category?.categoryName?.toLowerCase() || '')" 
                @click="open=false" 
              />
              <div class="mt-2 flex gap-2">
                <NuxtLink to="/cart" class="flex-1 inline-flex items-center justify-center h-10 rounded-lg border border-gray-200 text-gray-700 hover:border-gray-300" @click="open=false">Cart</NuxtLink>
                <NuxtLink to="/login" class="flex-1 inline-flex items-center justify-center h-10 rounded-lg bg-gray-900 text-white hover:bg-black" @click="open=false">Login</NuxtLink>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </header>

    <main class="flex-1">
      <slot />
    </main>

    <footer class="border-t border-gray-200 mt-auto">
      <div class="mx-auto max-w-7xl px-6 lg:px-8 py-10">
        <p class="text-center text-xs text-gray-500">&copy; 2024 LunaTalk. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const open = ref(false)
const { isScrolled } = useHeaderScroll()
const { isActive } = useActiveCategory()

// 카테고리 데이터 가져오기
const config = useRuntimeConfig()
const { data: categoriesData } = await useFetch('/categories', {
  baseURL: config.public.apiBaseUrl,
  key: 'categories'
})

// 카테고리 데이터 안전하게 처리
const categories = computed(() => {
  const data = categoriesData.value as any
  // API 응답이 배열인지 확인
  if (Array.isArray(data)) {
    return data
  }
  // API 응답이 객체이고 data 속성이 있는 경우
  if (data?.data && Array.isArray(data.data)) {
    return data.data
  }
  // API 응답이 객체이고 content 속성이 있는 경우
  if (data?.content && Array.isArray(data.content)) {
    return data.content
  }
  // 기본값으로 빈 배열 반환
  return []
})
</script>
