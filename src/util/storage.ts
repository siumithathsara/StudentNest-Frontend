const ACCESS = "ACCESS_TOKEN"
const REFRESH = "REFRESH_TOKEN"

export const clearTokens = () => {
  for (const store of [localStorage, sessionStorage]) {
    store.removeItem(ACCESS)
    store.removeItem(REFRESH)
  }
}

// remember = true  -> localStorage 
// remember = false -> sessionStorage 
export const saveTokens = (accessToken: string, refreshToken: string, remember: boolean) => {
  clearTokens()
  const store = remember ? localStorage : sessionStorage
  store.setItem(ACCESS, accessToken)
  store.setItem(REFRESH, refreshToken)
}

const holder = (): Storage | null =>
  sessionStorage.getItem(REFRESH) ? sessionStorage : localStorage.getItem(REFRESH) ? localStorage : null

export const getAccessToken = () => holder()?.getItem(ACCESS) ?? null
export const getRefreshToken = () => holder()?.getItem(REFRESH) ?? null
export const setAccessToken = (token: string) => holder()?.setItem(ACCESS, token)