import {DiceRange, getTexts} from "@/libs/bcdice";
import {lastOf} from "@/libs/utils";

export const getFormattedCommand = (resultText: string): { command: string, display: string } => {
    // examples:
    // CC<=50 -> (1D100<=50) ボーナス・ペナルティダイス[0]
    // CC -> 1D100
    // 2d3+5d6 -> (2D3+5D6)

    const commandText = getTexts(resultText)[0]
    const isParenthesized = /^\(([^)]+)\)/g.test(commandText)
    const parenthesized = commandText.split(/[()]/gi)[1]

    return isParenthesized ? {
        command: parenthesized,
        display: `(${parenthesized})`
    } : {
        command: commandText,
        display: commandText
    }
}

export function isCC(command: string, resultText: string): boolean {
    const inputRegex = /^cc((\d*|-\d+)<=.+)?/gi
    const formattedRegex = /^1d100(<=\d+)?$/gi

    const inputMatch = inputRegex.test(command)
    const formattedMatch = formattedRegex.test(getFormattedCommand(resultText).command)

    return inputMatch && formattedMatch
}

export type CCLevel = "CRITICAL" | "EXTREME" | "HARD" | "REGULAR" | "FAILURE" | "FUMBLE" | "SUCCESS"

export type CCLevelDetail = {
    level: CCLevel,
    jp: string,
    accent: string,
}

export const ccLevels: CCLevelDetail[] = [
    {level: "CRITICAL", jp: "クリティカル", accent: "yellow"},
    {level: "EXTREME", jp: "イクストリーム成功", accent: "violet"},
    {level: "HARD", jp: "ハード成功", accent: "sky"},
    {level: "REGULAR", jp: "レギュラー成功", accent: "green"},
    {level: "FAILURE", jp: "失敗", accent: "zinc"},
    {level: "FUMBLE", jp: "ファンブル", accent: "red"},
    {level: "SUCCESS", jp: "成功", accent: "green"}
]

export const getLevelDetail = (level: CCLevel) =>
    ccLevels.find(it => it.level === level)!!

export type CC = {
    rate?: number,
    value: number,
    range: DiceRange,
    level?: CCLevel
}

export type RatedCC = {
    rate: number,
    value: number,
    range: DiceRange,
    level: CCLevel
}

export function checkLevel(rate: number, value: number): CCLevel {
    if (value === 1) return "CRITICAL"
    if (value <= rate / 5) return "EXTREME"
    if (value <= rate / 2) return "HARD"
    if (value <= rate) return "REGULAR"
    if (value === 100 || (rate < 50 && value >= 96)) return "FUMBLE"
    return "FAILURE"
}

export function getRatedCC(cc: CC): RatedCC | undefined {
    if (cc.rate === undefined || cc.level === undefined) return undefined

    return {
        rate: cc.rate,
        value: cc.value,
        range: cc.range,
        level: cc.level
    }
}

export function getRatedCCOf(command: string, resultText: string): RatedCC | undefined {
    const cc = getCC(command, resultText)

    if (!cc) return undefined

    return getRatedCC(cc)
}

export function applyFP(ratedCC: RatedCC, points: number): RatedCC {
    const appliedValue = ratedCC.value - points

    return {
        rate: ratedCC.rate,
        value: appliedValue,
        range: ratedCC.range,
        level: checkLevel(ratedCC.rate, appliedValue)
    }
}

export function getCC(command: string, resultText: string): CC | undefined {
    if (!isCC(command, resultText)) return undefined

    // const commandRegex = /^cc(?<bpdices>\d*|-\d+)<=(?<rate>\d+|\([\d+\-*/FUR]+\))(?<level>[rehc]?)$/gi

    const texts = getTexts(resultText)
    const formattedCommand = getFormattedCommand(resultText).command

    const borderExists = formattedCommand.split("<=").length === 2 // other than <= fails for CC

    if (borderExists) { // (1D100<=23) ボーナス・ペナルティダイス[1] ＞ 98, 58 ＞ 58 ＞ 失敗
        return {
            rate: parseInt(formattedCommand.split("<=")[1]),
            value: parseInt(lastOf(texts, 1)!!),
            range: {min: 1, max: 100},
            level: ccLevels.find(it => it.jp === texts[texts.length - 1])!!.level,
        }
    } else { // 1D100 ＞ 15
        return {
            value: parseInt(lastOf(texts)!!),
            range: {min: 1, max: 100},
        }
    }
}

export function getCCHardRate(cc: RatedCC): number {
    return Math.floor(cc.rate / 2)
}

export function getCCExtremeRate(cc: RatedCC): number {
    return Math.floor(cc.rate / 5)
}