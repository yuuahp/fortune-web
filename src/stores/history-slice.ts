import {createSlice} from "@reduxjs/toolkit";
import {HistoryEntry} from "@/libs/history";
import {RootState} from "@/stores/store";
import {BCDiceResult} from "@/libs/bcdice-fetch";

export type HistoryState = {
    data: HistoryEntry[]
}

const initialState: HistoryState = {data: []}

const historySlice = createSlice({
    name: "history",
    initialState,
    reducers: {
        addHistory(state, {payload}: { payload: HistoryEntry }) {
            state.data = [...state.data.map((value) => {
                if (!value.activeFixed) {
                    return {...value, active: false}
                } else {
                    return {...value}
                }
            }), payload]
        },
        toggleActive(state, {payload}: { payload: string }) {
            state.data = state.data.map((value) => {
                if (value.id === payload) {
                    return {...value, active: !value.active, activeFixed: true}
                } else {
                    return {...value}
                }
            })
        },
        addFortune(state, {payload}: { payload: { id: string, fp: number } }) {
            state.data = state.data.map((value) => {
                if (value.id === payload.id) {
                    return {...value, fortune: payload.fp}
                } else {
                    return {...value}
                }
            })
        },
        addPush(state, {payload}: { payload: { id: string, push: BCDiceResult } }) {
            state.data = state.data.map((value) => {
                if (value.id === payload.id) {
                    return {...value, push: payload.push}
                } else {
                    return {...value}
                }
            })
        }
    }
})

export const {addHistory, toggleActive, addFortune, addPush} = historySlice.actions
export const selectHistory = (state: RootState) => state.history.data
export const getHistoryById = (state: RootState, id: string) =>
    state.history.data.find(entry => entry.id === id)
export default historySlice.reducer