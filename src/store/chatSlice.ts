import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { sendChat } from "../service/chat"
import type { ChatMessage, ChatReply } from "../types"
import { getErrorMessage } from "../util/errors"

interface ChatState {
    messages: ChatMessage[]
    loading: boolean
}

const initialState: ChatState = { messages: [], loading: false }

const newId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

type SendArg = { text: string; history: { role: "user" | "bot"; text: string }[]; campusId?: string }

export const sendMessage = createAsyncThunk<ChatReply, SendArg, { rejectValue: string }>(
    "chat/send",
    async ({ text, history, campusId }, { rejectWithValue }) => {
        try {
            return await sendChat(text, history, campusId)
        } catch (err) {
            return rejectWithValue(getErrorMessage(err))
        }
    }
)

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        resetChat: () => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(sendMessage.pending, (state, action) => {
                state.loading = true
                state.messages.push({ id: newId(), role: "user", text: action.meta.arg.text })
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.loading = false
                state.messages.push({
                    id: newId(),
                    role: "bot",
                    text: action.payload.reply,
                    boardings: action.payload.boardings,
                    campus: action.payload.campus,
                    suggestions: action.payload.suggestions
                })
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.loading = false
                state.messages.push({
                    id: newId(),
                    role: "bot",
                    text: action.payload ?? "Something went wrong. Please try again.",
                    isError: true
                })
            })
    }
})

export const { resetChat } = chatSlice.actions
export default chatSlice.reducer