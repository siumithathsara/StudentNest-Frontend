export const saveTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem("ACCESS_TOKEN", accessToken)
  localStorage.setItem("REFRESH_TOKEN", refreshToken)
}

export const clearTokens = () => {
  localStorage.removeItem("ACCESS_TOKEN")
  localStorage.removeItem("REFRESH_TOKEN")
}