export const useAuth = () => {
  const authStore = useAuthStore()

  const login = async (username: string, password: string) => {
    return await authStore.login(username, password)
  }

  const register = async (userData: { username: string; password: string; phone: string; email: string }) => {
    return await authStore.register(userData)
  }

  const logout = async () => {
    return await authStore.logout()
  }

  const checkAuth = async () => {
    return await authStore.checkAuth()
  }

  const reissueToken = async () => {
    return await authStore.reissueToken()
  }

  return {
    login,
    register,
    logout,
    checkAuth,
    reissueToken,
    isAuthenticated: computed(() => authStore.isAuthenticated),
    user: computed(() => authStore.user),
    isLoading: computed(() => authStore.isLoading)
  }
}
