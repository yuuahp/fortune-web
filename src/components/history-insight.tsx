import {ReactElement, useEffect, useRef} from "react";
import {HistoryEntry} from "@/libs/history";
import {CCInsight} from "@/components/history-insights/cc-insight";
import {DInsight} from "@/components/history-insights/d-insight";
import {ChoiceInsight} from "@/components/history-insights/choice-insight";
import {CloseButton} from "@/components/history-insights/insight-components";
import {D} from "@/libs/commands/sum-dices";
import {CC} from "@/libs/commands/cc";
import {Choice} from "@/libs/commands/choice";

export function HistoryInsight({entry, cc, d, choice, closeHandler}: {
    entry: HistoryEntry,
    cc?: CC,
    d?: D,
    choice?: Choice,
    closeHandler: () => void
}) {

    const endRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        endRef.current?.scrollIntoView({behavior: "instant"})
    }, []);

    let insight: ReactElement | undefined

    const closeButton = <CloseButton closeHandler={closeHandler}/>

    if (cc) {
        insight = <CCInsight entry={entry} cc={cc} closeButton={closeButton}/>
    } else if (d) {
        insight = <DInsight d={d} closeButton={closeButton}/>
    } else if (choice) {
        insight = <ChoiceInsight choice={choice} closeButton={closeButton}/>
    }

    if (insight) return (
        <div>
            {insight}
            <div ref={endRef}/>
        </div>
    ); else return undefined
}