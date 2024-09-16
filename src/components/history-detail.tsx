import {CCMeter, DMeter} from "@/components/meters";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleDown} from "@awesome.me/kit-ae9e2bd1c8/icons/classic/solid";
import {CC, Choice, D} from "@/libs/bcdice-command";
import {Accent} from "@/libs/bcdice";

export function HistoryDetail({cc, d, choice, accent}: { cc?: CC, d?: D, choice?: Choice, accent: Accent }) {
    return (
        <div className="flex w-full gap-x-2">
            {
                (cc || d) &&
                <div className="inline-flex h-20 w-20 flex-col">
                    <div
                        className="mb-1 flex w-20 items-center justify-center rounded-t-lg rounded-b-md border border-zinc-800 text-4xl font-bold h-[3.25rem] bg-zinc-950">
                        {cc?.value || d?.value || undefined}
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
                    <div className="flex gap-x-4">
                        <div className="w-full flex items-center gap-x-2">
                            <span>{cc.range.min}</span>
                            <CCMeter className="inline w-full" cc={cc}/>
                            <span>{cc.range.max}</span>
                        </div>

                        <div
                            className="
                                group/fp-button bg-zinc-800 hover:bg-zinc-700 hover:mr-1
                                cursor-pointer select-none transition-all
                                py-1 px-4 rounded-full font-bold text-nowrap
                            "
                            onClick={event => {
                                event.stopPropagation()
                            }}>
                            Use FP <FontAwesomeIcon icon={faAngleDown}
                                                    className="ml-1 group-hover/fp-button:ml-0 transition-all"/>
                        </div>
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
    )
}