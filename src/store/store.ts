import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./authSlice"
import compareReducer from "./compareSlice"
import favoriteReducer from "./favoriteSlice"
import notificationReducer from "./notificationSlice"
import chatReducer from "./chatSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    notifications: notificationReducer,
    favorites: favoriteReducer,
    compare: compareReducer,
    chat: chatReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch