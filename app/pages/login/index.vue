<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- 로그인 폼 -->
    <section class="py-20 flex items-center min-h-screen">
      <div class="max-w-6xl mx-auto px-5 w-full">
        <div class="max-w-md mx-auto bg-white p-12">
          <div class="text-center mb-10">
            <h2 class="text-4xl font-light text-black mb-2 tracking-tight">Sign In</h2>
            <p class="text-sm text-gray-600 font-light">Welcome back to LunaTalk</p>
          </div>

          <form @submit.prevent="handleLogin" class="mb-8">
            <div class="mb-6">
              <label for="email" class="block text-sm font-normal text-black mb-2">Email</label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                class="w-full px-4 py-3 border border-gray-200 text-sm bg-white transition-colors focus:outline-none focus:border-black"
                placeholder="Enter your email"
                required
              />
            </div>

            <div class="mb-6">
              <label for="password" class="block text-sm font-normal text-black mb-2">Password</label>
              <input
                id="password"
                v-model="form.password"
                type="password"
                class="w-full px-4 py-3 border border-gray-200 text-sm bg-white transition-colors focus:outline-none focus:border-black"
                placeholder="Enter your password"
                required
              />
            </div>

            <div class="flex justify-between items-center mb-8">
              <label class="flex items-center text-sm text-gray-600 cursor-pointer">
                <input type="checkbox" v-model="form.rememberMe" class="mr-2" />
                Remember me
              </label>
              <a href="#" class="text-gray-600 text-sm transition-colors hover:text-black">Forgot password?</a>
            </div>

            <button 
              type="submit" 
              class="w-full bg-black text-white px-6 py-4 text-sm font-light tracking-wide transition-colors hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
              :disabled="isLoading"
            >
              {{ isLoading ? 'Signing In...' : 'Sign In' }}
            </button>
          </form>

          <div class="text-center">
            <p class="text-sm text-gray-600">
              Don't have an account? 
              <NuxtLink to="/register" class="text-black font-normal transition-colors hover:text-gray-600">Sign up</NuxtLink>
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// 메타 정보 설정
useHead({
  title: 'Sign In - LunaTalk',
  meta: [
    { name: 'description', content: 'Sign in to your LunaTalk account' }
  ]
})

// 폼 데이터
const form = ref({
  email: '',
  password: '',
  rememberMe: false
})

const isLoading = ref(false)

// 로그인 처리
const handleLogin = async () => {
  isLoading.value = true
  
  try {
    // 실제로는 API 호출
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 로그인 성공 시 리다이렉트
    await navigateTo('/')
  } catch (error) {
    console.error('Login failed:', error)
  } finally {
    isLoading.value = false
  }
}
</script>
