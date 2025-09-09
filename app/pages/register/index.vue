<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- 회원가입 폼 -->
    <section class="py-20 flex items-center min-h-screen">
      <div class="max-w-6xl mx-auto px-5 w-full">
        <div class="max-w-md mx-auto bg-white p-12">
          <div class="text-center mb-10">
            <h2 class="text-4xl font-light text-black mb-2 tracking-tight">Create Account</h2>
            <p class="text-sm text-gray-600 font-light">Join LunaTalk today</p>
          </div>

          <form @submit.prevent="handleRegister" class="mb-8">
            <div class="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label for="firstName" class="block text-sm font-normal text-black mb-2">First Name</label>
                <input
                  id="firstName"
                  v-model="form.firstName"
                  type="text"
                  class="w-full px-4 py-3 border border-gray-200 text-sm bg-white transition-colors focus:outline-none focus:border-black"
                  placeholder="First name"
                  required
                />
              </div>
              <div>
                <label for="lastName" class="block text-sm font-normal text-black mb-2">Last Name</label>
                <input
                  id="lastName"
                  v-model="form.lastName"
                  type="text"
                  class="w-full px-4 py-3 border border-gray-200 text-sm bg-white transition-colors focus:outline-none focus:border-black"
                  placeholder="Last name"
                  required
                />
              </div>
            </div>

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
                placeholder="Create a password"
                required
              />
            </div>

            <div class="mb-6">
              <label for="confirmPassword" class="block text-sm font-normal text-black mb-2">Confirm Password</label>
              <input
                id="confirmPassword"
                v-model="form.confirmPassword"
                type="password"
                class="w-full px-4 py-3 border border-gray-200 text-sm bg-white transition-colors focus:outline-none focus:border-black"
                placeholder="Confirm your password"
                required
              />
            </div>

            <div class="mb-8">
              <label class="flex items-start text-sm text-gray-600 cursor-pointer">
                <input type="checkbox" v-model="form.agreeTerms" class="mt-1 mr-2" required />
                <span>I agree to the <a href="#" class="text-black underline">Terms of Service</a> and <a href="#" class="text-black underline">Privacy Policy</a></span>
              </label>
            </div>

            <div class="mb-8">
              <label class="flex items-center text-sm text-gray-600 cursor-pointer">
                <input type="checkbox" v-model="form.newsletter" class="mr-2" />
                <span>Subscribe to our newsletter for updates and offers</span>
              </label>
            </div>

            <button 
              type="submit" 
              class="w-full bg-black text-white px-6 py-4 text-sm font-light tracking-wide transition-colors hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
              :disabled="isLoading"
            >
              {{ isLoading ? 'Creating Account...' : 'Create Account' }}
            </button>
          </form>

          <div class="text-center">
            <p class="text-sm text-gray-600">
              Already have an account? 
              <NuxtLink to="/login" class="text-black font-normal transition-colors hover:text-gray-600">Sign in</NuxtLink>
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
  title: 'Create Account - LunaTalk',
  meta: [
    { name: 'description', content: 'Create your LunaTalk account' }
  ]
})

// 폼 데이터
const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false,
  newsletter: false
})

const isLoading = ref(false)

// 회원가입 처리
const handleRegister = async () => {
  if (form.value.password !== form.value.confirmPassword) {
    alert('Passwords do not match')
    return
  }

  isLoading.value = true
  
  try {
    // 실제로는 API 호출
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 회원가입 성공 시 리다이렉트
    await navigateTo('/login')
  } catch (error) {
    console.error('Registration failed:', error)
  } finally {
    isLoading.value = false
  }
}
</script>
