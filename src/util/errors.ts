import { isAxiosError } from "axios"

export const getErrorMessage = (err: unknown): string => {
  if (isAxiosError(err)) {
    const data = err.response?.data
    if (data?.errors?.length) {
      return data.errors.map((e: { message: string }) => e.message).join(", ")
    }
    if (data?.message) return data.message
    if (!err.response) return "Cannot reach the server. Is the backend running?"
  }
  return "Something went wrong"
}