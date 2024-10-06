import {DMeter} from "@/components/history/meters";
import {PrimaryValue} from "@/components/history-insights/insight-components";
import {ReactElement} from "react";
import {D} from "@/libs/commands/sum-dices";

export function DInsight({d, closeButton}: { d: D, closeButton: ReactElement }) {
    return (
        <div className="flex w-full gap-x-4">
            <PrimaryValue value={d.value} result={d.level}/>
            <div className="pt-2 grow flex flex-col justify-between gap-y-2">
                <div className="w-full flex items-center gap-x-2">
                    <span>{d.range.min}</span>
                    <DMeter className="inline w-full max-w-64" d={d}/>
                    <span>{d.range.max}</span>
                </div>
                <div className="w-full flex justify-end">
                    {closeButton}
                </div>
            </div>
        </div>
    )
}