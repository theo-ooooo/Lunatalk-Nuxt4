export function useHeaderScroll(threshold = 8) {
    const isScrolled = ref(false)
    if (process.client) {
      const onScroll = () => { isScrolled.value = window.scrollY > threshold }
      onScroll()
      window.addEventListener('scroll', onScroll, { passive: true })
      onUnmounted(() => window.removeEventListener('scroll', onScroll))
    }
    return { isScrolled }
  }
  