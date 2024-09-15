import {BCDiceResult} from "@/libs/bcdice-fetch";

export type HistoryEntry = {
    id: string
    active: boolean
    activeFixed: boolean
    command: string
    result: BCDiceResult
}