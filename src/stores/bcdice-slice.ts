import {createSlice} from "@reduxjs/toolkit";

export type BCDiceState = {
    base: string,
    game: string
}

const initialState: BCDiceState = {
    base: "https://bcdice.onlinesession.app",
    game: "Cthulhu7th"
}

const bcdiceSlice = createSlice({
    name: "bcdice",
    initialState,
    reducers: {
        setBase(state, {payload}: { payload: string }) {
            state.base = payload
        },
        setGame(state, {payload}: { payload: string }) {
            state.game = payload
        }
    }
})

export const {setBase, setGame} = bcdiceSlice.actions
export default bcdiceSlice.reducer