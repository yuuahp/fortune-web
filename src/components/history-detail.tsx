import {CCMeter, DMeter} from "@/components/meters";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleDown, faAngleUp, faBomb, faClover} from "@awesome.me/kit-ae9e2bd1c8/icons/classic/solid";
import {CC, Choice, D, getRatedCC} from "@/libs/bcdice-command";
import {Accent} from "@/libs/bcdice";
import {useEffect, useRef, useState} from "react";
import {FlyoutButton} from "@/components/flyout-button";
import {FpForm} from "@/components/fp-form";
import {HistoryEntry} from "@/libs/history";

export function HistoryDetail({entry, cc, d, choice, accent, active, closeHandler}: {
    entry: HistoryEntry,
    cc?: CC,
    d?: D,
    choice?: Choice,
    accent: Accent,
    active: boolean,
    closeHandler: () => void
}) {

    const endRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        endRef.current?.scrollIntoView({behavior: "instant"})
    }, []);

    function CloseButton() {
        return (
            <div
                className="
                    group/fp-button bg-zinc-800 hover:bg-zinc-700 hover:mr-1
                    cursor-pointer select-none transition-all
                    px-4 rounded-full font-bold text-nowrap w-fit
                "
                onClick={closeHandler}>
                閉じる
                <FontAwesomeIcon icon={active ? faAngleUp : faAngleDown}
                                 className={`ml-2 group-hover/fp-button:ml-1 ${active ? 'group-active/fp-button:-translate-y-0.5' : 'group-active/fp-button:translate-y-0.5'} transition-all`}/>
            </div>
        )
    }

    function PrimaryValue({value, result}: { value?: number, result?: string }) {
        return (
            <div className="inline-flex h-20 w-20 flex-col">
                <div
                    className="mb-1 flex w-20 items-center justify-center rounded-t-lg rounded-b-md border border-zinc-800 text-4xl font-bold h-[3.25rem] bg-zinc-950">
                    {value || "?"}
                </div>
                <div
                    className={`h-[calc(100%-3.25rem-.25rem)] flex justify-center items-center bg-zinc-950 border border-zinc-800 rounded-b-lg rounded-t-md text-sm font-bold ${accent.text}`}>
                    {result || ""}
                </div>
            </div>
        )
    }

    const [fpFlyoutOpen, setFpFlyoutOpen] = useState(false)
    const [pushFlyoutOpen, setPushFlyoutOpen] = useState(false)

    if (cc) {
        const ratedCC = getRatedCC(cc)

        return (
            <div>
                <div className="flex w-full gap-x-4">
                    <PrimaryValue value={cc.value} result={cc.result}/>
                    <div className="pt-2 grow flex flex-col justify-between gap-y-2">
                        <div className="flex gap-x-4">
                            <div className="w-full flex items-center gap-x-2">
                                <span>{cc.range.min}</span>
                                <CCMeter className="inline w-full max-w-64" cc={cc}/>
                                <span>{cc.range.max}</span>
                            </div>
                        </div>
                        <div className="w-full flex items-end justify-between gap-x-2">
                            <div className="flex gap-2 flex-wrap">
                                {
                                    (ratedCC && !entry.fortune && !entry.push) &&
                                    <FlyoutButton icon={faClover} name="幸運の消費"
                                                  open={fpFlyoutOpen}
                                                  setOpen={(open) => setFpFlyoutOpen(open)}>
                                        <FpForm historyId={entry.id} ratedCC={ratedCC}
                                                open={fpFlyoutOpen}
                                                setOpen={(open) => setFpFlyoutOpen(open)}/>
                                    </FlyoutButton>
                                }
                                {
                                    (ratedCC && !entry.fortune && !entry.push) &&
                                    <FlyoutButton icon={faBomb} name="プッシュ"
                                                  open={pushFlyoutOpen}
                                                  setOpen={(open) => setPushFlyoutOpen(open)}>
                                        powa
                                    </FlyoutButton>
                                }
                            </div>

                            <CloseButton/>
                        </div>
                    </div>
                </div>
                <div ref={endRef}></div>
            </div>
        )
    } else if (d) {
        return (
            <div className="flex w-full gap-x-2">
                <PrimaryValue value={d.value} result={d.result}/>
                <div className="w-full flex items-center gap-x-2">
                    <span>{d.range.min}</span>
                    <DMeter className="inline w-full max-w-48" d={d}/>
                    <span>{d.range.max}</span>
                </div>
                <div ref={endRef}></div>
            </div>
        )
    } else if (choice) {
        return (
            <div className="w-full">
                <div className="flex flex-wrap gap-x-1 gap-y-2">
                    {
                        choice.candidates.map((candidate, index) =>
                            <div key={index}
                                 className={`
                                     px-3 rounded-sm first:rounded-l-lg last:rounded-r-lg
                                     ${choice.indexes.includes(index) ? 'bg-green-900 text-green-200 font-bold' : 'bg-zinc-800'}
                                 `}>
                                {candidate}
                            </div>)
                    }
                </div>
            </div>
        )
    }

    return undefined
}