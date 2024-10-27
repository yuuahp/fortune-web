import {getSkillSum, InvestigatorSheetDraft, Skill, SkillCategory} from "@/libs/investigator";
import {TextField} from "@mui/material";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faEdit, faGripDots} from "@awesome.me/kit-ae9e2bd1c8/icons/classic/solid";
import {useEffect, useRef, useState} from "react";
import {Skills} from "@/libs/investigator/skills";
import {LayoutGroup, motion} from "framer-motion";
import Draggable from 'react-draggable';
import {IconDefinition} from "@fortawesome/fontawesome-svg-core";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/stores/store";
import {setDraft as setDraftAction} from "@/stores/chara-slice";

export type SkillPointType = "base" | "profession" | "interest" | "growth" | "other"

export function SkillPointInput({className, rate, type, name}: {
    className?: string,
    rate: number,
    type: SkillPointType,
    name: string
}) {
    const dispatch = useDispatch()
    const draft = useSelector((state: RootState) => state.chara.draft)
    const setDraft = (data: InvestigatorSheetDraft) => dispatch(setDraftAction(data))

    const [typeJP, key] = (() => {
        switch (type) {
            case "base":
                return ["初期値", "rateBase"]
            case "profession":
                return ["職業", "rateProfession"]
            case "interest":
                return ["興味", "rateInterest"]
            case "growth":
                return ["成長", "rateGrowth"]
            case "other":
                return ["その他", "rateOther"]
        }
    })()

    return <TextField label={typeJP} size="small" className={`${className} `}
                      value={rate === 0 ? "" : rate}
                      onChange={event => {
                          const newValue = event.target.value.replace(/[^0-9]/g, "");
                          const newRate = newValue === "" ? 0 : parseInt(newValue)
                          const newSkills = draft.skills.map((it: Skill) => {
                              if (it.name === name) return {...it, [key]: newRate}
                              else return it
                          })
                          const newData = {...draft, skills: newSkills}
                          setDraft(newData)
                      }}/>
}

function getColor(type: SkillPointType, includeHover: boolean) {
    switch (type) {
        case "base":
            return 'bg-zinc-200 ' + (includeHover && 'hover:bg-zinc-300')
        case "profession":
            return 'bg-blue-300 ' + (includeHover && 'hover:bg-blue-400')
        case "interest":
            return 'bg-orange-300 ' + (includeHover && 'hover:bg-orange-400')
        case "growth":
            return 'bg-green-300 ' + (includeHover && 'hover:bg-green-400')
        case "other":
            return 'bg-red-300 ' + (includeHover && 'hover:bg-red-400')
    }
}

function PointBlock({ranges, clickAllowed, onClick}: {
    ranges: [SkillPointType, number][],
    clickAllowed: [boolean, boolean],
    onClick: [() => void, () => void]
}) {
    const mutableRanges = [...ranges]
    const firstHalfRange: [SkillPointType, number][] = []
    const secondHalfRange: [SkillPointType, number][] = []

    const firstHalfSum = () => firstHalfRange
        .map(it => it[1])
        .reduce((a, b) => a + b, 0)

    while (mutableRanges.length !== 0) {
        const [type, points] = mutableRanges.shift()!! // not 0

        if (firstHalfSum() + points <= 5) {
            firstHalfRange.push([type, points])
        } else {
            const pointsLeft = 5 - firstHalfSum()
            if (pointsLeft !== 0) firstHalfRange.push([type, pointsLeft])
            secondHalfRange.push([type, points - pointsLeft])
        }
    }

    const HalfElement = ({ranges, index}: { ranges: [SkillPointType, number][], index: number }) => (
        <div
            onClick={clickAllowed[index] ? onClick[index] : () => {
            }}
            className={`cursor-pointer w-1/2 h-full flex bg-zinc-700`}>
            {
                ranges.map(([type, points]) => (
                    <div className={`h-full ${getColor(type, clickAllowed[index])}`}
                         key={type} style={{width: `${(points / 5) * 100}%`}}/>
                ))
            }
        </div>
    )

    return <div className="flex w-full h-full">
        <HalfElement ranges={firstHalfRange} index={0}/>
        <HalfElement ranges={secondHalfRange} index={1}/>
    </div>
}

export function SkillSlider({points, onPointsChange}: {
    points: { base: number, profession: number, interest: number, growth: number, other: number },
    onPointsChange: (rates: { profession: number, interest: number }) => void
}) {
    const allRef = useRef<HTMLDivElement>(null)
    const [{blockGrid, pointGrid}, setMeasures] = useState({blockGrid: 0, pointGrid: 0})

    const pBarRef = useRef(null)
    const iBarRef = useRef(null)

    const piOverlap = points.interest === 0

    function updateGridX() {
        const currentWidth = allRef.current?.clientWidth
        if (currentWidth === undefined) return

        setMeasures({blockGrid: currentWidth / 20, pointGrid: currentWidth / 100})
    }

    window.onresize = updateGridX

    useEffect(() => {
        updateGridX()
    }, [allRef.current?.clientWidth])

    const getRateEntries = () => (Object.entries(points) as [SkillPointType, number][]).filter(it => it[1] !== 0)
    let rateEntries = getRateEntries()

    useEffect(() => {
        rateEntries = getRateEntries()
    }, [points]);

    return <div className="h-12 flex items-center">
        <div className="h-4 w-full grid grid-cols-10 gap-x-1 relative" ref={allRef}>
            <Draggable axis="x" handle=".handle" nodeRef={pBarRef}
                       bounds={{
                           left: points.base * pointGrid,
                           right: (100 - (points.interest + points.growth + points.other)) * pointGrid
                       }}
                       positionOffset={{x: "-50%", y: 0}}
                       defaultPosition={{x: 0, y: 0}}
                       position={{
                           x: (points.base + points.profession) * pointGrid, y: 0
                       }}
                       onDrag={(_, data) => {
                           const newProfession = Math.round(data.x / pointGrid) - points.base
                           const newPointsMod5 = (points.base + newProfession + points.interest) % 5

                           const allowAdjustment = newProfession > 0 && 100 - (points.base + points.profession + points.interest) > 5

                           onPointsChange({
                               profession: allowAdjustment ? newProfession - newPointsMod5 : newProfession,
                               interest: points.interest
                           })
                       }}
                       grid={[blockGrid, 0]}
                       scale={1}>
                <div ref={pBarRef}
                     className={`handle absolute z-10 ${piOverlap ? 'h-[calc(1rem+2px)]' : 'h-8 rounded-b-full'} 
                    w-3 border-4 border-zinc-800 bg-blue-300 left-0 -top-2 cursor-e-resize`}>
                    <div className="w-full h-full relative">
                        <div
                            className="absolute -top-3 left-[calc(50%-.5rem)] rounded-[calc((.75rem-8px)/2)] h-3 w-4 bg-blue-300 flex justify-center items-center">
                            <FontAwesomeIcon icon={faGripDots} className="text-xs text-blue-900"/>
                        </div>
                    </div>
                </div>
            </Draggable>
            <Draggable axis="x" handle=".handle" nodeRef={iBarRef}
                       bounds={{
                           left: (points.base + points.profession) * pointGrid,
                           right: (100 - (points.growth + points.other)) * pointGrid
                       }}
                       positionOffset={{x: "-50%", y: 0}}
                       defaultPosition={{x: 0, y: 0}}
                       position={{
                           x: (points.base + points.profession + points.interest) * pointGrid,
                           y: 0
                       }}
                       onDrag={(_, data) => {
                           const newInterest = Math.round(data.x / pointGrid) - points.profession - points.base
                           const newPointsMod5 = (points.base + points.profession + newInterest) % 5

                           const allowAdjustment = newInterest > 0 && 100 - (points.base + points.profession + points.interest) > 5

                           onPointsChange({
                               profession: points.profession,
                               interest: allowAdjustment ? newInterest - newPointsMod5 : newInterest
                           })
                       }}
                       grid={[blockGrid, 0]}
                       scale={1}>
                <div ref={iBarRef}
                     className={`handle absolute z-10 ${piOverlap ? 'h-[calc(1rem+2px)]' : 'h-8 rounded-t-full'} 
                    w-3 border-4 border-zinc-800 bg-orange-300 left-0 -bottom-2 cursor-e-resize`}>
                    <div className="w-full h-full relative">
                        <div
                            className="absolute -bottom-3 left-[calc(50%-.5rem)] rounded-[calc((.75rem-8px)/2)] h-3 w-4 bg-orange-300 flex justify-center items-center">
                            <FontAwesomeIcon icon={faGripDots} className="text-xs text-orange-900"/>
                        </div>
                    </div>
                </div>
            </Draggable>
            {
                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(it => {
                    let ranges: [SkillPointType, number][] = []

                    const getCurrentRangeSum = () => ranges.map(it => it[1]).reduce((a, b) => a + b, 0)

                    const blockFilled = () => getCurrentRangeSum() === 10

                    while (!blockFilled()) {
                        const pointsLeft = 10 - getCurrentRangeSum()
                        if (pointsLeft === 0) break
                        const currentPoint = rateEntries[0]
                        if (currentPoint === undefined) break
                        const [type, points] = currentPoint;

                        if (points > pointsLeft) {
                            ranges = [...ranges, [type, pointsLeft]]
                            rateEntries = ([[type, points - pointsLeft], ...rateEntries.slice(1)])
                        } else {
                            ranges = [...ranges, [type, points]]
                            rateEntries = (rateEntries.slice(1))
                        }
                    }

                    return <div className={`
                                h-full ${it === 1 && 'rounded-l'} last:rounded-r 
                                overflow-hidden relative`}
                                key={it}>
                        <PointBlock ranges={ranges} clickAllowed={[true, true]} onClick={[() => {
                            // TODO
                        }, () => {
                            // TODO
                        }]}/>
                        <div
                            className="absolute top-[.2rem] left-[calc(50%-.05rem)] h-[calc(100%-.4rem)] w-[.1rem] rounded-full bg-zinc-800"/>

                    </div>
                })
            }
        </div>
    </div>
}

export function SkillCategoryEditor({icon, name, type, editHook, edit}: {
    icon: IconDefinition,
    name: string,
    type: SkillCategory,
    editHook?: (editing: boolean) => void
    edit?: boolean
}) {
    const dispatch = useDispatch()
    const draft = useSelector((state: RootState) => state.chara.draft)
    const setDraft = (data: InvestigatorSheetDraft) => dispatch(setDraftAction(data))

    const [skillsDelta, setSkillsDelta] = useState<string[] | undefined>(undefined)
    const skillInfo = Skills[type]
    const addedSkills = draft.skills.filter((it: Skill) => it.added && it.category === type)

    function initSkillsDelta() {
        setSkillsDelta(draft.skills
            .filter((it: Skill) => it.category === type && it.added)
            .map((it: Skill) => it.name))
    }

    function applySkillsDelta() {
        if (skillsDelta === undefined) return

        const newSkills: Skill[] = draft.skills
            .map((it: Skill): Skill => {
                if (it.category === type) return ({
                    ...it,
                    added: skillsDelta.includes(it.name)
                })
                else return it
            })
        const newData = {...draft, skills: newSkills}
        setDraft(newData)
        setSkillsDelta(undefined)
    }

    useEffect(() => editHook && editHook(skillsDelta !== undefined), [skillsDelta])
    useEffect(() => {
        if (edit) initSkillsDelta()
        else setSkillsDelta(undefined)
    }, [edit]);

    const editing = skillsDelta !== undefined

    return <div className="rounded-xl overflow-hidden flex flex-col gap-y-2">
        <div className="flex justify-between items-center bg-zinc-950 pl-4 px-1 py-1 text-lg gap-x-2 rounded-md">
            <div>
                <FontAwesomeIcon icon={icon} className="mr-2"/>{name}
            </div>
            <div
                className={`transition-all cursor-pointer select-none rounded-lg px-3 ${(editing ? 'text-zinc-950 bg-blue-300' : 'text-blue-300')}`}
                onClick={() => {
                    if (skillsDelta === undefined) initSkillsDelta()
                    else applySkillsDelta()
                }}>
                {editing ? "適用" : "編集"}
                <FontAwesomeIcon icon={editing ? faCheck : faEdit} className="ml-2"/>
            </div>
        </div>
        {
            (skillsDelta || addedSkills.length !== 0) && (
                skillsDelta
                    ? (<LayoutGroup>
                        <div className="flex gap-2 flex-wrap">{
                            skillInfo.map(({name, icon}) => {
                                const added = skillsDelta.includes(name)
                                return <motion.div layoutId={name} className={`
                                                   border border-transparent ${added ? 'border-zinc-700' : 'text-zinc-500'} 
                                                   flex items-center gap-x-2 rounded-md bg-zinc-800 px-2 py-1 transition-all cursor-pointer
                                                   w-fit`}
                                                   onClick={() => {
                                                       if (added) setSkillsDelta(skillsDelta.filter(it => it !== name))
                                                       else setSkillsDelta([...skillsDelta, name])
                                                   }} key={name}>
                                    <FontAwesomeIcon icon={icon} className="text-xl aspect-square"/>
                                    <motion.p className="text-nowrap truncate">{name}</motion.p>
                                    <motion.p>{getSkillSum(draft, name)}</motion.p>
                                </motion.div>
                            })
                        }</div>
                    </LayoutGroup>)
                    : (<LayoutGroup>
                        <div className="grid grid-cols-1 @xl:grid-cols-2 gap-2">{
                            addedSkills.map(({name, rateBase, rateProfession, rateInterest, rateGrowth, rateOther}: Skill) => {
                                const skillInfo = Skills.all.find(it => it.name === name)!!

                                const otherCommand = typeof rateOther === "string"

                                if (otherCommand) {
                                    return <div>
                                        {/*TODO*/}
                                    </div>
                                } else return <motion.div layoutId={name}
                                                          className="flex flex-col gap-y-2 rounded-md bg-zinc-800 p-2"
                                                          key={name}>
                                    <motion.div className="flex items-center gap-x-2">
                                        <FontAwesomeIcon icon={skillInfo.icon} className="text-xl aspect-square"/>
                                        <motion.p className="text-nowrap truncate">{name}</motion.p>
                                        <div
                                            className="bg-zinc-700 rounded text-xl font-bold aspect-square h-8 flex items-center justify-center">
                                            {getSkillSum(draft, name)}
                                        </div>
                                    </motion.div>
                                    <div className="flex gap-2 items-center flex-wrap">
                                        <TextField label="初期値" size="small" className="w-16" value={rateBase}
                                                   disabled/>
                                        {
                                            ([
                                                [rateProfession, "profession"],
                                                [rateInterest, "interest"],
                                                [rateGrowth, "growth"],
                                                [rateOther, "other"]
                                            ] as [number, SkillPointType][])
                                                .map(([rate, type]) =>
                                                    <SkillPointInput
                                                        key={type}
                                                        className="w-16"
                                                        rate={rate}
                                                        type={type}
                                                        name={name}/>)
                                        }
                                    </div>
                                    <SkillSlider points={
                                        {
                                            base: rateBase,
                                            profession: rateProfession,
                                            interest: rateInterest,
                                            growth: rateGrowth,
                                            other: rateOther
                                        }
                                    } onPointsChange={({profession, interest}) => {
                                        const newSkills = draft.skills.map((it: Skill) => {
                                            if (it.name === name) return {
                                                ...it,
                                                rateProfession: profession,
                                                rateInterest: interest
                                            }
                                            else return it
                                        })
                                        const newData = {...draft, skills: newSkills}
                                        setDraft(newData)
                                    }}/>
                                </motion.div>
                            })}</div>
                    </LayoutGroup>)
            )
        }
    </div>
}