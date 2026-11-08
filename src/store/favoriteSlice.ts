import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import * as favoriteService from "../service/favorite"

interface FavoriteState {
  ids: string[]
  loaded: boolean
}

const initialState: FavoriteState = { ids: [], loaded: false }

export const fetchFavoriteIds = createAsyncThunk("favorites/fetchIds", () => favoriteService.getFavoriteIds())

export const toggleFavorite = createAsyncThunk(
  "favorites/toggle",
  async ({ id, currentlyFavorite }: { id: string; currentlyFavorite: boolean }) => {
    if (currentlyFavorite) await favoriteService.removeFavorite(id)
    else await favoriteService.addFavorite(id)
  }
)

const favoriteSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    resetFavorites: () => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavoriteIds.fulfilled, (state, action) => {
        state.ids = action.payload
        state.loaded = true
      })
      .addCase(toggleFavorite.pending, (state, action) => {
        const { id, currentlyFavorite } = action.meta.arg
        state.ids = currentlyFavorite ? state.ids.filter((i) => i !== id) : [...state.ids, id]
      })
      .addCase(toggleFavorite.rejected, (state, action) => {
        const { id, currentlyFavorite } = action.meta.arg
        state.ids = currentlyFavorite ? [...state.ids.filter((i) => i !== id), id] : state.ids.filter((i) => i !== id)
      })
  }
})

export const { resetFavorites } = favoriteSlice.actions
export default favoriteSlice.reducer