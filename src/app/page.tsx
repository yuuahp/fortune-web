"use client";

import {createTheme, CssBaseline, IconButton, InputAdornment, TextField, ThemeProvider} from "@mui/material";
import {ChangeEvent, useEffect, useRef, useState} from "react";
import useSWRMutation from "swr/mutation";
import {faCaretRight, faPaperPlane, faRotate} from "@awesome.me/kit-ae9e2bd1c8/icons/classic/solid";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {getCC, getD, getFormattedCommand, getTexts} from "@/utils/analyze-command";
import {BCDiceResponse, BCDiceResult, isBCDiceError, isBCDiceResult} from "@/utils/bcdice-response";
import {lastOf} from "@/utils/utils";

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

// todo move widgets under history & create dedicated area for display characters

const fetcher = (
    url: string,
    {arg}: { arg: string }
) => fetch(`${url}?command=${encodeURIComponent(arg)}`).then(res => res.json())

export default function Home() {
    const historyBlock = useRef<HTMLDivElement>(null)

    const [textField, setTextField] = useState<string>("");
    const diceCommand = useRef<string>("");

    const [history, setHistory] = useState<{ command: string, result: BCDiceResult }[]>([]);

    const errorPreviously = useRef<boolean>(false)
    const errorMessage = useRef<string>("")

    const {
        trigger
    } = useSWRMutation<BCDiceResponse>(
        `https://bcdice.onlinesession.app/v2/game_system/Cthulhu7th/roll`,
        fetcher, {
            onSuccess: data => {
                if (isBCDiceResult(data)) {
                    errorPreviously.current = false
                    setHistory([...history, {command: diceCommand.current, result: data}]);
                } else if (isBCDiceError(data)) {
                    errorPreviously.current = true
                    errorMessage.current = `${diceCommand.current} - ${data.reason}`
                } else {
                    errorPreviously.current = true
                    errorMessage.current = "Unknown Error"
                }

                setTextField("");
            },
            onError: () => {
                errorPreviously.current = true
                errorMessage.current = "Request to BCDice API failed"
                setTextField("");
            }
        }
    )

    function roll() {
        if (textField === "") return;

        diceCommand.current = textField

        // @ts-ignore
        trigger(textField).then();
    }

    function reroll() {
        if (history.length === 0) return;

        const lastCommand = history[history.length - 1].command;

        diceCommand.current = lastCommand

        // @ts-ignore
        trigger(lastCommand).then();
    }

    const endHistory = useRef<HTMLDivElement>(null)

    useEffect(() => {
        endHistory?.current?.scrollIntoView({
            behavior: "smooth"
        })
    }, [history])

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline/>
            <main className="bg-zinc-950 flex flex-col-reverse gap-8 md:flex-row w-screen h-screen p-8">
                <div className="w-full md:w-1/2 h-1/2 md:h-full">
                    <div className="flex flex-col gap-y-2 mb-8 h-[calc(100%-2rem-56px)] overflow-y-scroll"
                         ref={historyBlock}>
                        {
                            history.map((entry, index) => {
                                return <HistoryEntry command={entry.command} result={entry.result} key={index}
                                                     active={history.length === index + 1}/>
                            })
                        }
                        <div ref={endHistory}></div>
                    </div>

                    <TextField label="Dice Command" variant="outlined" fullWidth
                               className="h-[56px]"
                               error={errorPreviously.current}
                               helperText={errorPreviously.current ? errorMessage.current : ""}
                               InputProps={{
                                   endAdornment:
                                       <InputAdornment position="end">
                                           <IconButton aria-label="reroll most prevous dice"
                                                       onClick={() => reroll()}
                                                       disabled={history.length === 0}>
                                               <FontAwesomeIcon icon={faRotate}/>
                                           </IconButton>
                                           <IconButton aria-label="roll dice"
                                                       onClick={() => roll()}
                                                       disabled={textField === ""}>
                                               <FontAwesomeIcon icon={faPaperPlane}/>
                                           </IconButton>
                                       </InputAdornment>
                               }}
                               value={textField}
                               onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                   setTextField(event.target.value);
                               }}
                               onKeyDown={
                                   (event) => {
                                       if (event.key === "Enter" && textField !== "") {
                                           roll();
                                       }
                                   }
                               }
                    />
                </div>
                <div className="
                    w-full md:w-1/2 h-1/2 md:h-full p-4
                    bg-zinc-900 rounded-2xl
                ">
                    <Widget entry={history[history.length - 1]} className="w-full h-full"/>
                </div>
            </main>
        </ThemeProvider>
    );
}

function CCRollBar({className, meterColor, border, value, range, critical, fumble}: {
    className?: string,
    meterColor?: string,
    border?: number,
    value: number,
    range: [number, number],
    critical: boolean,
    fumble: boolean
}) {

    const barAll = useRef<HTMLDivElement>(null)
    const percentage =
        critical ? 0 : (
            fumble ? 100 : (
                ((((barAll?.current?.clientWidth || 0) - (2 * 16)) * (value / (range[0] - range[1])) + 16) / (barAll?.current?.clientWidth || 0)) * 100
            )
        )
    const borderRate = border ? border / (range[0] - range[1]) * 100 : undefined;

    const successRangeWidth = borderRate ? (borderRate >= 100 ? 100 : borderRate) : 0
    const normalRangeWidth = 100 - (borderRate || 0)

    return (
        <div ref={barAll}
             className={"h-3 flex gap-x-1 rounded-full relative " + className}>
            <div // meter
                className={`w-4 h-[1.75rem] rounded-full bg-green-300 absolute border-[.25rem] border-zinc-900 -top-2 transition-all ${meterColor}`}
                style={{left: `calc(${percentage}% - 0.5rem)`}}>
            </div>
            <div data-name="critical or min"
                 className="w-4 bg-yellow-900 rounded-l-full"></div>
            {
                (borderRate && successRangeWidth > 0) &&
                <div className="h-full bg-green-900 transition-all"
                     style={{width: `calc(${successRangeWidth}% - 1rem)`}}></div>
            }
            {
                (normalRangeWidth > 0) &&
                <div className="h-full bg-zinc-800 transition-all"
                     style={{width: `calc(${normalRangeWidth}% - 1rem)`}}></div>
            }
            <div data-name="fumble or max"
                 className="w-4 bg-red-900 rounded-r-full"></div>
        </div>
    )
}

function HistoryEntry({command, result, active, toggleActive}: {
    command: string,
    result: BCDiceResult,
    active: boolean,
    toggleActive?: () => void
}) {
    const elements = [command, ...(result.text?.split(" ＞ ") || [])]
    return (
        <div
            className={`group p-2 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 rounded-2xl transition-colors duration-200 flex flex-col gap-y-2 ${active && '!border-zinc-800 bg-zinc-900'}`}
            onClick={() => {
                active = !active
            }}>
            <div className={`flex ${active && 'pl-1'}`}>
                {
                    active &&
                    <div className="py-1 h-full mr-1">
                        <div className={`h-full w-2 bg-red-500 rounded-full`}></div>
                    </div>
                }
                <div className="flex gap-x-2 flex-wrap px-2">
                    {
                        elements.map((text, index) => {
                            if (index === 0)
                                return (
                                    <p key={index} className="text-nowrap">
                                        {
                                            !active &&
                                            <FontAwesomeIcon className="text-red-500 mr-2" icon={faCaretRight}/>
                                        }
                                        <span
                                            className={`text-zinc-700 group-hover:text-zinc-600 ${active && '!text-zinc-600'}`}>{text}</span>
                                    </p>
                                )

                            return (
                                <p key={index} className="text-nowrap">
                                    <FontAwesomeIcon className="text-zinc-700 mr-2" icon={faCaretRight}/>
                                    <span>{text}</span>
                                </p>
                            )
                        })
                    }
                </div>
            </div>

            {
                active &&
                <div className="w-full h-20 flex gap-x-2">
                    <div className="h-20 w-20 inline-flex flex-col">
                        <div
                            className="h-[3.25rem] w-20 mb-1 flex justify-center items-center bg-zinc-950 border border-zinc-800 rounded-t-lg rounded-b-md text-4xl font-bold">
                            99
                            {/*TODO: display actual value*/}
                        </div>
                        <div
                            className="h-[calc(100%-3.25rem-.25rem)] flex justify-center items-center bg-zinc-950 border border-zinc-800 rounded-b-lg rounded-t-md text-sm font-bold">
                            FUMBLE
                        </div>
                    </div>
                    <div className="h-20 pl-2 py-2">
                        <div>
                            <span>FOT</span>
                            {/*TODO: use fortune point*/}
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

function Widget({entry, className}: { entry?: { command: string, result: BCDiceResult }, className?: string }) {

    const cc = entry ? getCC(entry.command, entry.result) : null
    const d = entry ? getD(entry.command, entry.result) : null

    const getPrimaryText = () => {
        if (entry) {
            const command = getFormattedCommand(entry.result)
            const texts = getTexts(entry.result)

            if (command.startsWith("choice")) {
                return lastOf(texts)!! // chosen value
            } else if (cc) {
                return cc.value
            } else if (d) {
                return d.value
            } else {
                return texts.findLast((value: string) => !isNaN(parseInt(value))) || lastOf(texts) || "(. _. )";
            }
        } else {
            return "(. _. )"
        }
    }

    const primaryText = getPrimaryText()

    const getRange = () => {
        if (cc) {
            return cc.range
        } else if (d) {
            return d.range
        } else {
            return null
        }
    }

    const range = getRange()

    function getSubText(): [string, string, string] {
        if (cc) {
            switch (cc.result) {
                case "CRITICAL":
                    return ["CRITICAL", "text-green-500", "bg-green-500"]
                case "EXTREME":
                    return ["EXTREME SUCCESS", "text-green-500", "bg-green-500"]
                case "HARD":
                    return ["HARD SUCCESS", "text-green-500", "bg-green-500"]
                case "REGULAR":
                    return ["REGULAR SUCCESS", "text-green-500", "bg-green-500"]
                case "FAILURE":
                    return ["FAILURE", "text-zinc-500", "bg-zinc-500"]
                case "FUMBLE":
                    return ["FUMBLE", "text-red-500", "bg-red-500"]
                default:
                    return ["UNKNOWN", "text-zinc-700", "bg-zinc-700"]
            }
        } else if (d) {
            return [`${d[0]} (${d[1]})`, "text-zinc-700", "bg-zinc-700"]
        } else {
            return ["ROLL NOW", "text-zinc-700", "bg-zinc-700"]
        }
    }

    const value = cc?.value || 0
    const border = cc?.rate || undefined
    const critical = cc?.result === "CRITICAL"
    const fumble = cc?.result === "FUMBLE"

    const [subText, textColorClass, bgColorClass] = getSubText()

    return (
        <div className={"flex flex-col items-center justify-center gap-y-4 " + className}>
            <span className="text-6xl font-black">{primaryText}</span>
            <CCRollBar className="max-w-48 w-[calc(100%-4rem)]"
                       meterColor={bgColorClass}
                       range={[100, 1]}
                       value={value}
                       border={border}
                       critical={critical}
                       fumble={fumble}/>
            <span className={"font-bold " + textColorClass}>{subText}</span>
            <span>{range ? `${range[0]} - ${range[1]}` : "RANGE UNKNOWN"}</span>
        </div>
    )
}