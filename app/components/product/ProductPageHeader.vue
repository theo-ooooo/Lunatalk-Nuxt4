<template>
  <section class="bg-white py-20 text-center">
    <div class="max-w-6xl mx-auto px-5">
      <div class="max-w-2xl mx-auto">
        <h2 class="text-5xl font-light text-black mb-4 tracking-tight">{{ title }}</h2>
        <p class="text-base text-gray-600 font-light leading-relaxed">{{ description }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Props {
  title: string
  description: string
}

defineProps<Props>()
</script>
