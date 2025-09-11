export const useAuth = () => {
  const accessToken = ref<string | null>(null)
  const refreshToken = ref<string | null>(null)
  const user = ref<any>(null)

  // 로그인
  const login = async (email: string, password: string) => {
    const config = useRuntimeConfig()
    const { data } = await useFetch('/auth/login', {
      method: 'POST',
      baseURL: config.public.apiBaseUrl,
      body: { email, password }
    })
    
    if (data.value) {
      accessToken.value = (data.value as any).accessToken
      refreshToken.value = (data.value as any).refreshToken
      return data.value
    }
  }

  // 회원가입
  const register = async (userData: any) => {
    const config = useRuntimeConfig()
    const { data } = await useFetch('/auth/register', {
      method: 'POST',
      baseURL: config.public.apiBaseUrl,
      body: userData
    })
    return data.value
  }

  // 사용자 정보 가져오기
  const fetchUserInfo = async () => {
    if (!accessToken.value) return null
    
    const config = useRuntimeConfig()
    const { data } = await useFetch('/auth/me', {
      baseURL: config.public.apiBaseUrl,
      headers: {
        Authorization: `Bearer ${accessToken.value}`
      }
    })
    
    user.value = data.value
    return data.value
  }

  // 토큰 재발급
  const reissueToken = async () => {
    if (!refreshToken.value) return null
    
    const config = useRuntimeConfig()
    const { data } = await useFetch('/auth/reissue', {
      method: 'POST',
      baseURL: config.public.apiBaseUrl,
      body: { refreshToken: refreshToken.value }
    })
    
    if (data.value) {
      accessToken.value = (data.value as any).accessToken
      refreshToken.value = (data.value as any).refreshToken
    }
    
    return data.value
  }

  // 로그아웃
  const logout = () => {
    accessToken.value = null
    refreshToken.value = null
    user.value = null
  }

  return {
    accessToken,
    refreshToken,
    user,
    login,
    register,
    fetchUserInfo,
    reissueToken,
    logout
  }
}
