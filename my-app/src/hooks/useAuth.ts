import { useMutation, useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import api, { authApi } from '@/lib/axios'
import { useAuthStore } from '@/store/authStore'
import type { UserProfile } from '@/types/auth'

export function useLogin() {
  const { setAuth } = useAuthStore()
  const router = useRouter()

  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const { data } = await authApi.post('/login', credentials)
      return data
    },
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken)
      if (data.user.mustChangePassword) {
        router.push('/auth/update-password')
      } else {
        router.push('/queue')
      }
    },
    onError: (error) => {
    console.log("LOGIN ERROR:", error) 
      }
  })
}

export function useMe() {
  const { accessToken } = useAuthStore()
  return useQuery<UserProfile>({
    queryKey: ['me'],
    queryFn: async () => {
      const { data } = await api.get('/auth/me')
      return data
    },
    enabled: !!accessToken,
    retry: false,
  })
}

export function useLogout() {
  const { clearAuth } = useAuthStore()
  const router = useRouter()

  return useMutation({
    mutationFn: async () => {
      await authApi.post('/logout')
    },
    onSettled: () => {
      clearAuth()
      router.push('/login')
    },
  })
}

export function useUpdatePassword() {
  const { setAuth } = useAuthStore()
  const router = useRouter()

  return useMutation({
    mutationFn: async (payload: {
      currentPassword: string
      newPassword: string
      newPasswordConfirm: string
    }) => {
      const { data } = await authApi.patch('/update-password', payload)
      return data
    },
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken)
      router.push('/queue')
    },
  })
}