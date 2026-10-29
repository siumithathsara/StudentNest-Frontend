import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { getMyDetails, login as loginRequest } from "../service/auth"
import type { User } from "../types"
import { getErrorMessage } from "../util/errors"
import { clearTokens, saveTokens } from "../util/storage"

interface AuthState {
  user: User | null
  initialized: boolean 
  submitting: boolean 
  error: string | null
}

const initialState: AuthState = {
  user: null,
  initialized: false,
  submitting: false,
  error: null
}

export const login = createAsyncThunk<User, { email: string; password: string }, { rejectValue: string }>(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await loginRequest(email, password)
      saveTokens(res.data.accessToken, res.data.refreshToken)
      return res.data.user as User
    } catch (err) {
      return rejectWithValue(getErrorMessage(err))
    }
  }
)

export const restoreSession = createAsyncThunk("auth/restore", async (): Promise<User | null> => {
  if (!localStorage.getItem("ACCESS_TOKEN")) return null
  try {
    const res = await getMyDetails()
    return res.data as User
  } catch {
    clearTokens()
    return null
  }
})

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null
    },
    clearError(state) {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.submitting = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.submitting = false
        state.user = action.payload
      })
      .addCase(login.rejected, (state, action) => {
        state.submitting = false
        state.error = action.payload ?? "Login failed"
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.user = action.payload
        state.initialized = true
      })
      .addCase(restoreSession.rejected, (state) => {
        state.initialized = true
      })
  }
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer