// API 응답 타입 정의
export interface ApiResponse<T = any> {
  success?: boolean
  data?: T
  message?: string
}

// 인증 관련 타입
export interface LoginRequest {
  username: string
  password: string
}

export interface CreateMemberRequest {
  username: string
  password: string
  phone: string
  email: string
}

export interface AuthTokenResponse {
  accessToken: string
  refreshToken: string
}

export interface RefreshTokenRequest {
  refreshToken: string
}

// 상품 관련 타입
export interface ProductFindResponse {
  productId: number
  name: string
  price: number
  quantity: number
  visibility: 'VISIBLE' | 'HIDDEN'
  colors: string[]
  images: FindImageDto[]
  category: CategoryResponse
}

export interface FindImageDto {
  imageType: string
  imageUrl: string
  imageKey: string
}

export interface CategoryResponse {
  categoryId: number
  categoryName: string
  status: 'ACTIVE' | 'DELETED'
  visibility: 'VISIBLE' | 'HIDDEN'
  productCount: number
}

export interface PageProductFindResponse {
  totalElements: number
  totalPages: number
  size: number
  content: ProductFindResponse[]
  number: number
  first: boolean
  last: boolean
  empty: boolean
}

// 카테고리별 상품 API 응답 타입
export interface CategoryProductsResponse {
  categoryId: number
  categoryName: string
  products: ProductFindResponse[]
}

// 장바구니 관련 타입
export interface CartFindResponse {
  cartItemId: number
  product: FindProductDto
  quantity: number
}

export interface FindProductDto {
  productId: number
  productName: string
  price: number
  quantity: number
  visibility: 'VISIBLE' | 'HIDDEN'
  colors: string[]
  category: CategoryResponse
  images: Image[]
}

export interface Image {
  id: number
  imageType: 'PRODUCT_THUMBNAIL' | 'PRODUCT_CONTENT'
  imageKey: string
  imagePath: string
  imageOrder: number
  imageFileExtension: 'PNG' | 'JPG' | 'JPEG' | 'WEBP'
  imageStatus: 'PENDING' | 'COMPLETED' | 'DELETED'
}

export interface CreateCartItemRequest {
  productId: number
  quantity: number
}

export interface CreateCartItemResponse {
  cartItemId: number
}

export interface UpdateCartItemRequest {
  quantity: number
}

// 주문 관련 타입
export interface OrderCreateRequest {
  '구매할 상품들': OrderProductRequest[]
}

export interface OrderProductRequest {
  '상품 ID': number
  '상품 갯수': number
  '상품 옵션': OptionSnapshot
}

export interface OptionSnapshot {
  color: string
}

export interface OrderCreateResponse {
  '회원용_주문번호': string
  '관리자용_주문번호': number
}

export interface OrderFindResponse {
  orderId: number
  orderNumber: string
  status: 'ORDERED' | 'PAYMENT_FAILED' | 'CANCELLED' | 'SHIPPED' | 'DELIVERED'
  totalPrice: number
  orderItems: OrderItemResponse[]
  deliveries: DeliveryFindResponse[]
  member: MemberInfoResponse
  createdAt: string
}

export interface OrderItemResponse {
  productName: string
  price: number
  quantity: number
  totalPrice: number
  color: string
}

export interface DeliveryFindResponse {
  deliveryId: number
  receiverName: string
  receiverPhone: string
  addressLine1: string
  addressLine2: string
  zipcode: string
  message: string
  courierCompany: 'CJ_LOGISTICS' | 'HANJIN' | 'LOTTE' | 'KOREA_POST' | 'LOGEN' | 'UPS' | 'DHL' | 'FEDEX' | 'OTHER'
  trackingNumber: string
  status: 'READY' | 'SHIPPED' | 'DELIVERED' | 'RETURNED' | 'REDELIVERY'
}

// 회원 관련 타입
export interface MemberInfoResponse {
  memberId: number
  username: string
  nickname: string
  phone: string
  email: string
  profileImgUrl: string
  createdAt: string
}

// 기획전 관련 타입
export interface ExhibitionFindOneResponse {
  exhibitionId: number
  title: string
  description: string
  visibility: 'VISIBLE' | 'HIDDEN'
  startAt: string
  endAt: string
  products: ExhibitionProductDto[]
}

export interface ExhibitionProductDto {
  product: FindProductDto
  sortOrder: number
}

// 페이지네이션 타입
export interface Pageable {
  page: number
  size: number
  sort?: string[]
}
