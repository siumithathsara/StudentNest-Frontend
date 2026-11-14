import type { ChatReply } from "../types"
import api from "./api"

export const sendChat = async (
  message: string,
  history: { role: "user" | "bot"; text: string }[],
  campusId?: string
) => {
  const res = await api.post("/chat", { message, history, campusId })
  return res.data.data as ChatReply
}