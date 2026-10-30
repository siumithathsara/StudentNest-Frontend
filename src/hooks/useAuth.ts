import { useCallback } from "react"
import { clearError as clearErrorAction, login as loginThunk, logout as logoutAction } from "../store/authSlice"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { clearTokens } from "../util/storage"
import { resetNotifications } from "../store/notificationSlice"

export const useAuth = () => {
  const dispatch = useAppDispatch()
  const { user, initialized, submitting, error } = useAppSelector((s) => s.auth)

  const login = useCallback(
    (email: string, password: string) => dispatch(loginThunk({ email, password })),
    [dispatch]
  )

  const logout = useCallback(() => {
    clearTokens()
    dispatch(resetNotifications())
    dispatch(logoutAction())
  }, [dispatch])

  const clearError = useCallback(() => {
    dispatch(clearErrorAction())
  }, [dispatch])

  return {
    user,
    loading: !initialized,
    submitting, 
    error,
    login,
    logout,
    clearError
  }
}