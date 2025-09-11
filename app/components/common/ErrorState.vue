<template>
  <section class="py-20 text-center">
    <div class="max-w-6xl mx-auto px-5">
      <div class="text-lg font-light text-red-600 mb-4">
        <slot>
          {{ message }}
        </slot>
      </div>
      <slot name="action">
        <NuxtLink 
          :to="backUrl" 
          class="inline-block bg-black text-white px-6 py-4 text-sm font-light tracking-wide transition-colors hover:bg-gray-800 border border-black"
        >
          {{ backText }}
        </NuxtLink>
      </slot>
    </div>
  </section>
</template>

<script setup lang="ts">
// Props 정의
interface Props {
  message?: string
  backUrl?: string
  backText?: string
}

withDefaults(defineProps<Props>(), {
  message: 'An error occurred',
  backUrl: '/',
  backText: 'Go Back'
})
</script>
