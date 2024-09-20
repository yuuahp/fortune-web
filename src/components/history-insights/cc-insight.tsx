import {applyFP, CC, getLevelDetail, getRatedCC} from "@/libs/bcdice-command";
import {CCMeter} from "@/components/meters";
import {FlyoutButton} from "@/components/flyout-button";
import {faBomb, faClover} from "@awesome.me/kit-ae9e2bd1c8/icons/classic/solid";
import {FpForm} from "@/components/fp-form";
import {PushForm} from "@/components/push-form";
import {FpLabel} from "@/components/fp-label";
import {HistoryEntry} from "@/libs/history";
import React, {ReactElement, useState} from "react";
import {PrimaryValue} from "@/components/history-insights/insight-components";

export function CCInsight({entry, cc, closeButton}: {
    entry: HistoryEntry,
    cc: CC,
    closeButton: ReactElement
}) {

    const ratedCC = getRatedCC(cc)
    const fpApplied = (ratedCC && entry.fortune) ? applyFP(ratedCC, entry.fortune) : undefined
    const effectiveCC = fpApplied || ratedCC || cc

    const accent = effectiveCC.level ? getLevelDetail(effectiveCC.level).accent : "zinc";

    const [fpFlyoutOpen, setFpFlyoutOpen] = useState(false)
    const [pushFlyoutOpen, setPushFlyoutOpen] = useState(false)

    return (
        <div className="flex w-full gap-x-4">
            <PrimaryValue value={effectiveCC.value} result={effectiveCC.level} accent={accent}/>
            <div className="pt-2 grow flex flex-col justify-between gap-y-2">
                <div className="flex gap-x-4">
                    <div className="w-full flex items-center gap-x-2">
                        <span>{effectiveCC.range.min}</span>
                        <CCMeter className="inline w-full max-w-64" cc={effectiveCC}/>
                        <span>{effectiveCC.range.max}</span>
                    </div>
                </div>
                <div className="w-full flex items-end justify-between gap-x-2">
                    <div className="flex gap-2 flex-wrap items-center">
                        <FlyoutButton icon={faClover} name="幸運の消費"
                                      open={fpFlyoutOpen}
                                      setOpen={(open) => setFpFlyoutOpen(open)}
                                      disabled={!(ratedCC && !entry.fortune && !entry.push)}>
                            <FpForm historyId={entry.id} ratedCC={ratedCC!!}
                                    setOpen={(open) => setFpFlyoutOpen(open)}/>
                        </FlyoutButton>
                        <FlyoutButton icon={faBomb} name="プッシュ"
                                      open={pushFlyoutOpen}
                                      setOpen={(open) => setPushFlyoutOpen(open)}
                                      disabled={!(ratedCC && !entry.fortune && !entry.push)}>
                            <PushForm historyId={entry.id} setOpen={(open) => setPushFlyoutOpen(open)}/>
                        </FlyoutButton>
                        {
                            entry.fortune &&
                            <span className="flex items-center">
                                        <FpLabel points={entry.fortune} icon={faClover}/>
                                        を消費しました
                                    </span>
                        }
                        {
                            entry.push &&
                            <span className="flex items-center">プッシュしました</span>
                        }
                    </div>

                    {closeButton}
                </div>
            </div>
        </div>
    )
}