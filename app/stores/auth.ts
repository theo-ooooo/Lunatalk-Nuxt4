import { defineStore } from 'pinia'
import type { MemberInfoResponse, AuthTokenResponse } from '~/types/api'

export interface AuthState {
  user: MemberInfoResponse | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: false
  }),

  getters: {
    isLoggedIn: (state) => state.isAuthenticated && !!state.accessToken,
    userInfo: (state) => state.user
  },

  actions: {
    async login(username: string, password: string) {
      this.isLoading = true
      try {
        const config = useRuntimeConfig()
        const { data: response } = await useFetch('/auth/login', {
          method: 'POST',
          baseURL: config.public.apiBaseUrl,
          body: { username, password }
        })
        
        this.accessToken = (response.value as any).accessToken
        this.refreshToken = (response.value as any).refreshToken
        this.isAuthenticated = true
        
        // 토큰을 localStorage에 저장
        if (process.client) {
          localStorage.setItem('auth_token', this.accessToken!)
          localStorage.setItem('refresh_token', this.refreshToken!)
        }
        
        // 사용자 정보 가져오기
        await this.fetchUserInfo()
        
        return response.value
      } catch (error) {
        console.error('Login failed:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async register(userData: { username: string; password: string; phone: string; email: string }) {
      this.isLoading = true
      try {
        const config = useRuntimeConfig()
        const { data: response } = await useFetch('/auth/register', {
          method: 'POST',
          baseURL: config.public.apiBaseUrl,
          body: userData
        })
        
        this.accessToken = (response.value as any).accessToken
        this.refreshToken = (response.value as any).refreshToken
        this.isAuthenticated = true
        
        if (process.client) {
          localStorage.setItem('auth_token', this.accessToken!)
          localStorage.setItem('refresh_token', this.refreshToken!)
        }
        
        // 사용자 정보 가져오기
        await this.fetchUserInfo()
        
        return response.value
      } catch (error) {
        console.error('Registration failed:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async fetchUserInfo() {
      try {
        const config = useRuntimeConfig()
        const { data, error } = await useFetch('/members/me', {
          baseURL: config.public.apiBaseUrl,
          headers: this.accessToken ? {
            'Authorization': `Bearer ${this.accessToken}`
          } : {},
          key: 'user-info'
        })
        
        if (error.value) {
          throw error.value
        }
        
        this.user = data.value as MemberInfoResponse
      } catch (error) {
        console.error('Failed to fetch user info:', error)
        // 토큰이 만료된 경우 로그아웃
        if ((error as any).status === 401) {
          this.logout()
        }
      }
    },

    async reissueToken() {
      if (!this.refreshToken) return false
      
      try {
        const config = useRuntimeConfig()
        const { data: response } = await useFetch('/auth/reissue', {
          method: 'POST',
          baseURL: config.public.apiBaseUrl,
          body: { refreshToken: this.refreshToken }
        })
        
        this.accessToken = (response.value as any).accessToken
        this.refreshToken = (response.value as any).refreshToken
        
        if (process.client) {
          localStorage.setItem('auth_token', this.accessToken!)
          localStorage.setItem('refresh_token', this.refreshToken!)
        }
        
        return true
      } catch (error) {
        console.error('Token reissue failed:', error)
        this.logout()
        return false
      }
    },

    async logout() {
      try {
        const config = useRuntimeConfig()
        if (this.accessToken) {
          await useFetch('/auth/withdraw', {
            method: 'DELETE',
            baseURL: config.public.apiBaseUrl,
            headers: {
              'Authorization': `Bearer ${this.accessToken}`
            }
          })
        }
      } catch (error) {
        console.error('Logout failed:', error)
      } finally {
        this.user = null
        this.accessToken = null
        this.refreshToken = null
        this.isAuthenticated = false
        
        if (process.client) {
          localStorage.removeItem('auth_token')
          localStorage.removeItem('refresh_token')
        }
      }
    },

    async checkAuth() {
      if (process.client) {
        const accessToken = localStorage.getItem('auth_token')
        const refreshToken = localStorage.getItem('refresh_token')
        
        if (accessToken && refreshToken) {
          this.accessToken = accessToken
          this.refreshToken = refreshToken
          this.isAuthenticated = true
          
          // 사용자 정보 가져오기
          await this.fetchUserInfo()
        }
      }
    }
  }
})
