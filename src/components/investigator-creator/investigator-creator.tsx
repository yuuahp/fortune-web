import {useEffect, useState} from "react";
import {Button, IconButton, InputAdornment, TextField} from "@mui/material";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faBookSparkles,
    faBriefcase,
    faCalendarDay,
    faCameraRetro,
    faCircleInfo,
    faClover,
    faFaceSmile,
    faGlobeStand,
    faHandFist,
    faHandHoldingMagic,
    faHeadSideBrain,
    faHeartPulse,
    faHouseUser,
    faPersonFallingBurst,
    faPersonRunningFast,
    faRulerVertical,
    faUser,
    faUserGraduate
} from "@awesome.me/kit-ae9e2bd1c8/icons/classic/solid";
import {IconDefinition} from "@fortawesome/fontawesome-svg-core";
import {fetchD} from "@/libs/bcdice-fetch";
import {getParam, InvestigatorSheetDraft, Skill} from "@/libs/investigator";
import {Skills} from "@/libs/investigator/skills";
import {SkillsSection} from "@/components/investigator-creator/sections";
import {useSelector} from "react-redux";
import {RootState} from "@/stores/store";

function InfoTextField({label, icon, fullWidth, property, data, setData}: {
    label: string,
    icon: IconDefinition,
    fullWidth?: boolean,
    property: keyof InvestigatorSheetDraft,
    data: InvestigatorSheetDraft,
    setData: (data: InvestigatorSheetDraft) => void
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
                          newData[property] = (value === "" ? undefined : value) as never
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
    const [data, setData] = useState<InvestigatorSheetDraft>({
        name: undefined,
        read: undefined,
        profession: undefined,
        age: undefined,
        gender: undefined,
        address: undefined,
        origin: undefined,
        status: [],
        params: [],
        skills: [...Skills.all.map(({name, rateBase, category}): Skill => {
            return {
                added: false,
                name,
                category: category,
                rateBase,
                rateProfession: 0,
                rateInterest: 0,
                rateGrowth: 0,
                rateOther: 0
            }
        })],
        commands: [],
        icons: []
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

    const {base, game} = useSelector((state: RootState) => state.bcdice);

    const [fortuneValue, setFortuneValue] = useState<number | undefined>(undefined)

    function fetchFortune() {
        fetchD(base, game, "3D6").then(d => setFortuneValue(d ? d.value * 5 : undefined))
    }

    useEffect(() => {
        fetchFortune()
    }, []);

    return <div className="@container">
        <h1 className="text-2xl font-bold mb-4">探索者作成</h1>
        {/*<div>*/}
        {/*    {JSON.stringify(data)}*/}
        {/*</div>*/}
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
                const d = await fetchD(base, game, command)

                if (d) {
                    return {name: label, value: d.value * 5}
                } else return undefined
            })

            Promise.all(newParams).then((newParams) => {
                const newData = {...data, params: newParams.filter(it => it !== undefined)}
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
                    return <div className="rounded-md p-2 bg-zinc-800" key={label}>
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
                [{
                    label: "HP",
                    icon: faHeartPulse,
                    equalTo: "= (SIZ + CON) / 10",
                    formula: (() => {
                        const siz = getParam(data, "SIZ")
                        const con = getParam(data, "CON")
                        if (siz === undefined || con === undefined) return undefined
                        return Math.floor((siz + con) / 10)
                    })()
                }, {
                    label: "MP",
                    icon: faBookSparkles,
                    equalTo: "= POW/5",
                    formula: (() => {
                        const pow = getParam(data, "POW")
                        return pow !== undefined ? pow / 5 : undefined
                    })()
                }, {
                    label: "SAN",
                    icon: faHeadSideBrain,
                    equalTo: "= POW",
                    formula: getParam(data, "POW")
                }, {
                    label: "幸運",
                    icon: faClover,
                    equalTo: "= 3D6 * 5",
                    formula: fortuneValue
                }].map(({label, icon, equalTo, formula}: {
                    label: string,
                    icon: IconDefinition,
                    equalTo: string,
                    formula: number | undefined
                }) => <div className="rounded-md p-2 pt-1 bg-zinc-800" key={label}>
                    <div className="flex justify-between items-end">
                        <p className="text-lg font-bold pl-1 text-nowrap">
                            <FontAwesomeIcon icon={icon} className="mr-2 aspect-square"/>{label}
                        </p>
                        <p className="font-black text-3xl">{formula ?? "##"}</p>
                    </div>
                    <div className="flex justify-between flex-wrap gap-1">
                        <p className="text-zinc-500 text-xs">{equalTo}</p>
                        {
                            label === "幸運" &&
                            <div onClick={fetchFortune}
                                 className="
                                 bg-blue-300 text-zinc-800 font-bold rounded-full text-xs px-2 cursor-pointer select-none
                                 ">
                                ランダム
                            </div>
                        }
                    </div>

                </div>)
            }
        </div>
        <SkillsSection data={data} setData={setData}/>
    </div>
}