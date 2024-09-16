"use client";

import {createTheme, CssBaseline, IconButton, InputAdornment, TextField, ThemeProvider} from "@mui/material";
import {ChangeEvent, useEffect, useRef, useState} from "react";
import useSWRMutation from "swr/mutation";
import {faPaperPlane, faRotate} from "@awesome.me/kit-ae9e2bd1c8/icons/classic/solid";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {BCDiceResponse, fetcher, isBCDiceError, isBCDiceResult} from "@/libs/bcdice-fetch";
import {HistoryEntry} from "@/libs/history";
import {History} from "@/components/history";
import {v6 as uuidv6} from 'uuid';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

export default function Home() {
    const historyBlock = useRef<HTMLDivElement>(null)

    const [textField, setTextField] = useState<string>("");
    const diceCommand = useRef<string>("");

    const [history, setHistory] = useState<HistoryEntry[]>([]);

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

                    const autoClosedEntries = history.map((value) => {
                        if (!value.activeFixed) {
                            return {...value, active: false}
                        } else {
                            return {...value}
                        }
                    })

                    const newEntry: HistoryEntry = {
                        id: uuidv6(),
                        active: true,
                        activeFixed: false,
                        command: diceCommand.current,
                        result: data
                    }

                    setHistory([...autoClosedEntries, newEntry]);
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

    // Auto-scroll to the end of the history when new entry is added
    const endHistory = useRef<HTMLDivElement>(null)

    useEffect(() => {
        endHistory?.current?.scrollIntoView({
            behavior: "instant"
        })
    }, [history.length])

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline/>
            <main className="flex h-screen w-screen flex-col-reverse gap-4 md:gap-8 p-4 md:p-8 bg-zinc-950 md:flex-row">
                <div className="h-1/2 w-full md:h-full md:w-1/2">
                    <div className="flex flex-col gap-y-2 mb-8 h-[calc(100%-2rem-56px)] overflow-y-scroll"
                         ref={historyBlock}>
                        {
                            history.map((entry) => {
                                return <History key={entry.id} entry={entry} toggleActive={() => {
                                    setHistory(history.map((value) => {
                                        if (value.id === entry.id) { // clicked entry
                                            return {...value, active: !value.active, activeFixed: true}
                                        } else {
                                            return {...value}
                                        }
                                    }))
                                }}/>
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
                    bg-zinc-900 rounded-2xl border border-zinc-800
                ">
                </div>
            </main>
        </ThemeProvider>
    );
}