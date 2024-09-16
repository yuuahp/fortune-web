import {useEffect, useRef, useState} from "react";
import {colors, getCCResultAccent} from "@/libs/bcdice";
import {CC, D, DiceRange} from "@/libs/bcdice-command";

export function DMeter({className, d}: {
    className?: string,
    d: D
}) {
    const checkColor = d.result === "SUCCESS" ? colors.regular : colors.normal
    const minMaxColor = d.value === d.range.min ? colors.critical : (d.value === d.range.max ? colors.fumble : undefined)

    return (
        <Meter
            className={className}
            value={d.value}
            border={d?.border}
            range={d.range}
            barAccent={minMaxColor || checkColor}
            meterAccent={d.result ? colors.regular : colors.normal}
        />
    )
}

export function CCMeter({className, cc}: {
    className?: string,
    cc: CC
}) {
    const color = getCCResultAccent(cc.result)
    const useSpecialBarAccent = ["EXTREME", "HARD"].includes(cc.result || "")

    const noCheckColor = cc.value === cc.range.min ? colors.critical : (cc.value === cc.range.max ? colors.fumble : colors.normal)

    return (
        <Meter
            className={className}
            value={cc.value}
            border={cc?.rate}
            range={cc.range}
            barAccent={cc.result ? color : noCheckColor}
            meterAccent={useSpecialBarAccent ? color : (cc.result ? colors.regular : colors.normal)}
        />
    )
}

export function Meter(
    {
        className, value, border, range,
        barAccent = {
            text: "text-zinc-500",
            fg: "bg-zinc-500",
            bg: "bg-zinc-800"
        },
        meterAccent = {
            text: "text-zinc-500",
            fg: "bg-zinc-500",
            bg: "bg-zinc-800"
        }
    }: {
        className?: string,
        value: number,
        border?: number,
        range: DiceRange,
        barAccent: {
            text: string,
            fg: string,
            bg: string
        },
        meterAccent: {
            text: string,
            fg: string,
            bg: string
        }
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

    return (
        <div ref={meterRef}
             className={`h-3 flex gap-x-1 rounded-full relative ${!show && 'opacity-0'} ` + className}>
            <div // bar
                className={`w-4 h-[1.75rem] ${barAccent.fg} rounded-full absolute border-[.25rem] border-zinc-900 -top-2 transition-all`}
                style={{left: `calc(${meterLeft}% - 0.5rem)`}}>
            </div>
            <div data-name="critical or min"
                 className="w-4 rounded-l-full bg-yellow-900"></div>
            {
                accentRangeWidth > 0 &&
                <div className={`h-full transition-all min-w-2 ${meterAccent.bg}`}
                     style={{width: `calc(${accentRangeWidth}% - 1rem)`}}></div>
            }
            {
                (normalRangeWidth && (normalRangeWidth > 0))
                    ? <div className="h-full bg-zinc-800 transition-all min-w-2"
                           style={{width: `calc(${normalRangeWidth}% - 1rem)`}}></div>
                    : undefined
            }
            <div data-name="fumble or max"
                 className="w-4 rounded-r-full bg-red-900"></div>
        </div>
    )
}