<template>
  <section class="py-20 text-center">
    <div class="max-w-6xl mx-auto px-5">
      <div class="text-lg font-light text-gray-600">
        <slot>
          Loading...
        </slot>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Props 정의
interface Props {
  message?: string
}

withDefaults(defineProps<Props>(), {
  message: 'Loading...'
})
</script>
