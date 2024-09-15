import {BCDiceResult} from "@/libs/bcdice-fetch";
import Mexp from "math-expression-evaluator";
import {lastOf} from "@/libs/utils";

export type DiceRange = {
    min: number;
    max: number;
}

export const getTexts = (result: BCDiceResult): [string] => {
    const texts = result.text.split(" ＞ ")
    if (texts.length <= 0) {
        throw new Error("BCDiceResult has no texts")
    }

    return texts as [string]
}
export const getFormattedCommand = (result: BCDiceResult): string => {
    // examples:
    // CC<=50 -> (1D100<=50) ボーナス・ペナルティダイス[0]
    // CC -> 1D100
    // 2d3+5d6 -> (2D3+5D6)

    const commandText = getTexts(result)[0];
    const parenthesized = /^\(([^)]+)\)/g.test(commandText)
    return parenthesized ? commandText.split(/[()]/gi)[1] : commandText
}

const isCC = (command: string): boolean => command.toLowerCase().startsWith("cc");

export type CCResult = "CRITICAL" | "EXTREME" | "HARD" | "REGULAR" | "FAILURE" | "FUMBLE"

function messageToCCResult(message: string): CCResult | undefined {
    switch (message) {
        case "クリティカル":
            return "CRITICAL"
        case "イクストリーム成功":
            return "EXTREME"
        case "ハード成功":
            return "HARD"
        case "レギュラー成功":
            return "REGULAR"
        case "失敗":
            return "FAILURE"
        case "ファンブル":
            return "FUMBLE"
    }
}

export type CC = {
    rate?: number,
    value: number,
    range: DiceRange,
    result?: CCResult
}

export function getCC(command: string, result: BCDiceResult): CC | undefined {
    if (!isCC(command)) return undefined

    const texts = getTexts(result)

    const borderExists = command.split("<=").length === 2 // other than <= fails for CC

    if (borderExists) { // (1D100<=23) ボーナス・ペナルティダイス[1] ＞ 98, 58 ＞ 58 ＞ 失敗
        return {
            rate: parseInt(command.split("<=")[1]),
            value: parseInt(texts[texts.length - 2]),
            range: {min: 1, max: 100},
            result: messageToCCResult(texts[texts.length - 1]),
        }
    } else { // 1D100 ＞ 15
        return {
            value: parseInt(texts[texts.length - 1]),
            range: {min: 1, max: 100},
        }
    }
}

const mexp = new Mexp

export type DResult = "SUCCESS" | "FAILURE"

type DCompareMethod = "GreaterEqual" | "GreaterThan" | "LessEqual" | "LessThan" | "Equal" | "NotEqual"

export type D = {
    border?: number,
    compareMethod?: DCompareMethod,
    value: number,
    range: DiceRange,
    result?: DResult
}

export function getD(command: string, result: BCDiceResult): D | undefined {
    if (isCC(command)) return undefined

    // [Regex to detect dice commands, Regex to split dice commands, Function to calculate max and min]
    type RegexTuple = [RegExp, RegExp, (numbers: [number, number, number]) => [number, number]]

    const dkhRegex: RegexTuple = [/\d+d\d+kh\d+/gi, /d|kh/gi, ([dices, sides, keep]) => {
        const max = (dices >= keep ? keep : dices) * sides
        const min = (dices >= keep ? keep : dices)
        return [max, min]
    }];
    const dklRegex: RegexTuple = [/\d+d\d+kl\d+/gi, /d|kl/gi, ([dices, sides, keep]) => {
        const max = (dices >= keep ? keep : dices) * sides
        const min = (dices >= keep ? keep : dices)
        return [max, min]
    }];
    const ddhRegex: RegexTuple = [/\d+d\d+dh\d+/gi, /d|dh/gi, ([dices, sides, drop]) => {
        const max = (dices >= drop ? dices - drop : 0) * sides
        const min = (dices >= drop ? dices - drop : 0)
        return [max, min]
    }];
    const ddlRegex: RegexTuple = [/\d+d\d+dl\d+/gi, /d|dl/gi, ([dices, sides, drop]) => {
        const max = (dices >= drop ? dices - drop : 0) * sides
        const min = (dices >= drop ? dices - drop : 0)
        return [max, min]
    }];
    const dMaxRegex: RegexTuple = [/\d+d\d+max/gi, /d|max/gi, ([dices, sides]) => {
        const max = dices * sides
        const min = dices
        return [max, min]
    }];
    const dMinRegex: RegexTuple = [/\d+d\d+min/gi, /d|min/gi, ([dices, sides]) => {
        const max = dices * sides
        const min = dices
        return [max, min]
    }];
    const dRegex: RegexTuple = [/\d+d\d+/gi, /d/gi, ([dices, sides]) => {
        return [dices * sides, dices]
    }];

    const allRegex: RegexTuple[]
        = [dkhRegex, dklRegex, ddhRegex, ddlRegex, dMaxRegex, dMinRegex, dRegex];

    const compareRegex = />=|>|<|<=|==|=|!=|<>/gi

    const formattedCommand = getFormattedCommand(result)
    const commandElements = formattedCommand.split(compareRegex).filter((it) => it !== "")
    const diceCommand = commandElements[0]
    const borderExists = commandElements.length === 2
    const border = borderExists ? parseInt(commandElements[1]) : undefined

    const borderCompare = borderExists
        ? formattedCommand.replaceAll(diceCommand, "").replaceAll(border!!.toString(), "")
        : undefined

    let compareMethod: DCompareMethod | undefined = undefined

    switch (borderCompare) {
        case ">=":
            compareMethod = "GreaterEqual"
            break
        case ">":
            compareMethod = "GreaterThan"
            break
        case "<=":
            compareMethod = "LessEqual"
            break
        case "<":
            compareMethod = "LessThan"
            break
        case "==":
        case "=":
            compareMethod = "Equal"
            break
        case "!=":
        case "<>":
            compareMethod = "NotEqual"
            break
    }

    if (!allRegex.some(([regex]) => regex.test(diceCommand))) return undefined;

    let maxCommand = diceCommand;
    let minCommand = diceCommand;

    allRegex.forEach(([regex, splitRegex, calculate]) => {
        (maxCommand.match(regex) || []).forEach((match) => {
            const [dices, sides, keep] = match.split(splitRegex).filter((it) => it !== "").map((it) => parseInt(it))
            const [max, min] = calculate([dices, sides, keep])
            maxCommand = maxCommand.replace(match, max.toString())
            minCommand = minCommand.replace(match, min.toString())
        })
    });

    const lexedMax = mexp.lex(maxCommand)
    const lexedMin = mexp.lex(minCommand)

    const postfixedMax = mexp.toPostfix(lexedMax)
    const postfixedMin = mexp.toPostfix(lexedMin)

    const max = mexp.postfixEval(postfixedMax)
    const min = mexp.postfixEval(postfixedMin)

    const texts = getTexts(result)
    const value = parseInt((borderExists ? texts[texts.length - 2] : lastOf(texts)) as string)

    let dResult: DResult | undefined = undefined

    if (borderExists)
        dResult = result.success ? "SUCCESS" : "FAILURE"

    return {
        border: border,
        compareMethod: compareMethod,
        range: {max, min},
        value: value,
        result: dResult
    }
}