import {HistoryEntry} from "@/libs/history";
import {
    applyFP,
    getCC,
    getChoice,
    getD,
    getFormattedCommand,
    getLevelDetail,
    getRatedCC,
    getTexts
} from "@/libs/bcdice-command";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretRight} from "@awesome.me/kit-ae9e2bd1c8/icons/classic/solid";
import {HistoryInsight} from "@/components/history-insight";
import {Tooltip} from "@mui/material";
import {transform} from "@/libs/utils";

export function History({entry, toggleActive}: {
    entry: HistoryEntry,
    toggleActive: () => void
}) {
    const {command, result, active} = entry

    const {display: displayedCommand, command: formattedCommand} = getFormattedCommand(result)

    const elements = [command, ...getTexts(result).map((it, i) => i === 0 ? it.replace(displayedCommand, "").trim() : it).filter(it => it !== "")]

    const cc = transform(getCC(command, result), it => {
        if (!it) return undefined
        const ratedCC = getRatedCC(it)
        return it || ratedCC
    })

    const ratedCC = cc ? getRatedCC(cc) : undefined
    const fpApplied = (ratedCC && entry.fortune) ? applyFP(ratedCC, entry.fortune) : undefined
    const effectiveCC = fpApplied || ratedCC || cc

    const accent = effectiveCC?.level ? getLevelDetail(effectiveCC.level).accent : "zinc";

    const d = getD(command, result)
    const choice = getChoice(command, result)

    return (
        <div className={`
            group p-2 hover:bg-zinc-900 border border-transparent 
            rounded-2xl duration-200 flex flex-col gap-y-2 
            transition-colors ${active && '!border-zinc-800 bg-zinc-900'}
        `}>
            <div onClick={toggleActive} className={`flex w-full ${active && 'pl-1'}`}>
                {
                    active &&
                    <div className="mr-1 h-full py-1">
                        <div className={`h-full w-2 rounded-full bg-${accent}-500`}></div>
                    </div>
                }
                <div className="flex flex-wrap gap-x-2 pl-2 w-full">
                    {
                        elements.map((text, index) => {
                            if (index === 0)
                                return (
                                    <p key={index} className="text-nowrap max-w-full truncate">
                                        {
                                            !active &&
                                            <FontAwesomeIcon className={`mr-2 text-${accent}-500`} icon={faCaretRight}/>
                                        }
                                        <Tooltip title={formattedCommand}>
                                            <span
                                                className={`text-zinc-700 group-hover:text-zinc-600 max-w-full truncate ${active && '!text-zinc-600'}`}>
                                                {text}
                                            </span>
                                        </Tooltip>
                                    </p>
                                )

                            return (
                                <p key={index} className="text-wrap max-w-full last:mr-2">
                                    <FontAwesomeIcon className="mr-2 text-zinc-700" icon={faCaretRight}/>
                                    <span className="text-wrap max-w-full truncate">{text}</span>
                                </p>
                            )
                        })
                    }
                </div>
            </div>
            {
                ((effectiveCC || d || choice) && active) &&
                <div>
                    <div className="w-full h-[1px] mb-2">
                        <div className={`h-full w-full bg-zinc-800`}></div>
                    </div>
                    <HistoryInsight entry={entry} active={active}
                                    cc={cc} d={d} choice={choice}
                                    closeHandler={toggleActive}/>
                </div>
            }
        </div>
    )
}