import {BCDiceResult} from "@/libs/bcdice-fetch";

export type DiceRange = {
    min: number;
    max: number;
}

export const getTextsOf = (result: BCDiceResult): [string] => getTexts(result.text)

export const getTexts = (resultText: string): [string] => {
    const texts = resultText.split(" ＞ ")
    return texts as [string]
}