import {getSkillSum, InvestigatorSheetDraft, Skill, SkillCategory} from "@/libs/investigator";
import {TextField} from "@mui/material";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faEdit, faGripDots} from "@awesome.me/kit-ae9e2bd1c8/icons/classic/solid";
import {useEffect, useRef, useState} from "react";
import {Skills} from "@/libs/investigator/skills";
import {LayoutGroup, motion} from "framer-motion";
import Draggable from 'react-draggable';
import {IconDefinition} from "@fortawesome/fontawesome-svg-core";

export type SkillPointType = "profession" | "interest" | "growth" | "other"

export function SkillPointInput({className, rate, type, data, setData, name}: {
    className?: string,
    rate: number,
    type: SkillPointType,
    data: InvestigatorSheetDraft,
    setData: (data: InvestigatorSheetDraft) => void,
    name: string
}) {

    const [typeJP, key] = (() => {
        switch (type) {
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
                          const newSkills = data.skills.map((it: Skill) => {
                              if (it.name === name) return {...it, [key]: newRate}
                              else return it
                          })
                          const newData = {...data, skills: newSkills}
                          setData(newData)
                      }}/>
}

export function SkillSlider({rates, onRateChange}: {
    rates: { base: number, profession: number, interest: number, growth: number, other: number },
    onRateChange: (rates: { profession: number, interest: number }) => void
}) {
    const allRef = useRef<HTMLDivElement>(null)
    const [{width, gridX}, setGridX] = useState({width: 0, gridX: 0})

    const [baseBlocks, professionBlocks, interestBlocks, growthBlocks, otherBlocks] =
        [rates.base / 5, rates.profession / 5, rates.interest / 5, rates.growth / 5, rates.other / 5]

    const pBarPos = {x: (professionBlocks + baseBlocks) * gridX, y: 0}
    const iBarPos = {x: (interestBlocks + professionBlocks + baseBlocks) * gridX, y: 0}

    const pBlockX = (baseBlocks + professionBlocks)
    const iBlockX = (baseBlocks + professionBlocks + interestBlocks)
    const pBlockXMax = 20 - (iBlockX - pBlockX)

    const pBarRef = useRef(null)
    const iBarRef = useRef(null)

    const piOverlap = pBlockX === iBlockX

    function updateGridX() {
        const currentWidth = allRef.current?.clientWidth
        console.log(currentWidth)
        if (currentWidth === undefined) return

        const newGridX = currentWidth / 20

        setGridX({width: currentWidth, gridX: newGridX})

        console.log(pBarPos, iBarPos, currentWidth)
    }

    window.onresize = updateGridX

    useEffect(() => {
        updateGridX()
    }, [allRef.current?.clientWidth])

    function getColor(block: number, includeHover: boolean) {
        if (baseBlocks >= block) return 'bg-zinc-700 ' + (includeHover && 'hover:bg-zinc-600')
        if (pBlockX >= block) return 'bg-blue-300 ' + (includeHover && 'hover:bg-blue-400')
        if (iBlockX >= block) return 'bg-orange-300 ' + (includeHover && 'hover:bg-orange-400')
        else return 'bg-zinc-700 ' + (includeHover && 'hover:bg-zinc-600')
    }

    return <div className="h-12 flex items-center">
        <div className="h-4 w-full grid grid-cols-10 gap-x-1 relative" ref={allRef}>
            <Draggable axis="x" handle=".handle" nodeRef={pBarRef}
                       bounds={{left: baseBlocks * gridX, right: pBlockXMax * gridX}}
                       positionOffset={{x: "-50%", y: 0}} position={pBarPos}
                       onDrag={(e, data) => {
                           console.log(data.x, data.deltaX, gridX, "->", Math.round(data.x / gridX), width, "position", pBarPos)
                           const newPBlocks = Math.round(data.x / gridX) - baseBlocks
                           onRateChange({
                               profession: newPBlocks * 5,
                               interest: (iBlockX - pBlockX) * 5
                           })
                       }}
                       grid={[gridX, 0]}
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
                       bounds={{left: pBlockX * gridX, right: width}}
                       positionOffset={{x: "-50%", y: 0}} position={iBarPos}
                       onDrag={(e, data) => {
                           console.log(data.x, data.deltaX, gridX, "->", Math.round(data.x / gridX), width, "position", iBarRef)
                           onRateChange({
                               profession: (pBlockX - baseBlocks) * 5,
                               interest: (Math.round(data.x / gridX) - pBlockX) * 5
                           })
                       }}
                       grid={[gridX, 0]}
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
                    const thisMaxPoint = it * 2
                    const thisMidPoint = thisMaxPoint - 1

                    const midPoint = pBlockX === thisMidPoint

                    function PointBlock({assignedPoint}: { assignedPoint: number }) {
                        const setAllowed = assignedPoint <= pBlockXMax

                        return <div
                            onClick={setAllowed ? (() => {
                                onRateChange({
                                    profession: (assignedPoint - baseBlocks) * 5,
                                    interest: (iBlockX - pBlockX) * 5
                                })
                            }) : () => {
                            }}
                            className={`cursor-pointer w-1/2 h-full ${getColor(assignedPoint, setAllowed)}`}/>
                    }

                    return <div className={`
                    h-full ${it === 1 && 'rounded-l'} last:rounded-r 
                    flex overflow-hidden relative`}
                                key={it}>
                        <PointBlock assignedPoint={thisMidPoint}/>
                        <PointBlock assignedPoint={thisMaxPoint}/>
                        {
                            !midPoint &&
                            <div
                                className="absolute top-[.2rem] left-[calc(50%-.05rem)] h-[calc(100%-.4rem)] w-[.1rem] rounded-full bg-zinc-800"/>
                        }
                    </div>
                })
            }
        </div>
    </div>
}

export function SkillCategoryEditor(
    {icon, name, type, data, setData, editHook, edit}:
        {
            icon: IconDefinition,
            name
                :
                string,
            type
                :
                SkillCategory,
            data
                :
                InvestigatorSheetDraft,
            setData
                :
                (data: InvestigatorSheetDraft) => void
            editHook?: (editing: boolean) => void
            edit?: boolean
        }) {

    const [skillsDelta, setSkillsDelta] = useState<string[] | undefined>(undefined)
    const skillInfo = Skills[type]
    const addedSkills = data.skills.filter((it: Skill) => it.added && it.category === type)

    function initSkillsDelta() {
        setSkillsDelta(data.skills
            .filter((it: Skill) => it.category === type && it.added)
            .map((it: Skill) => it.name))
    }

    function applySkillsDelta() {
        if (skillsDelta === undefined) return

        const newSkills: Skill[] = data.skills
            .map((it: Skill): Skill => {
                if (it.category === type) return ({
                    ...it,
                    added: skillsDelta.includes(it.name)
                })
                else return it
            })
        const newData = {...data, skills: newSkills}
        setData(newData)
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
                                    <motion.p>{getSkillSum(data, name)}</motion.p>
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
                                            {getSkillSum(data, name)}
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
                                                        data={data}
                                                        setData={setData}
                                                        name={name}/>)
                                        }
                                    </div>
                                    <SkillSlider rates={
                                        {
                                            base: rateBase,
                                            profession: rateProfession,
                                            interest: rateInterest,
                                            growth: rateGrowth,
                                            other: rateOther
                                        }
                                    } onRateChange={({profession, interest}) => {
                                        console.log(profession, interest)
                                        const newSkills = data.skills.map((it: Skill) => {
                                            if (it.name === name) return {
                                                ...it,
                                                rateProfession: profession,
                                                rateInterest: interest
                                            }
                                            else return it
                                        })
                                        const newData = {...data, skills: newSkills}
                                        setData(newData)
                                    }}/>
                                </motion.div>
                            })}</div>
                    </LayoutGroup>)
            )
        }
    </div>
}