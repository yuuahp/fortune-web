import {HistoryEntry} from "@/libs/history";
import {getCC, getChoice, getD, getTexts} from "@/libs/bcdice-command";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretRight} from "@awesome.me/kit-ae9e2bd1c8/icons/classic/solid";
import {CCMeter, DMeter} from "@/components/meters";
import {getCCResultAccent} from "@/libs/bcdice";

export function History({entry, toggleActive}: {
    entry: HistoryEntry,
    toggleActive: () => void
}) {
    const {command, result, active} = entry
    const elements = [command, ...getTexts(result)]

    const cc = getCC(command, result)
    const d = getD(command, result)
    const choice = getChoice(command, result)

    const primaryValue = cc?.value || d?.value || undefined

    const accent = getCCResultAccent(cc?.result)

    return (
        <div
            className={`group p-2 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 rounded-2xl duration-200 flex flex-col gap-y-2 transition-colors ${active && '!border-zinc-800 bg-zinc-900'}`}
            onClick={() => {
                toggleActive()
            }}>
            <div className={`flex w-full ${active && 'pl-1'}`}>
                {
                    active &&
                    <div className="mr-1 h-full py-1">
                        <div className={`h-full w-2 rounded-full ${accent.fg}`}></div>
                    </div>
                }
                <div className="flex flex-wrap gap-x-2 px-2 w-full">
                    {
                        elements.map((text, index) => {
                            if (index === 0)
                                return (
                                    <p key={index} className="text-nowrap max-w-full truncate">
                                        {
                                            !active &&
                                            <FontAwesomeIcon className={`mr-2 ${accent.text}`} icon={faCaretRight}/>
                                        }
                                        <span
                                            className={`text-zinc-700 group-hover:text-zinc-600 max-w-full truncate ${active && '!text-zinc-600'}`}>{text}</span>
                                    </p>
                                )

                            return (
                                <p key={index} className="text-nowrap max-w-full">
                                    <FontAwesomeIcon className="mr-2 text-zinc-700" icon={faCaretRight}/>
                                    <span className="text-wrap max-w-full truncate">{text}</span>
                                </p>
                            )
                        })
                    }
                </div>
            </div>
            {
                active &&
                <div className="w-full h-[1px]">
                    <div className={`h-full w-full bg-zinc-800`}></div>
                </div>
            }
            {
                active &&
                <div className="flex w-full gap-x-2">
                    {
                        (cc || d) &&
                        <div className="inline-flex h-20 w-20 flex-col">
                            <div
                                className="mb-1 flex w-20 items-center justify-center rounded-t-lg rounded-b-md border border-zinc-800 text-4xl font-bold h-[3.25rem] bg-zinc-950">
                                {primaryValue}
                            </div>
                            <div
                                className={`h-[calc(100%-3.25rem-.25rem)] flex justify-center items-center bg-zinc-950 border border-zinc-800 rounded-b-lg rounded-t-md text-sm font-bold ${accent.text}`}>
                                {cc?.result || d?.compareMethod || "D"}
                            </div>
                        </div>
                    }
                    <div className="py-2 pl-2 w-full">
                        {
                            cc &&
                            <div className="w-full flex items-center gap-x-2">
                                <span>{cc.range.min}</span>
                                <CCMeter className="inline w-full max-w-48" cc={cc}/>
                                <span>{cc.range.max}</span>
                                {/*TODO: use fortune point*/}
                            </div>
                        }
                        {
                            d &&
                            <div className="w-full flex items-center gap-x-2">
                                <span>{d.range.min}</span>
                                <DMeter className="inline w-full max-w-48" d={d}/>
                                <span>{d.range.max}</span>
                            </div>
                        }
                        {
                            choice &&
                            <div className="w-full">
                                <div className="flex flex-wrap gap-x-1 gap-y-2">
                                    {
                                        choice.candidates.map((candidate, index) => {
                                            return (
                                                <div key={index} className={`
                                                    px-3 rounded-sm first:rounded-l-lg last:rounded-r-lg 
                                                    ${choice.indexes.includes(index) ? 'bg-green-900 text-green-200 font-bold' : 'bg-zinc-800'}
                                                `}>
                                                    {candidate}
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        }
                    </div>
                </div>
            }
        </div>
    )
}