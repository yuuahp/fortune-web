import Mexp from "math-expression-evaluator";
import {BCDiceResult} from "@/libs/bcdice-fetch";
import {lastOf} from "@/libs/utils";
import {DiceRange, getTextsOf} from "@/libs/bcdice";
import {getFormattedCommand, isCC} from "@/libs/commands/cc";

const mexp = new Mexp
export type DLevel = "SUCCESS" | "FAILURE"
export type CompareMethod = "GreaterEqual" | "GreaterThan" | "LessEqual" | "LessThan" | "Equal" | "NotEqual"
export type D = {
    border?: number,
    compareMethod?: CompareMethod,
    value: number,
    range: DiceRange,
    level?: DLevel
}

export function getD(command: string, result: BCDiceResult): D | undefined {
    if (isCC(command, result)) return undefined

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
        return [max, dices]
    }];
    const dMinRegex: RegexTuple = [/\d+d\d+min/gi, /d|min/gi, ([dices, sides]) => {
        const max = dices * sides
        return [max, dices]
    }];
    const dRegex: RegexTuple = [/\d+d\d+/gi, /d/gi, ([dices, sides]) => {
        return [dices * sides, dices]
    }];

    const allRegex: RegexTuple[]
        = [dkhRegex, dklRegex, ddhRegex, ddlRegex, dMaxRegex, dMinRegex, dRegex];

    const compareRegex = />=|>|<|<=|==|=|!=|<>/gi

    const formattedCommand = getFormattedCommand(result.text).command
    const commandElements = formattedCommand.split(compareRegex).filter((it) => it !== "")
    const diceCommand = commandElements[0]
    const borderExists = commandElements.length === 2
    const border = borderExists ? parseInt(commandElements[1]) : undefined

    const borderCompare = borderExists
        ? formattedCommand.replaceAll(diceCommand, "").replaceAll(border!!.toString(), "")
        : undefined

    let compareMethod: CompareMethod | undefined = undefined

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

    if (!allRegex.some(([regex]) => regex.test(command))) return undefined;

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

    try {
        const lexedMax = mexp.lex(maxCommand)
        const lexedMin = mexp.lex(minCommand)

        const postfixedMax = mexp.toPostfix(lexedMax)
        const postfixedMin = mexp.toPostfix(lexedMin)

        const max = mexp.postfixEval(postfixedMax)
        const min = mexp.postfixEval(postfixedMin)

        const texts = getTextsOf(result)
        const value = parseInt((borderExists ? texts[texts.length - 2] : lastOf(texts)) as string)

        let dResult: DLevel | undefined = undefined

        if (borderExists)
            dResult = result.success ? "SUCCESS" : "FAILURE"

        return {
            border: border,
            compareMethod: compareMethod,
            range: {max, min},
            value: value,
            level: dResult
        }
    } catch (e) {
        console.error(e)
        return undefined
    }
}