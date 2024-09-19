import {CCLevel} from "@/libs/bcdice-command";

export type Accent = {
    text: string,
    fg: string,
    bg: string
}

// TODO: move to ccLevels
export const colors: {
    [key: string]: Accent
} = {
    critical: {
        text: "text-yellow-500",
        fg: "bg-yellow-500",
        bg: "bg-yellow-900"
    },
    extreme: {
        text: "text-violet-500",
        fg: "bg-violet-500",
        bg: "bg-violet-900"
    },
    hard: {
        text: "text-sky-500",
        fg: "bg-sky-500",
        bg: "bg-sky-900"
    },
    regular: {
        text: "text-green-500",
        fg: "bg-green-500",
        bg: "bg-green-900"
    },
    failure: {
        text: "text-zinc-500",
        fg: "bg-zinc-500",
        bg: "bg-zinc-800"
    },
    fumble: {
        text: "text-red-500",
        fg: "bg-red-500",
        bg: "bg-red-900"
    },
    normal: {
        text: "text-zinc-500",
        fg: "bg-zinc-500",
        bg: "bg-zinc-800"
    }
}

export const getCCResultAccent = (result?: CCLevel) => colors[result?.toLowerCase() || "normal"]