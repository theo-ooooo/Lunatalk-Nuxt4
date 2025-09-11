export const useProductPurchase = (product: Ref<any>) => {
  const quantity = ref(1)
  const selectedColor = ref('')

  // 색상이 변경될 때 첫 번째 색상 자동 선택
  watch(() => product.value?.colors, (newColors) => {
    if (newColors && Array.isArray(newColors) && newColors.length > 0) {
      selectedColor.value = newColors[0]
    }
  }, { immediate: true })

  // 수량 조절 함수
  const increaseQuantity = () => {
    quantity.value++
  }

  const decreaseQuantity = () => {
    if (quantity.value > 1) {
      quantity.value--
    }
  }

  // 장바구니 담기
  const addToCart = () => {
    // 실제로는 장바구니 로직 구현
    alert(`${product.value.name}을(를) ${quantity.value}개 장바구니에 담았습니다.`)
  }

  // 바로 구매
  const buyNow = () => {
    // 실제로는 결제 페이지로 이동
    alert(`${product.value.name}을(를) ${quantity.value}개 바로 구매합니다.`)
  }

  // 가격 포맷팅 함수
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(price)
  }

  // 색상 값 변환
  const getColorValue = (color: string) => {
    const colorMap: Record<string, string> = {
      'Black': '#000000',
      'White': '#FFFFFF',
      'Red': '#FF0000',
      'Blue': '#0000FF',
      'Green': '#008000',
      'Yellow': '#FFFF00',
      'Pink': '#FFC0CB',
      'Purple': '#800080',
      'Orange': '#FFA500',
      'Gray': '#808080',
      'Brown': '#A52A2A'
    }
    return colorMap[color] || '#CCCCCC'
  }

  return {
    quantity,
    selectedColor,
    increaseQuantity,
    decreaseQuantity,
    addToCart,
    buyNow,
    formatPrice,
    getColorValue
  }
}
