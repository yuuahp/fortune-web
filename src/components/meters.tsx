import {useEffect, useRef, useState} from "react";
import {DiceRange} from "@/libs/bcdice";
import {CompareMethod, D} from "@/libs/commands/sum-dices";
import {CC, getLevelDetail} from "@/libs/commands/cc";

export function DMeter({className, d}: {
    className?: string,
    d: D
}) {
    const checkColor = d.level === "SUCCESS" ? getLevelDetail("REGULAR") : undefined
    const minMaxColor = d.value === d.range.min ? getLevelDetail("CRITICAL") : (d.value === d.range.max ? getLevelDetail("FUMBLE") : undefined)

    return (
        <Meter
            className={className}
            value={d.value}
            border={d?.border}
            range={d.range}
            barAccent={(minMaxColor || checkColor)?.accent}
            meterAccent={d.level ? getLevelDetail("REGULAR").accent : undefined}
            compareMethod={d.compareMethod}
        />
    )
}

export function CCMeter({className, cc}: {
    className?: string,
    cc: CC
}) {

    const levelDetail = cc.level ? getLevelDetail(cc.level) : undefined
    const useSpecialBarAccent = ["EXTREME", "HARD"].includes(cc.level || "")

    const noCheckColor = cc.value === cc.range.min ? getLevelDetail("CRITICAL") : (cc.value === cc.range.max ? getLevelDetail("FUMBLE") : undefined)

    return (
        <Meter
            className={className}
            value={cc.value}
            border={cc?.rate}
            range={cc.range}
            barAccent={cc.level ? levelDetail?.accent : noCheckColor?.accent}
            meterAccent={useSpecialBarAccent ? levelDetail?.accent : (cc.level ? getLevelDetail("REGULAR").accent : undefined)}
            compareMethod={cc.rate ? "LessEqual" : undefined}
        />
    )
}

export function Meter(
    {
        className, value, border, range,
        barAccent = "zinc",
        meterAccent = "zinc",
        compareMethod
    }: {
        className?: string,
        value: number,
        border?: number,
        range: DiceRange,
        barAccent?: string,
        meterAccent?: string,
        compareMethod?: CompareMethod
    }
) {
    const meterRef = useRef<HTMLDivElement>(null)

    const [meterLeft, setMeterLeft] = useState<number | null>(null)

    const [show, setShow] = useState(false)

    const numbers = range.max - range.min + 1
    const normalNumbers = numbers - 2

    useEffect(() => {
        if (!meterRef.current) return

        if (range.min === value)
            setMeterLeft(0)
        else if (range.max === value)
            setMeterLeft(100)
        else {
            const width = meterRef?.current?.clientWidth
            if (!width) return

            // left % without critical range
            setMeterLeft((((width - (2 * 16)) * ((value - range.min - 1) / (normalNumbers - 1)) + 16) / width) * 100)
        }

        setShow(true)
    }, [value])

    const borderRate = (border !== undefined) ? (border - range.min - 1) / (normalNumbers - 1) * 100 : undefined;

    // prevent border rate from exceeding 100%
    const accentRangeWidth = (borderRate !== undefined) ? (borderRate >= 100 ? 100 : borderRate) : 100
    const normalRangeWidth = (borderRate !== undefined) ? 100 - borderRate : undefined

    const isGreaterSuccess = compareMethod?.includes("Greater")
    const isLessSuccess = compareMethod?.includes("Less")
    const isNotEqualSuccess = compareMethod === "NotEqual"

    const leftRangeColor = isLessSuccess || isNotEqualSuccess ? meterAccent : "zinc"
    const rightRangeColor = isGreaterSuccess || isNotEqualSuccess ? meterAccent : "zinc"

    return (
        <div ref={meterRef}
             className={`h-3 flex gap-x-1 rounded-full relative ${!show && 'opacity-0'} ` + className}>
            <div // bar
                className={`w-4 h-[1.75rem] bg-${barAccent}-500 rounded-full absolute border-[.25rem] border-zinc-900 -top-2 transition-all`}
                style={{left: `calc(${meterLeft}% - 0.5rem)`}}>
            </div>
            <div data-name="critical or min"
                 className="w-4 rounded-l-full bg-yellow-900"></div>
            {
                accentRangeWidth > 0 &&
                <div className={`h-full transition-all min-w-2 bg-${leftRangeColor}-800`}
                     style={{width: `calc(${accentRangeWidth}% - 1rem)`}}></div>
            }
            {
                (normalRangeWidth && (normalRangeWidth > 0))
                    ? <div className={`h-full transition-all min-w-2 bg-${rightRangeColor}-800`}
                           style={{width: `calc(${normalRangeWidth}% - 1rem)`}}></div>
                    : undefined
            }
            <div data-name="fumble or max"
                 className="w-4 rounded-r-full bg-red-900"></div>
        </div>
    )
}