import {createSlice} from "@reduxjs/toolkit";
import {initialDraft, Investigator, InvestigatorSheetDraft} from "@/libs/investigator";

export type CharaState = {
    characters: Investigator[]
    draft: InvestigatorSheetDraft
}

const initialState: CharaState = {
    characters: [],
    draft: initialDraft
}

const charaSlice = createSlice({
    name: "chara",
    initialState,
    reducers: {
        addChara(state, {payload}: { payload: Investigator }) {
            state.characters = [...state.characters, payload]
        },
        removeChara(state, {payload}: { payload: string }) {
            state.characters = state.characters.filter(it => it.id !== payload)
        },
        updateChara(state, {payload}: { payload: Investigator }) {
            state.characters = state.characters.map(it => it.id === payload.id ? payload : it)
        },
        setDraft(state, {payload}: { payload: InvestigatorSheetDraft }) {
            state.draft = payload
        },
        clearDraft(state) {
            state.draft = initialDraft
        }
    }
})

export const {addChara, removeChara, updateChara, setDraft, clearDraft} = charaSlice.actions
export default charaSlice.reducer