import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export const COMPARE_MAX = 3

interface CompareState {
  ids: string[]
}

const initialState: CompareState = { ids: [] }

const compareSlice = createSlice({
  name: "compare",
  initialState,
  reducers: {
    toggleCompare(state, action: PayloadAction<string>) {
      const id = action.payload
      if (state.ids.includes(id)) state.ids = state.ids.filter((i) => i !== id)
      else if (state.ids.length < COMPARE_MAX) state.ids.push(id)
    },
    removeCompare(state, action: PayloadAction<string>) {
      state.ids = state.ids.filter((i) => i !== action.payload)
    },
    clearCompare: () => initialState
  }
})

export const { toggleCompare, removeCompare, clearCompare } = compareSlice.actions
export default compareSlice.reducer