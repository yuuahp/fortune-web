import {configureStore} from "@reduxjs/toolkit";
import historySlice from "@/stores/history-slice";
import bcdiceSlice from "@/stores/bcdice-slice";

export const store = configureStore({
    reducer: {
        history: historySlice,
        bcdice: bcdiceSlice
    }
})

export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store