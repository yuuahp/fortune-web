import {BCDiceResult} from "@/libs/bcdice-fetch";

export type Repeat = {
    times: number,
    command: string,
    lines: string[]
}

export function getRepeat(command: string, result: BCDiceResult): Repeat | undefined {
    const regex = /(x|rep|repeat)(\d+)\u0020.+/gi
    const match = regex.exec(command)

    if (!match) return undefined

    const lines = result.text.split("\n").filter(it => it !== "" && !(/#\d+/.test(it)))
    const singleCommand = command.split(" ", 2)[1]
    const times = parseInt(match[2])

    return {times, command: singleCommand, lines}
}