<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- 마이페이지 내용 -->
    <section class="py-20">
      <div class="max-w-6xl mx-auto px-5">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <!-- 사이드바 -->
          <aside class="lg:col-span-1">
            <div class="bg-white p-8 mb-6">
              <div class="text-center">
                <div class="w-20 h-20 mx-auto mb-4 overflow-hidden rounded-full">
                  <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" alt="User Avatar" class="w-full h-full object-cover" />
                </div>
                <h3 class="text-lg font-normal text-black mb-1">John Doe</h3>
                <p class="text-sm text-gray-600">john@example.com</p>
              </div>
            </div>
            
            <nav class="bg-white p-6">
              <div class="space-y-2">
                <NuxtLink to="/mypage" class="block text-sm font-light text-black py-2 border-b border-gray-200">Profile</NuxtLink>
                <NuxtLink to="/mypage/orders" class="block text-sm font-light text-gray-600 py-2 border-b border-gray-200 transition-colors hover:text-black">Orders</NuxtLink>
                <NuxtLink to="/mypage/wishlist" class="block text-sm font-light text-gray-600 py-2 border-b border-gray-200 transition-colors hover:text-black">Wishlist</NuxtLink>
                <NuxtLink to="/mypage/addresses" class="block text-sm font-light text-gray-600 py-2 border-b border-gray-200 transition-colors hover:text-black">Addresses</NuxtLink>
                <NuxtLink to="/mypage/settings" class="block text-sm font-light text-gray-600 py-2 transition-colors hover:text-black">Settings</NuxtLink>
              </div>
            </nav>
          </aside>

          <!-- 메인 콘텐츠 -->
          <main class="lg:col-span-3">
            <div class="bg-white p-8">
              <div class="mb-8">
                <h2 class="text-2xl font-light text-black mb-2 tracking-tight">Profile</h2>
                <p class="text-sm text-gray-600">Manage your account information</p>
              </div>

              <form @submit.prevent="handleUpdateProfile" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label for="firstName" class="block text-sm font-normal text-black mb-2">First Name</label>
                    <input
                      id="firstName"
                      v-model="profile.firstName"
                      type="text"
                      class="w-full px-4 py-3 border border-gray-200 text-sm bg-white transition-colors focus:outline-none focus:border-black"
                      placeholder="First name"
                    />
                  </div>
                  <div>
                    <label for="lastName" class="block text-sm font-normal text-black mb-2">Last Name</label>
                    <input
                      id="lastName"
                      v-model="profile.lastName"
                      type="text"
                      class="w-full px-4 py-3 border border-gray-200 text-sm bg-white transition-colors focus:outline-none focus:border-black"
                      placeholder="Last name"
                    />
                  </div>
                </div>

                <div>
                  <label for="email" class="block text-sm font-normal text-black mb-2">Email</label>
                  <input
                    id="email"
                    v-model="profile.email"
                    type="email"
                    class="w-full px-4 py-3 border border-gray-200 text-sm bg-white transition-colors focus:outline-none focus:border-black"
                    placeholder="Email address"
                  />
                </div>

                <div>
                  <label for="phone" class="block text-sm font-normal text-black mb-2">Phone</label>
                  <input
                    id="phone"
                    v-model="profile.phone"
                    type="tel"
                    class="w-full px-4 py-3 border border-gray-200 text-sm bg-white transition-colors focus:outline-none focus:border-black"
                    placeholder="Phone number"
                  />
                </div>

                <div>
                  <label for="birthDate" class="block text-sm font-normal text-black mb-2">Birth Date</label>
                  <input
                    id="birthDate"
                    v-model="profile.birthDate"
                    type="date"
                    class="w-full px-4 py-3 border border-gray-200 text-sm bg-white transition-colors focus:outline-none focus:border-black"
                  />
                </div>

                <div class="flex justify-end">
                  <button 
                    type="submit" 
                    class="bg-black text-white px-8 py-3 text-sm font-light tracking-wide transition-colors hover:bg-gray-800"
                    :disabled="isLoading"
                  >
                    {{ isLoading ? 'Updating...' : 'Update Profile' }}
                  </button>
                </div>
              </form>
            </div>

            <!-- 최근 주문 -->
            <div class="bg-white p-8 mt-6">
              <h3 class="text-xl font-light text-black mb-6 tracking-tight">Recent Orders</h3>
              <div class="space-y-4">
                <div v-for="order in recentOrders" :key="order.id" class="flex justify-between items-center py-4 border-b border-gray-200 last:border-b-0">
                  <div>
                    <p class="text-sm font-normal text-black">Order #{{ order.id }}</p>
                    <p class="text-xs text-gray-600">{{ order.date }}</p>
                  </div>
                  <div class="text-right">
                    <p class="text-sm font-normal text-black">{{ formatPrice(order.total) }}</p>
                    <p class="text-xs text-gray-600">{{ order.status }}</p>
                  </div>
                </div>
              </div>
              <div class="text-center mt-6">
                <NuxtLink to="/mypage/orders" class="text-sm text-gray-600 transition-colors hover:text-black">View All Orders</NuxtLink>
              </div>
            </div>

            <!-- 위시리스트 -->
            <div class="bg-white p-8 mt-6">
              <h3 class="text-xl font-light text-black mb-6 tracking-tight">Wishlist</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div v-for="item in wishlistItems" :key="item.id" class="group cursor-pointer">
                  <div class="relative overflow-hidden mb-3">
                    <img :src="item.image" :alt="item.name" class="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" />
                  </div>
                  <div>
                    <h4 class="text-sm font-normal text-black mb-1">{{ item.name }}</h4>
                    <p class="text-sm font-normal text-black">{{ formatPrice(item.price) }}</p>
                  </div>
                </div>
              </div>
              <div class="text-center mt-6">
                <NuxtLink to="/mypage/wishlist" class="text-sm text-gray-600 transition-colors hover:text-black">View All Wishlist</NuxtLink>
              </div>
            </div>
          </main>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// 메타 정보 설정
useHead({
  title: 'My Page - LunaTalk',
  meta: [
    { name: 'description', content: 'Manage your LunaTalk account' }
  ]
})

// 프로필 데이터
const profile = ref({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phone: '+1 234 567 8900',
  birthDate: '1990-01-01'
})

const isLoading = ref(false)

// 최근 주문 데이터
const recentOrders = ref([
  {
    id: 'LT-2024-001',
    date: '2024-01-15',
    total: 299000,
    status: 'Delivered'
  },
  {
    id: 'LT-2024-002',
    date: '2024-01-10',
    total: 129000,
    status: 'Shipped'
  }
])

// 위시리스트 데이터
const wishlistItems = ref([
  {
    id: 1,
    name: 'Minimalist Watch',
    price: 299000,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop'
  },
  {
    id: 2,
    name: 'Canvas Tote Bag',
    price: 89000,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop'
  }
])

// 프로필 업데이트 처리
const handleUpdateProfile = async () => {
  isLoading.value = true
  
  try {
    // 실제로는 API 호출
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    alert('Profile updated successfully!')
  } catch (error) {
    console.error('Profile update failed:', error)
  } finally {
    isLoading.value = false
  }
}

// 가격 포맷팅 함수
const formatPrice = (price) => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW'
  }).format(price)
}
</script>
