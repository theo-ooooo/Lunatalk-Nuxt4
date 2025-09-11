export const useActiveCategory = () => {
  const activeCategory = ref<string>('')

  const setActiveCategory = (category: string) => {
    activeCategory.value = category
  }

  const clearActiveCategory = () => {
    activeCategory.value = ''
  }

  const isActive = (category: string) => {
    return activeCategory.value === category
  }

  return {
    activeCategory,
    setActiveCategory,
    clearActiveCategory,
    isActive
  }
}
