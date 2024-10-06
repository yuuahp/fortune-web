import {ReactElement, useContext, useEffect, useRef} from "react";
import {HistoryEntry} from "@/libs/history";
import {CCInsight} from "@/components/history-insights/cc-insight";
import {DInsight} from "@/components/history-insights/d-insight";
import {ChoiceInsight} from "@/components/history-insights/choice-insight";
import {CloseButton} from "@/components/history-insights/insight-components";
import {D} from "@/libs/commands/sum-dices";
import {CC} from "@/libs/commands/cc";
import {Choice} from "@/libs/commands/choice";
import {HistoryScrollContext} from "@/app/contexts";

export function HistoryInsight({entry, cc, d, choice, closeHandler}: {
    entry: HistoryEntry,
    cc?: CC,
    d?: D,
    choice?: Choice,
    closeHandler: () => void
}) {
    const historyScroll = useContext(HistoryScrollContext)

    const bottomRef = useRef<HTMLDivElement>(null)
    const topRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!bottomRef.current || !topRef.current) return

        const topY = topRef.current.getBoundingClientRect().y
        const bottomY = bottomRef.current.getBoundingClientRect().y

        const scrollTop = historyScroll?.getBoundingClientRect().y || 0
        const scrollBottom = historyScroll?.getBoundingClientRect().bottom || 0

        if (topY < scrollTop) {
            topRef.current?.scrollIntoView({behavior: "instant"})
        } else if (bottomY > scrollBottom) {
            bottomRef.current?.scrollIntoView({behavior: "instant"})
        }
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
            <div ref={topRef}/>
            {insight}
            <div ref={bottomRef}/>
        </div>
    ); else return undefined
}