import {HistoryEntry} from "@/libs/history";
import {getTexts} from "@/libs/bcdice";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretRight, faDice} from "@awesome.me/kit-ae9e2bd1c8/icons/classic/solid";
import {HistoryInsight} from "@/components/history-insight";
import {Tooltip} from "@mui/material";
import {getD} from "@/libs/commands/sum-dices";
import {applyFP, ccLevels, getCC, getFormattedCommand, getLevelDetail, getRatedCC} from "@/libs/commands/cc";
import {getChoice} from "@/libs/commands/choice";
import {getRepeat} from "@/libs/commands/repeat";
import {ReactElement} from "react";

function TextsDisplay({command, resultText, toRichText, accent, active, className}: {
    command?: string,
    resultText: string,
    toRichText: (text: string, index: number) => ReactElement | undefined,
    accent: string,
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

    const elements = [command, ...processedTexts]

    return (
        <div className={`flex flex-wrap gap-x-2 w-full ${className}`}>
            {
                elements.map((text, index) => {
                    if (text === undefined) return undefined

                    const element = toRichText(text, index)
                    if (element === undefined) return undefined

                    if (index === 0)
                        return (
                            <p key={index} className="text-nowrap max-w-full truncate">
                                {
                                    !active &&
                                    <FontAwesomeIcon className={`mr-2 text-${accent}-500`} icon={faCaretRight}/>
                                }
                                <Tooltip title={formattedCommand}>
                                    {element}
                                </Tooltip>
                            </p>
                        )
                    else return (
                        <p key={index} className="text-nowrap max-w-full">
                            <FontAwesomeIcon className="mr-2 text-zinc-700" icon={faCaretRight}/>
                            {element}
                        </p>
                    )
                })
            }
        </div>
    )
}


export function History({entry, toggleActive}: {
    entry: HistoryEntry,
    toggleActive: () => void
}) {
    const {command, result, active} = entry

    const cc = getCC(command, result)
    const ratedCC = cc ? getRatedCC(cc) : undefined
    const fpApplied = (ratedCC && entry.fortune) ? applyFP(ratedCC, entry.fortune) : undefined
    const effectiveCC = fpApplied || ratedCC || cc

    const accent = effectiveCC?.level ? getLevelDetail(effectiveCC.level).accent : "zinc";

    const d = getD(command, result)
    const choice = getChoice(command, result)
    const repeat = getRepeat(command, result)

    return (
        <div className={`
            group p-2 hover:bg-zinc-900 border border-transparent 
            rounded-2xl duration-200 flex flex-col gap-y-2 
            transition-colors ${active && '!border-zinc-800 bg-zinc-900'}
        `}>
            <div onClick={toggleActive} className={`flex w-full ${active && 'pl-1'}`}>
                {
                    active &&
                    <div className="mr-2 h-full py-1">
                        <div className={`h-full w-2 rounded-full bg-${accent}-500`}></div>
                    </div>
                }
                {
                    repeat
                        ?
                        <div className="flex gap-x-2">
                            <div>
                                <p className="text-nowrap max-w-full truncate">
                                    {
                                        !active &&
                                        <FontAwesomeIcon className={`mr-2 text-${accent}-500`} icon={faCaretRight}/>
                                    }
                                    <span
                                        className={`text-zinc-700 group-hover:text-zinc-600 max-w-full truncate ${active && '!text-zinc-600'}`}>
                                        {command}
                                    </span>
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-y-2 gap-x-4">
                                {
                                    repeat.lines.map((it, index) => {
                                        return <div className="flex gap-x-2" key={index}>
                                            <p className="bg-zinc-700 px-2 rounded font-bold h-fit">
                                                <span className="text-sm mr-[.1rem]">#</span>{index + 1}
                                            </p>
                                            <TextsDisplay resultText={it} accent={accent} active={active}
                                                          toRichText={(text, index) => {
                                                              if (index === 0) return <span
                                                                  className={`text-zinc-700 group-hover:text-zinc-600 max-w-full truncate ${active && '!text-zinc-600'}`}>{text}</span>
                                                              return <span
                                                                  className="text-wrap max-w-full">{text}</span>
                                                          }}/>
                                        </div>
                                    })
                                }
                            </div>
                        </div>
                        : <TextsDisplay
                            command={command} resultText={result.text} accent={accent} active={active}
                            toRichText={(text, index) => {
                                if (index === 0)
                                    return <span
                                        className={`text-zinc-700 group-hover:text-zinc-600 max-w-full truncate ${active && '!text-zinc-600'}`}>
                                        {text}
                                    </span>
                                else if (cc) {
                                    const level = ccLevels.find(it => it.jp === text)

                                    if (level) {
                                        return <span className={`font-bold text-${level.accent}-500`}>{text}</span>
                                    }

                                    const bpdicesRegex = /^ボーナス・ペナルティダイス\[(?<dices>-?\d+)]$/gi
                                    const match = bpdicesRegex.exec(text)

                                    if (match) {
                                        const dices = parseInt(match.groups!!.dices!!)

                                        if (dices === 0) return undefined

                                        return <span className={`font-bold text-${dices > 0 ? 'green' : 'red'}-500`}>
                                            <FontAwesomeIcon icon={faDice} className="mr-2"/>
                                            x{Math.abs(dices)}
                                        </span>
                                    }

                                    return <span className="text-wrap max-w-full">{text}</span>
                                } else {
                                    return <span className="text-wrap max-w-full">{text}</span>
                                }
                            }}/>
                }
            </div>
            {
                ((effectiveCC || d || choice) && active) &&
                <div>
                    <div className="w-full h-[1px] mb-2">
                        <div className={`h-full w-full bg-zinc-800`}></div>
                    </div>
                    <HistoryInsight entry={entry} closeHandler={toggleActive}
                                    cc={cc} d={d} choice={choice}/>
                </div>
            }
        </div>
    )
}