<template>
  <div class="min-h-screen flex flex-col">
    <!-- 헤더 -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div class="max-w-6xl mx-auto px-5">
        <div class="flex justify-between items-center py-5">
          <NuxtLink to="/" class="flex items-center">
            <img src="/logo.jpg" alt="LunaTalk" class="h-10 w-auto" />
          </NuxtLink>
          <nav class="flex gap-10">
            <NuxtLink 
              to="/products?category=acc" 
              class="text-gray-600 text-sm font-light tracking-wide transition-colors hover:text-black"
              :class="{ 'text-black': isActiveCategory('acc') }"
            >
              ACC
            </NuxtLink>
            <NuxtLink 
              to="/products?category=bag" 
              class="text-gray-600 text-sm font-light tracking-wide transition-colors hover:text-black"
              :class="{ 'text-black': isActiveCategory('bag') }"
            >
              BAG
            </NuxtLink>
            <NuxtLink 
              to="/products?category=stationery" 
              class="text-gray-600 text-sm font-light tracking-wide transition-colors hover:text-black"
              :class="{ 'text-black': isActiveCategory('stationery') }"
            >
              STATIONERY
            </NuxtLink>
            <NuxtLink 
              to="/products?category=wallet" 
              class="text-gray-600 text-sm font-light tracking-wide transition-colors hover:text-black"
              :class="{ 'text-black': isActiveCategory('wallet') }"
            >
              WALLET
            </NuxtLink>
          </nav>
          <div class="flex gap-8">
            <NuxtLink to="/cart" class="text-gray-600 transition-colors hover:text-black flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="m1 1 4 4 13 0 3 8-13 0"></path>
              </svg>
            </NuxtLink>
            <NuxtLink to="/login" class="text-gray-600 transition-colors hover:text-black flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </NuxtLink>
          </div>
        </div>
      </div>
    </header>

    <!-- 메인 컨텐츠 -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- 푸터 -->
    <footer class="bg-white border-t border-gray-200 py-10 mt-auto">
      <div class="max-w-6xl mx-auto px-5">
        <p class="text-center text-xs text-gray-500 font-light">&copy; 2024 LunaTalk. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
const route = useRoute()

// 현재 카테고리가 활성화되어 있는지 확인
const isActiveCategory = (category) => {
  return route.query.category === category
}
</script>
