import {HistoryEntry} from "@/libs/history";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretRight, faClover} from "@awesome.me/kit-ae9e2bd1c8/icons/classic/solid";
import {HistoryInsight} from "@/components/history-insight";
import {getD} from "@/libs/commands/sum-dices";
import {applyFP, getCC, getLevelDetail, getRatedCC} from "@/libs/commands/cc";
import {getChoice} from "@/libs/commands/choice";
import {getRepeat} from "@/libs/commands/repeat";
import {CCRichText, TextsDisplay} from "@/components/history-texts";
import {FpLabel} from "@/components/fp-label";

export function History({entry, toggleActive, lessRoundedTop, lessRoundedBottom}: {
    entry: HistoryEntry,
    toggleActive: () => void,
    lessRoundedTop: boolean,
    lessRoundedBottom: boolean
}) {
    const {command, result, active} = entry

    const cc = getCC(command, result.text)
    const ratedCC = cc ? getRatedCC(cc) : undefined
    const fpApplied = (ratedCC && entry.fortune) ? applyFP(ratedCC, entry.fortune) : undefined
    const effectiveCC = fpApplied || ratedCC || cc

    const accent = effectiveCC?.level ? getLevelDetail(effectiveCC.level).accent : "zinc";

    const d = getD(command, result)
    const choice = getChoice(command, result)
    const repeat = getRepeat(command, result)

    return (
        <div className={`
            group hover:bg-zinc-900 border border-transparent 
            ${lessRoundedTop && active ? 'rounded-t-lg' : 'rounded-t-2xl'} ${lessRoundedBottom && active ? 'rounded-b-lg' : 'rounded-b-2xl'} 
            ${!active && 'select-none cursor-pointer'}
            duration-200 flex flex-col
            transition-all ${active && '!border-zinc-800 bg-zinc-900'}
            relative
        `}>
            <div onClick={toggleActive} className={`p-2 flex w-full`}>
                {
                    active &&
                    <div className="mr-2 h-full">
                        <div className={`h-full w-2 rounded-full bg-${accent}-500`}/>
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
                                        const repeatedCC = getCC(repeat.command, it)

                                        return <div className="flex gap-x-2" key={index}>
                                            <p className="bg-zinc-700 px-2 rounded font-bold h-fit">
                                                <span className="text-sm mr-[.1rem]">#</span>{index + 1}
                                            </p>
                                            <TextsDisplay
                                                resultText={it} active={active}
                                                toRichText={(text, index) => {
                                                    if (index === 0) return <span
                                                        className={`text-zinc-700 group-hover:text-zinc-600 max-w-full truncate ${active && '!text-zinc-600'}`}>
                                                        {text}
                                                    </span>
                                                    else if (repeatedCC) return CCRichText({text})
                                                    else return <span className="text-wrap max-w-full">{text}</span>
                                                }}/>
                                        </div>
                                    })
                                }
                            </div>
                        </div>
                        : <TextsDisplay
                            command={command} resultText={result.text} active={active}
                            toRichText={(text, index) => {
                                if (index === 0)
                                    return <span
                                        className={`text-zinc-700 group-hover:text-zinc-600 max-w-full truncate ${active && '!text-zinc-600'}`}>
                                        {text}
                                    </span>
                                else if (cc) return CCRichText({text})
                                else return <span className="text-wrap max-w-full">{text}</span>
                            }}
                            append={(() => {
                                if (fpApplied) {
                                    const level = getLevelDetail(fpApplied.level)

                                    return [
                                        FpLabel({
                                            points: entry.fortune!!,
                                            icon: faClover,
                                            className: "!bg-zinc-800 !text-zinc-50 border border-zinc-700"
                                        }),
                                        <span className={`text-wrap max-w-full font-bold text-${level.accent}-500`}>
                                            {level.jp}
                                        </span>
                                    ]
                                } else return []
                            })()}/>
                }
            </div>
            {
                ((effectiveCC || d || choice) && active) &&
                <div className="p-2 pt-0">
                    <div className="w-full h-[1px] mb-2">
                        <div className={`h-full w-full bg-zinc-800`}/>
                    </div>
                    <HistoryInsight entry={entry} closeHandler={toggleActive}
                                    cc={cc} d={d} choice={choice}/>
                </div>
            }
        </div>
    )
}