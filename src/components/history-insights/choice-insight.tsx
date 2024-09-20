import {Choice} from "@/libs/bcdice-command";
import {ReactElement} from "react";

export function ChoiceInsight({choice, closeButton}: { choice: Choice, closeButton: ReactElement }) {
    const candidates = choice.candidates

    return (
        <div className="w-full">
            <div className="flex flex-wrap gap-x-1 gap-y-2">
                {
                    candidates.map((candidate, index) =>
                        <div key={index}
                             className={`
                                     px-3 rounded-sm first:rounded-l-lg ${index + 1 === candidates.length && 'rounded-r-lg'}
                                     ${choice.indexes.includes(index) ? 'bg-green-900 text-green-200 font-bold' : 'bg-zinc-800'}
                                 `}>
                            {candidate}
                        </div>)
                }
                <div className="grow h-full flex justify-end">
                    {closeButton}
                </div>
            </div>
        </div>
    )
}