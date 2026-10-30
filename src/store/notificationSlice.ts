import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import * as notificationService from "../service/notification"
import type { AppNotification } from "../types"

interface NotificationState {
  items: AppNotification[]
  unread: number
}

const initialState: NotificationState = { items: [], unread: 0 }

export const fetchUnreadCount = createAsyncThunk("notifications/unread", () => notificationService.getUnreadCount())

export const fetchNotifications = createAsyncThunk("notifications/list", () =>
  notificationService.getNotifications(1, 10)
)

export const markRead = createAsyncThunk("notifications/markRead", async (id: string) => {
  await notificationService.markRead(id)
  return id
})

export const markAllRead = createAsyncThunk("notifications/markAllRead", async () => {
  await notificationService.markAllRead()
})

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    resetNotifications: () => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unread = action.payload
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.items = action.payload.items
        state.unread = action.payload.unread
      })
      .addCase(markRead.fulfilled, (state, action) => {
        const n = state.items.find((i) => i._id === action.payload)
        if (n && !n.isRead) {
          n.isRead = true
          state.unread = Math.max(0, state.unread - 1)
        }
      })
      .addCase(markAllRead.fulfilled, (state) => {
        state.items.forEach((i) => {
          i.isRead = true
        })
        state.unread = 0
      })
  }
})

export const { resetNotifications } = notificationSlice.actions
export default notificationSlice.reducer