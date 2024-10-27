import {useEffect, useState} from "react";
import {Button, IconButton, InputAdornment, styled, TextField} from "@mui/material";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faBookSparkles,
    faBriefcase,
    faCalendarDay,
    faCircleInfo,
    faClover,
    faCropSimple,
    faFaceSmile,
    faGlobeStand,
    faHandFist,
    faHandHoldingMagic,
    faHeadSideBrain,
    faHeartPulse,
    faHouseUser,
    faImagePolaroidUser,
    faLeft,
    faPersonFallingBurst,
    faPersonRunningFast,
    faRight,
    faRulerVertical,
    faSquareDashed,
    faTrashXmark,
    faUpFromBracket,
    faUser,
    faUserGraduate
} from "@awesome.me/kit-ae9e2bd1c8/icons/classic/solid";
import {IconDefinition} from "@fortawesome/fontawesome-svg-core";
import {fetchD} from "@/libs/bcdice-fetch";
import {getParam, InvestigatorSheetDraft} from "@/libs/investigator";
import {SkillsSection} from "@/components/investigator-creator/sections";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/stores/store";
import {setDraft as setDraftAction} from "@/stores/chara-slice";

function InfoTextField({label, icon, fullWidth, property}: {
    label: string,
    icon: IconDefinition,
    fullWidth?: boolean,
    property: keyof InvestigatorSheetDraft
}) {
    const dispatch = useDispatch()
    const draft = useSelector((state: RootState) => state.chara.draft)

    return <TextField label={label} size="small" fullWidth={fullWidth}
                      InputProps={icon && {
                          endAdornment: <InputAdornment position="end">
                              <FontAwesomeIcon icon={icon}/>
                          </InputAdornment>
                      }}
                      value={draft[property] ?? ""}
                      onChange={event => {
                          const value = event.target.value
                          const newData = {...draft}
                          newData[property] = (value === "" ? undefined : value) as never
                          dispatch(setDraftAction(newData))
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
    //const [data, setData] = useState<InvestigatorSheetDraft>(initialDraft)
    const dispatch = useDispatch()
    const draft = useSelector((state: RootState) => state.chara.draft)
    const setDraft = (data: InvestigatorSheetDraft) => dispatch(setDraftAction(data))

    const [paramRollError, setParamRollError] = useState<string | undefined>(undefined)

    function changeParam(label: string, value: string) {
        const newValue = value.replace(/[^0-9]/g, "");
        const unchanged = draft.params.filter((it: {
            name: string,
            value: number
        }) => it.name !== label)

        const newParams = [...unchanged, {name: label, value: parseInt(newValue)}]

        const newData = {...draft, params: newValue === "" ? unchanged : newParams}
        setDraft(newData)
    }

    const {base, game} = useSelector((state: RootState) => state.bcdice);

    const [fortuneValue, setFortuneValue] = useState<number | undefined>(undefined)

    function fetchFortune() {
        fetchD(base, game, "3D6").then(d => setFortuneValue(d ? d.value * 5 : undefined))
    }

    useEffect(() => {
        fetchFortune()
    }, []);

    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 0,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        width: 0,
    });

    const [imageFile, setImageFile] = useState<File | undefined>(undefined)
    const [imageIndex, setImageIndex] = useState<number>(0)
    const [imageContain, setImageContain] = useState<boolean>(true)

    useEffect(() => {
        if (!imageFile) return

        const reader = new FileReader()
        reader.onload = () => {
            if (!reader.result) return
            const newData = {...draft, icons: [...draft.icons, reader.result.toString()]}
            setDraft(newData)
            setImageIndex(newData.icons.length - 1)
        }
        reader.readAsDataURL(imageFile)
    }, [imageFile]);


    return <div className="@container">
        <h1 className="text-2xl font-bold mb-4">探索者作成</h1>
        {/*<div>*/}
        {/*    {JSON.stringify(data)}*/}
        {/*</div>*/}
        <div className="flex gap-x-4 mb-4">
            <div className="w-36 h-fit flex flex-col gap-y-1 rounded-xl overflow-hidden">
                <div
                    className="h-48 bg-zinc-800 rounded-md flex flex-col justify-center items-center gap-y-2 relative">
                    {
                        draft.icons.length === 0 && [
                            <FontAwesomeIcon key="0" icon={faImagePolaroidUser} className="text-4xl text-zinc-500"/>,
                            <Button key="1" component="label">
                                <VisuallyHiddenInput type="file"
                                                     onChange={e => setImageFile(e.target.files?.item(0) ?? undefined)}
                                                     accept="image/png, image/jpeg"/>
                                アップロード
                            </Button>,
                            <div key="2"
                                 className="absolute w-[calc(100%-2rem)] h-full border-x border-dashed border-zinc-600 pointer-events-none"/>,
                            <div key="3"
                                 className="absolute w-full h-[calc(100%-2rem)] border-y border-dashed border-zinc-600 pointer-events-none"/>
                        ]
                    }
                    {
                        draft.icons.length > 0 &&
                        <img src={draft.icons[imageIndex]}
                             alt="探索者のアイコン"
                             className={`w-full h-full ${imageContain ? 'object-contain' : 'object-cover'}`}/>
                    }
                </div>
                <div className="flex justify-around">
                    <button className="grow group hover:bg-zinc-800 rounded-md transition-colors"
                            disabled={draft.icons.length === 0 || imageIndex <= 0}
                            onClick={() => setImageIndex(imageIndex - 1)}>
                        <FontAwesomeIcon icon={faLeft}
                                         className="text-blue-300 group-disabled:text-zinc-500 group-active:scale-95 transition-all"/>
                    </button>
                    <button className="grow group hover:bg-zinc-800 rounded-md transition-colors"
                            onClick={() => setImageContain(!imageContain)}>
                        <FontAwesomeIcon icon={imageContain ? faSquareDashed : faCropSimple}
                                         className="text-blue-300 group-disabled:text-zinc-500 group-active:scale-95 transition-all"/>
                    </button>
                    <button className="grow group hover:bg-zinc-800 rounded-md transition-colors"
                            disabled={draft.icons.length === 0 || imageIndex + 1 >= draft.icons.length}
                            onClick={() => setImageIndex(imageIndex + 1)}>
                        <FontAwesomeIcon icon={faRight}
                                         className="text-blue-300 group-disabled:text-zinc-500 group-active:scale-95 transition-all"/>
                    </button>
                </div>
                <div className="flex justify-around">
                    <label role="button"
                           className="grow group hover:bg-zinc-800 rounded-md transition-colors flex justify-center items-center">
                        <VisuallyHiddenInput type="file"
                                             onChange={e => setImageFile(e.target.files?.item(0) ?? undefined)}
                                             accept="image/png, image/jpeg"/>
                        <FontAwesomeIcon icon={faUpFromBracket}
                                         className="text-blue-300 group-active:scale-95 transition-all"/>
                    </label>
                    <button className="grow group hover:bg-zinc-800 rounded-md transition-colors"
                            disabled={draft.icons.length === 0}
                            onClick={() => {
                                const newData = {
                                    ...draft,
                                    icons: draft.icons.filter((_, index) => index !== imageIndex)
                                }
                                setImageIndex(imageIndex === 0 ? 0 : imageIndex - 1)
                                setDraft(newData)
                            }}>
                        <FontAwesomeIcon icon={faTrashXmark}
                                         className="text-blue-300 group-disabled:text-zinc-500 group-active:scale-95 transition-all"/>
                    </button>
                </div>
            </div>
            <div className="w-[calc(100%-10rem)] flex flex-col gap-y-2">
                <TextField label="名前" fullWidth value={draft["name"] ?? ""} onChange={event => {
                    const value = event.target.value
                    const newData = {...draft}
                    newData["name"] = value === "" ? undefined : value
                    setDraft(newData)
                }}/>
                <TextField label="読み" size="small" fullWidth value={draft["read"] ?? ""} onChange={event => {
                    const value = event.target.value
                    const newData = {...draft}
                    newData["read"] = value === "" ? undefined : value
                    setDraft(newData)
                }}/>
                <InfoTextField label="職業" icon={faBriefcase} property="profession"/>
                <div className="flex gap-x-2">
                    <InfoTextField label="年齢" icon={faCalendarDay} property="age"/>
                    <InfoTextField label="性別" icon={faUser} property="gender"/>
                </div>
                <InfoTextField label="出身" icon={faGlobeStand} property="origin"/>
                <InfoTextField label="住所" icon={faHouseUser} property="address"/>
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
                const newData = {...draft, params: newParams.filter(it => it !== undefined)}
                setDraft(newData)
            })
        }}>
            ランダム {paramRollError}
        </Button>
        <Button onClick={() => {
            setDraft({...draft, params: []})
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
                                   value={draft.params.find((it: {
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
                        const siz = getParam(draft, "SIZ")
                        const con = getParam(draft, "CON")
                        if (siz === undefined || con === undefined) return undefined
                        return Math.floor((siz + con) / 10)
                    })()
                }, {
                    label: "MP",
                    icon: faBookSparkles,
                    equalTo: "= POW/5",
                    formula: (() => {
                        const pow = getParam(draft, "POW")
                        return pow !== undefined ? pow / 5 : undefined
                    })()
                }, {
                    label: "SAN",
                    icon: faHeadSideBrain,
                    equalTo: "= POW",
                    formula: getParam(draft, "POW")
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
        <SkillsSection/>
    </div>
}