export function useActiveCategory() {
    const route = useRoute()
    const current = computed(() => {
      const q = route.query.category
      return Array.isArray(q) ? q[0] : (q ?? '')
    })
    const isActive = (cat: string) => current.value === cat
    return { current, isActive }
  }
  