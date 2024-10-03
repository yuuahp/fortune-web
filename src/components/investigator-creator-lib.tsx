import {Skill, SkillInfo, SkillCategory} from "@/libs/investigator";
import {TextField} from "@mui/material";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEquals, faPlusCircle} from "@awesome.me/kit-ae9e2bd1c8/icons/classic/solid";
import {useState} from "react";
import {IconDefinition} from "@fortawesome/fontawesome-svg-core";
import {Skills} from "@/libs/investigator/skills";

export type SkillPointType = "profession" | "interest" | "growth" | "other"

export function SkillPointInput({className, rate, type, data, setData, name}: {
    className?: string,
    rate: number,
    type: SkillPointType,
    data: any,
    setData: (data: any) => void,
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

    return <TextField label={typeJP} size="small" className={className}
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

export function SkillCategoryEditor({icon, name, type, skillInfo, data, setData}: {
    icon: IconDefinition,
    name: string,
    type: SkillCategory,
    skillInfo: SkillInfo[],
    data: any,
    setData: (data: any) => void
}) {
    const [skillsDelta, setSkillsDelta] = useState<string[] | undefined>(undefined)

    return <div className="rounded-xl overflow-hidden">
        <div className="flex items-center bg-zinc-950 px-4 py-1 text-lg gap-x-2 font-bold mb-2 rounded-md">
            <FontAwesomeIcon icon={icon}/>{name}
        </div>
        <div className="grid grid-cols-1 @xl:grid-cols-2 gap-2">
            <div className="
                    bg-zinc-950 rounded-md flex gap-y-2 items-center justify-center flex-col
                    cursor-pointer hover:bg-zinc-800 transition-all active:scale-95 select-none
                    py-2"
                 onClick={() => {
                     if (skillsDelta === undefined)
                         setSkillsDelta(data.skills
                             .filter((it: Skill) => it.category === type && it.added)
                             .map((it: Skill) => it.name))
                     else {
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
                 }}>
                <FontAwesomeIcon icon={faPlusCircle} className="text-2xl"/>
                <p className="">技能を追加</p>
            </div>
            {
                skillsDelta
                    ? skillInfo.map(({name, icon}) => {
                        const added = skillsDelta.includes(name)
                        return <div className={`
                                border border-transparent ${added ? 'border-zinc-700' : 'text-zinc-500'} 
                                flex items-center gap-x-2 rounded-md bg-zinc-800 px-2 py-1 transition-all cursor-pointer`}
                                    onClick={() => {
                                        if (added) setSkillsDelta(skillsDelta.filter(it => it !== name))
                                        else setSkillsDelta([...skillsDelta, name])
                                    }}>
                            <FontAwesomeIcon icon={icon} className="text-xl aspect-square"/>
                            <p className={`text-nowrap truncate w-24`}>{name}</p>
                        </div>
                    })
                    : data.skills.filter((it: Skill) => it.added && it.category === type)
                        .map(({name, rateBase, rateProfession, rateInterest, rateGrowth, rateOther}: Skill) => {
                            const skillInfo = Skills.all.find(it => it.name === name)!!

                            const otherCommand = typeof rateOther === "string"

                            if (otherCommand) {
                                return <div></div>
                            } else return <div className="flex flex-col gap-y-2 rounded-md bg-zinc-800 p-2" key={name}>
                                <div className="flex items-center">
                                    <FontAwesomeIcon icon={skillInfo.icon} className="text-xl mr-2 aspect-square"/>
                                    <p className="text-nowrap truncate">{name}</p>
                                </div>
                                <div className="flex gap-2 items-center flex-wrap">
                                    <div
                                        className="bg-zinc-700 rounded text-xl font-bold aspect-square h-8 flex items-center justify-center">
                                        {rateBase + rateProfession + rateInterest + rateGrowth + rateOther}
                                    </div>
                                    <FontAwesomeIcon icon={faEquals}/>
                                    <TextField label="初期値" size="small" className="w-16" value={rateBase}
                                               disabled/>
                                    {
                                        ([
                                            [rateProfession, "profession"],
                                            [rateInterest, "interest"],
                                            [rateGrowth, "growth"],
                                            [rateOther, "other"]
                                        ] as [number, SkillPointType][])
                                            .map(([rate, type]) => {
                                                return <SkillPointInput
                                                    key={type}
                                                    className="w-16"
                                                    rate={rate}
                                                    type={type}
                                                    data={data}
                                                    setData={setData}
                                                    name={name}/>
                                            })
                                    }
                                </div>
                            </div>
                        })
            }
        </div>
    </div>
}