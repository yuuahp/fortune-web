import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faClover} from "@awesome.me/kit-ae9e2bd1c8/icons/classic/solid";
import {Button, FormControl, FormControlLabel, Radio, RadioGroup, TextField} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {addFortune, getHistoryById} from "@/stores/history-slice";
import {RootState} from "@/stores/store";
import {useEffect, useState} from "react";
import {FpLabel} from "@/components/fp-label";
import {
    CCLevel,
    CCLevelDetail,
    getCCExtremeRate,
    getCCHardRate,
    getLevelDetail,
    ccLevels,
    RatedCC
} from "@/libs/commands/cc";

export function FpForm({historyId, ratedCC, setOpen}: {
    historyId: string, ratedCC: RatedCC,
    setOpen: (open: boolean) => void
}) {
    const entry = useSelector((state: RootState) => getHistoryById(state, historyId))

    if (!entry) return (
        <div>
            <p>エントリーが見つかりません。</p>
        </div>
    )

    const hardRate = getCCHardRate(ratedCC)
    const extremeRate = getCCExtremeRate(ratedCC)

    const lowerResults = ccLevels.filter((_, index) =>
        index < ccLevels.indexOf(getLevelDetail(ratedCC.level))
    )

    const possibleResults = ccLevels.filter((_, index) =>
        index <= ccLevels.indexOf(getLevelDetail("REGULAR"))
    )

    const choices = possibleResults.map(levelDetail => {
        if (lowerResults.map(it => it.level).includes(levelDetail.level)) {
            switch (levelDetail.level) {
                case "REGULAR":
                    return {
                        levelDetail: levelDetail,
                        points: ratedCC.value - ratedCC.rate
                    }
                case "HARD":
                    return {
                        levelDetail: levelDetail,
                        points: ratedCC.value - hardRate
                    }
                case "EXTREME":
                    return {
                        levelDetail: levelDetail,
                        points: ratedCC.value - extremeRate
                    }
                case "CRITICAL":
                    return {
                        levelDetail: levelDetail,
                        points: ratedCC.value - 1
                    }
            }
        } else {
            return {
                levelDetail: levelDetail,
                points: undefined
            }
        }
    }) as { levelDetail: CCLevelDetail, points?: number }[]

    function getChoiceOf(level: CCLevel | "CUSTOM") {
        return choices.find(it => it.levelDetail.level === level)
    }

    const [selection, setSelection] = useState<CCLevel | "CUSTOM" | undefined>(undefined)

    const [custom, setCustom] = useState<string>("")

    const [finalPoints, setFinalPoints] = useState<number | undefined>(undefined)

    useEffect(() => {
        if (custom !== "" && selection === undefined) {
            setSelection("CUSTOM")
        }

        if (!selection) return

        if (selection === "CUSTOM") {
            const points = parseInt(custom)
            if (isNaN(points)) {
                setFinalPoints(undefined)
            } else {
                setFinalPoints(points)
            }
        } else {
            setFinalPoints(getChoiceOf(selection)!!.points)
        }
    }, [selection, custom]);

    const getSummary = () => {
        if (finalPoints === undefined) return (<span>成功度、または値を指定してください。</span>)
        return (<span><span className="text-2xl font-bold mr-1">{finalPoints}</span> 幸運ポイントを消費します。</span>)
    }

    const readySubmit = finalPoints !== undefined && 1 <= finalPoints && finalPoints <= choices.find(it => it.levelDetail.level === "CRITICAL")!!.points!!

    const dispatch = useDispatch()

    return (
        <form onSubmit={() => {
            if (!readySubmit) return

            dispatch(addFortune({id: entry.id, fp: finalPoints}))

            setOpen(false)
        }}>
            <FormControl>
                <h1 className="text-xl font-bold mb-4">
                    <FontAwesomeIcon icon={faClover} className="mr-2"/>
                    幸運の消費
                </h1>
                <RadioGroup value={selection || ""}
                            onChange={(_, value) => {
                                const level = value as unknown as (CCLevel | "CUSTOM")
                                setSelection(level)
                            }}>
                    {
                        choices.toReversed().map((choice, index) => {
                            const accent = choice.levelDetail.accent
                            const disabled = choice.points === undefined

                            return (
                                <FormControlLabel
                                    disabled={disabled}
                                    key={index} value={choice.levelDetail.level}
                                    control={<Radio/>}
                                    label={
                                        <p>
                                            {
                                                choice.points !== undefined &&
                                                <FpLabel className="!bg-zinc-800 !text-zinc-50 border border-zinc-700 mr-2" points={choice.points}/>
                                            }
                                            <span
                                                className={`font-bold mr-1 text-${accent}-${disabled ? '900' : '500'}`}>
                                            {choice.levelDetail.jp}
                                        </span>にする
                                        </p>
                                    }/>
                            );
                        })
                    }
                    <FormControlLabel control={<Radio/>} value="CUSTOM" label={
                        <p className="flex items-center">
                            <TextField className="w-20 mr-2" size="small"
                                       label="指定" value={custom}
                                       onChange={event => {
                                           const newValue = event.target.value.replace(/[^0-9]/g, "");
                                           setCustom(newValue);
                                       }}
                            />
                            <span>
                            ポイント消費する
                        </span>
                        </p>
                    }/>
                </RadioGroup>
                <div className="flex items-center my-4">
                    <div className="grow bg-zinc-900 h-[1px]"/>
                    <FontAwesomeIcon icon={faClover} className="mx-1 text-zinc-900"/>
                    <div className="grow bg-zinc-900 h-[1px]"/>
                </div>
                {/*TODO: import characters*/}
                <p className="mb-4">
                    {getSummary()}
                </p>
                <div className="flex justify-end gap-x-4">
                    <Button onClick={() => setOpen(false)}>
                        キャンセル
                    </Button>
                    <Button type="submit" variant="contained" disabled={!readySubmit}>
                        確定
                    </Button>
                </div>
            </FormControl>
        </form>

    )
}