import {useState} from "react";
import {Button, IconButton, InputAdornment, TextField} from "@mui/material";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faBinoculars,
    faBooks,
    faBookSparkles,
    faBriefcase,
    faCalendarDay,
    faCameraRetro,
    faCircleInfo,
    faClover,
    faComments,
    faFaceSmile,
    faGlobeStand,
    faHandFist,
    faHandHoldingMagic,
    faHeadSideBrain,
    faHeartPulse,
    faHouseUser,
    faPersonFallingBurst,
    faPersonRunning,
    faPersonRunningFast,
    faRulerVertical,
    faUser,
    faUserGraduate
} from "@awesome.me/kit-ae9e2bd1c8/icons/classic/solid";
import {IconDefinition} from "@fortawesome/fontawesome-svg-core";
import {isBCDiceResult} from "@/libs/bcdice-fetch";
import {getD} from "@/libs/commands/sum-dices";
import {
    actionSkills,
    combatSkills,
    communicationSkills,
    investigationSkills,
    knowledgeSkills,
    Skill,
    SkillInfo,
    skills,
    SkillType
} from "@/libs/chara";
import {SkillCategoryEditor} from "@/components/investigator-creator-lib";

function InfoTextField({label, icon, fullWidth, property, data, setData}: {
    label: string,
    icon: IconDefinition,
    fullWidth?: boolean,
    property: string,
    data: any,
    setData: (data: any) => void
}) {
    return <TextField label={label} size="small" fullWidth={fullWidth}
                      InputProps={icon && {
                          endAdornment: <InputAdornment position="end">
                              <FontAwesomeIcon icon={icon}/>
                          </InputAdornment>
                      }}
                      value={data[property]}
                      onChange={event => {
                          const value = event.target.value
                          const newData = {...data}
                          newData[property] = value === "" ? undefined : value
                          setData(newData)
                      }}/>
}

const params = [
    {
        label: "STR",
        icon: faHandFist,
        command: "3D6"
    },
    {
        label: "DEX",
        icon: faPersonRunningFast,
        command: "3D6"
    },
    {
        label: "INT",
        icon: faHeadSideBrain,
        command: "2D6+6"
    },
    {
        label: "CON",
        icon: faPersonFallingBurst,
        command: "3D6"
    },
    {
        label: "APP",
        icon: faFaceSmile,
        command: "3D6"
    },
    {
        label: "POW",
        icon: faHandHoldingMagic,
        command: "3D6"
    },
    {
        label: "SIZ",
        icon: faRulerVertical,
        command: "2D6+6"
    },
    {
        label: "EDU",
        icon: faUserGraduate,
        command: "2D6+6"
    }
]

export function InvestigatorCreator() {
    const [data, setData] = useState<any>({
        name: undefined,
        read: undefined,
        profession: undefined,
        age: undefined,
        gender: undefined,
        address: undefined,
        origin: undefined,
        status: [],
        params: [],
        skills: [...skills.map(({name, rateBase, type}): Skill => {
            return {
                added: false,
                name,
                type,
                rateBase,
                rateProfession: 0,
                rateInterest: 0,
                rateGrowth: 0,
                rateOther: 0
            }
        })]
    })

    const [paramRollError, setParamRollError] = useState<string | undefined>(undefined)

    function changeParam(label: string, value: string) {
        const newValue = value.replace(/[^0-9]/g, "");
        const unchanged = data.params.filter((it: {
            name: string,
            value: number
        }) => it.name !== label)

        const newParams = [...unchanged, {name: label, value: parseInt(newValue)}]

        const newData = {...data, params: newValue === "" ? unchanged : newParams}
        setData(newData)
    }

    return <div className="@container">
        <h1 className="text-2xl font-bold mb-4">探索者作成</h1>
        <div>
            {JSON.stringify(data)}
        </div>
        <div className="flex gap-x-4 mb-4">
            <div
                className="w-36 h-48 bg-zinc-800 rounded-xl flex flex-col justify-center items-center gap-y-2 relative">
                <FontAwesomeIcon icon={faCameraRetro} className="text-4xl text-zinc-500"/>
                <Button>
                    アップロード
                </Button>
                <div
                    className="absolute w-[calc(100%-2rem)] h-full border-x border-dashed border-zinc-600 pointer-events-none">
                </div>
                <div
                    className="absolute w-full h-[calc(100%-2rem)] border-y border-dashed border-zinc-600 pointer-events-none">
                </div>
            </div>
            <div className="w-[calc(100%-10rem)] flex flex-col gap-y-2">
                <TextField label="名前" fullWidth value={data["name"]} onChange={event => {
                    const value = event.target.value
                    const newData = {...data}
                    newData["name"] = value === "" ? undefined : value
                    setData(newData)
                }}/>
                <TextField label="読み" size="small" fullWidth value={data["read"]} onChange={event => {
                    const value = event.target.value
                    const newData = {...data}
                    newData["read"] = value === "" ? undefined : value
                    setData(newData)
                }}/>
                <InfoTextField label="職業" icon={faBriefcase} property="profession" data={data} setData={setData}/>
                <div className="flex gap-x-2">
                    <InfoTextField label="年齢" icon={faCalendarDay} property="age" data={data} setData={setData}/>
                    <InfoTextField label="性別" icon={faUser} property="gender" data={data} setData={setData}/>
                </div>
                <InfoTextField label="出身" icon={faGlobeStand} property="origin" data={data} setData={setData}/>
                <InfoTextField label="住所" icon={faHouseUser} property="address" data={data} setData={setData}/>
            </div>
        </div>
        <Button onClick={() => {
            const newParams = params.map(async ({label, command}) => {
                const data = await (await fetch(`https://bcdice.onlinesession.app/v2/game_system/Cthulhu7th/roll?command=${encodeURIComponent(command)}`)).json()

                if (isBCDiceResult(data)) {
                    const d = getD(command, data)
                    if (d === undefined) {
                        setParamRollError("Unknown Error")
                        return undefined
                    }

                    return {name: label, value: d.value * 5}
                }

                return undefined
            })

            Promise.all(newParams).then((newParams) => {
                console.log(newParams)
                const newData = {...data, params: newParams}
                setData(newData)
            })
        }}>
            ランダム {paramRollError}
        </Button>
        <Button onClick={() => {
            setData({...data, params: []})
        }}>
            クリア
        </Button>
        <div className="grid grid-cols-2 @md:grid-cols-3 @lg:grid-cols-4 gap-2 overflow-hidden rounded-xl mb-4">
            {
                params.map(({label, icon}) => {
                    return <div className="rounded-md p-2 bg-zinc-800">
                        <div className="flex justify-between mb-2 pl-1">
                            <p className="text-lg font-bold text-nowrap">
                                <FontAwesomeIcon icon={icon} className="mr-2 aspect-square"/>{label}
                            </p>
                            <IconButton aria-label={`${label} とは？`} size="small">
                                <FontAwesomeIcon icon={faCircleInfo} className="text-zinc-500"/>
                            </IconButton>
                        </div>

                        <TextField size="small"
                                   value={data.params.find((it: {
                                       name: string,
                                       value: number
                                   }) => it.name === label)?.value ?? ""}
                                   onChange={event =>
                                       changeParam(label, event.target.value)}/>
                    </div>
                })
            }
        </div>
        <div className="grid grid-cols-2 @lg:grid-cols-4 gap-2 overflow-hidden rounded-xl mb-4">
            {
                [
                    {
                        label: "HP",
                        icon: faHeartPulse,
                        equalTo: "= (SIZ + CON) / 10"
                    },
                    {
                        label: "MP",
                        icon: faBookSparkles,
                        equalTo: "= POW/5"
                    },
                    {
                        label: "SAN",
                        icon: faHeadSideBrain,
                        equalTo: "= POW"
                    },
                    {
                        label: "幸運",
                        icon: faClover,
                        equalTo: "= 3D6 * 5"
                    }
                ].map(({label, icon, equalTo}) => {
                    return <div className="rounded-md p-2 pt-1 bg-zinc-800">
                        <div className="flex justify-between items-end">
                            <p className="text-lg font-bold pl-1 text-nowrap">
                                <FontAwesomeIcon icon={icon} className="mr-2 aspect-square"/>{label}
                            </p>
                            <p className="font-black text-3xl">
                                12
                            </p>
                        </div>
                        <p className="text-zinc-500 text-xs">{equalTo}</p>
                    </div>
                })
            }
        </div>
        <div className="flex flex-col gap-y-4">
            {
                ([
                    {icon: faHandFist, name: "戦闘技能", type: "combat", skillInfo: combatSkills},
                    {icon: faBinoculars, name: "探索技能", type: "investigation", skillInfo: investigationSkills},
                    {icon: faPersonRunning, name: "行動技能", type: "action", skillInfo: actionSkills},
                    {icon: faComments, name: "交渉技能", type: "communication", skillInfo: communicationSkills},
                    {icon: faBooks, name: "知識技能", type: "knowledge", skillInfo: knowledgeSkills}
                ] as { icon: IconDefinition, name: string, type: SkillType, skillInfo: SkillInfo[] }[])
                    .map(({icon, name, type, skillInfo}) => (
                        <SkillCategoryEditor
                            key={type}
                            icon={icon}
                            name={name}
                            type={type}
                            skillInfo={skillInfo}
                            data={data}
                            setData={setData}
                        />
                    ))
            }
        </div>

    </div>
}