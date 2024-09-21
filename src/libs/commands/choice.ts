import {BCDiceResult} from "@/libs/bcdice-fetch";
import {getFormattedCommand} from "@/libs/commands/cc";
import {lastOf} from "@/libs/utils";
import {getTextsOf} from "@/libs/bcdice";

export type Choice = {
    candidates: string[],
    chosen: string[],
    indexes: number[]
}

/**
 * Command Formats:
 * - choice{number?}[candidate1,candidate2,...] (or ())
 *   result: candidateN, candidateM, ...
 * - choice{number?} candidate1 candidate2 ...
 *   result: candidateN candidateM ...
 * All candidate strings are trimmed by API
 */
export function getChoice(command: string, result: BCDiceResult): Choice | undefined {
    const formattedCommand = getFormattedCommand(result.text).command

    if (!formattedCommand.startsWith("choice")) return undefined

    const regexSquareBracket = /^choice(\d+)?\[(?<candidates>[^\[\]]+)]$/gi
    const regexParentheses = /^choice(\d+)?\((?<candidates>[^()]+)\)$/gi
    const regexSpace = /^choice(\d+)?\s(?<candidates>.+)$/gi

    const bracedCandidates = (regexSquareBracket.exec(formattedCommand) || regexParentheses.exec(formattedCommand))?.groups?.candidates?.split(",")
    const spaceCandidates = regexSpace.exec(formattedCommand)?.groups?.candidates?.split(" ")
    const candidates = bracedCandidates || spaceCandidates

    if (!candidates) return undefined

    const chosen: string[] = []
    const chosenString = lastOf(getTextsOf(result)) as string

    if (bracedCandidates)
        chosen.push(...chosenString.split(","))
    else if (spaceCandidates)
        chosen.push(...chosenString.split(" "))

    const rands = result.rands

    const indexes = rands.map((rand, index) => rand.value - 1 + rands.filter((r, i) => i < index && r.value <= rand.value).length)

    return {candidates, chosen, indexes}
}