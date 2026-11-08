import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./authSlice"
import compareReducer from "./compareSlice"
import favoriteReducer from "./favoriteSlice"
import notificationReducer from "./notificationSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    notifications: notificationReducer,
    favorites: favoriteReducer,
    compare: compareReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch