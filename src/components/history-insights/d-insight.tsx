import {DMeter} from "@/components/meters";
import {PrimaryValue} from "@/components/history-insights/insight-components";
import {D} from "@/libs/bcdice-command";
import {ReactElement} from "react";

export function DInsight({d, closeButton}: { d: D, closeButton: ReactElement }) {
    return (
        <div className="flex w-full gap-x-2">
            <PrimaryValue value={d.value} result={d.result}/>
            <div className="pt-2 grow flex flex-col justify-between gap-y-2">
                <div className="w-full flex items-center gap-x-2">
                    <span>{d.range.min}</span>
                    <DMeter className="inline w-full max-w-48" d={d}/>
                    <span>{d.range.max}</span>
                </div>
                <div className="w-full flex justify-end">
                    {closeButton}
                </div>
            </div>
        </div>
    )
}