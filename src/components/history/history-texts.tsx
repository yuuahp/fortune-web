import {ReactElement} from "react";
import {ccLevels, getFormattedCommand} from "@/libs/commands/cc";
import {getTexts} from "@/libs/bcdice";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretRight, faDice} from "@awesome.me/kit-ae9e2bd1c8/icons/classic/solid";
import {Tooltip} from "@mui/material";

export function TextsDisplay({command, resultText, toRichText, append, active, className}: {
    command?: string,
    resultText: string,
    toRichText: (text: string, index: number) => ReactElement | undefined,
    append?: ReactElement[],
    active: boolean,
    className?: string
}) {
    const {display: displayedCommand, command: formattedCommand} = getFormattedCommand(resultText)

    let _temp: string | undefined = undefined

    const processedTexts = getTexts(resultText)
        .map((it, i) => i === 0 ? it.replace(displayedCommand, "").trim() : it) // remove formatted command
        .map(it => {
            if (it === _temp) return undefined
            _temp = it
            return it
        }) // remove duplicates
        .filter(it => it !== "" && it !== undefined)

    const texts = [command, ...processedTexts]
    const elements = texts.map((text, index) => {
        if (text === undefined) return undefined

        const element = toRichText(text, index)
        if (element === undefined) return undefined

        if (index === 0)
            return (
                <p key={index} className="text-nowrap max-w-full truncate leading-none">
                    {
                        !active &&
                        <FontAwesomeIcon className={`mr-2`} icon={faCaretRight}/>
                    }
                    <Tooltip title={formattedCommand}>
                        {element}
                    </Tooltip>
                </p>
            )
        else return (
            <p key={index} className="text-nowrap max-w-full leading-none flex items-center h-6">
                <FontAwesomeIcon className="mr-2 text-zinc-700" icon={faCaretRight}/>
                {element}
            </p>
        )
    }).filter(it => it !== undefined)

    return (
        <div className={`flex flex-wrap gap-x-2 gap-y-1 w-full items-center ${className}`}>
            {elements}
            {
                append && append.map((it, index) => (
                    <p key={elements.length + index} className="text-nowrap max-w-full leading-none flex items-center h-6">
                        <FontAwesomeIcon className="mr-2 text-zinc-700" icon={faCaretRight}/>
                        {it}
                    </p>
                ))
            }
        </div>
    )
}

export function CCRichText({text}: { text: string }) {
    const level = ccLevels.find(it => it.jp === text)

    if (level) {
        return <span className={`text-wrap max-w-full font-bold text-${level.accent}-500`}>{text}</span>
    }

    const bpdicesRegex = /^ボーナス・ペナルティダイス\[(?<dices>-?\d+)]$/gi
    const match = bpdicesRegex.exec(text)

    if (match) {
        const dices = parseInt(match.groups!!.dices!!)

        if (dices === 0) return undefined

        return <span className={`text-wrap max-w-full font-bold text-${dices > 0 ? 'green' : 'red'}-700`}>
                                            <FontAwesomeIcon icon={faDice} className="mr-2"/>
                                            x{Math.abs(dices)}
                                        </span>
    }

    return <span className="text-wrap max-w-full">{text}</span>
}