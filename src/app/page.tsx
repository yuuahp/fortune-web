"use client";

import {createTheme, CssBaseline, IconButton, InputAdornment, TextField, ThemeProvider} from "@mui/material";
import {ChangeEvent, useEffect, useRef, useState} from "react";
import {faPaperPlane, faRotate} from "@awesome.me/kit-ae9e2bd1c8/icons/classic/solid";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useBCDiceSWR} from "@/libs/bcdice-fetch";
import {HistoryEntry} from "@/libs/history";
import {History} from "@/components/history/history";
import {v6 as uuidv6} from 'uuid';
import {Provider, useDispatch, useSelector} from "react-redux";
import {store} from "@/stores/store";
import {addHistory, selectHistory, toggleActive} from "@/stores/history-slice";
import {lastOf} from "@/libs/utils";
import {HistoryScrollContext} from "@/app/contexts";
import {Settings} from "@/components/side-page/settings";
import {CharaSheet} from "@/components/side-page/chara-sheet";

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

export function Main() {
    const historyBlock = useRef<HTMLDivElement>(null)

    const [textField, setTextField] = useState<string>("");
    const diceCommand = useRef<string>("");

    const history = useSelector(selectHistory)

    const errorPreviously = useRef<boolean>(false)
    const errorMessage = useRef<string>("")

    const dispatch = useDispatch()

    const {fetchRoll} = useBCDiceSWR({
        onSuccess: (command, result) => {
            errorPreviously.current = false

            const newEntry: HistoryEntry = {
                id: uuidv6(),
                active: true,
                activeFixed: false,
                command: command,
                result: result
            }

            dispatch(addHistory(newEntry))
        },
        onBCDiceError: (command, error) => {
            errorPreviously.current = true
            errorMessage.current = `${command} - ${error.reason}`
        },
        onTypeError: () => {
            errorPreviously.current = true
            errorMessage.current = "Unknown Error"
        },
        onFetchError: () => {
            errorPreviously.current = true
            errorMessage.current = "Request to BCDice API failed"
        },
        anyway: () => setTextField("")
    })

    function roll() {
        if (textField === "") return;

        diceCommand.current = textField

        fetchRoll(textField).then();
    }

    function reroll() {
        if (history.length <= 0) return;

        const lastCommand = lastOf(history)!!.command;

        diceCommand.current = lastCommand

        fetchRoll(lastCommand).then();
    }

    // Auto-scroll to the end of the history when new entry is added
    const endHistory = useRef<HTMLDivElement>(null)

    useEffect(() => {
        endHistory?.current?.scrollIntoView({
            behavior: "instant"
        })
    }, [history.length])

    type SidePageId = "settings" | "chara-sheet" | "scenario"

    const [sidePage, setSidePage] = useState<SidePageId>("chara-sheet")

    function SideTab({id, name}: { id: SidePageId, name: string }) {
        return (
            <div className={`
                font-bold cursor-pointer select-none 
                hover:text-zinc-200 active:text-zinc-50 active:scale-95 transition-all 
                ${sidePage === id ? "text-zinc-50" : "text-zinc-500"}
            `}
                 onClick={() => setSidePage(id)}>
                {name}
            </div>
        )
    }

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline/>
            <main
                className="flex h-screen w-screen flex-col-reverse gap-4 md:gap-8 p-4 md:p-8 bg-zinc-950 md:flex-row">
                <div className="h-1/2 w-full md:h-full md:w-1/2">
                    <div className="h-full">
                        <div>
                            <img src="/fortune.png" className="h-8 mb-4" style={{imageRendering: "pixelated"}}
                                 alt="Fortune's Logo"/>
                        </div>
                        <HistoryScrollContext.Provider value={historyBlock.current}>
                            <div className="flex flex-col gap-y-2 mb-8 h-[calc(100%-5rem-56px)] overflow-y-scroll"
                                 ref={historyBlock}>
                                {
                                    history.map((entry, index) => {
                                        return <History
                                            key={entry.id}
                                            entry={entry}
                                            toggleActive={() => {
                                                dispatch(toggleActive(entry.id))
                                            }}
                                            lessRoundedTop={index !== 0 && history[index - 1].active}
                                            lessRoundedBottom={(index !== history.length - 1) && history[index + 1].active}
                                        />
                                    })
                                }
                                <div ref={endHistory}/>
                            </div>
                        </HistoryScrollContext.Provider>

                        <TextField label="Dice Command" variant="outlined" fullWidth
                                   className="h-[56px]"
                                   error={errorPreviously.current}
                                   helperText={errorPreviously.current ? errorMessage.current : ""}
                                   InputProps={{
                                       endAdornment:
                                           <InputAdornment position="end">
                                               <IconButton aria-label="reroll most prevous dice"
                                                           onClick={() => reroll()}
                                                           disabled={history.length <= 0}>
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


                </div>
                <div className="
                    w-full md:w-1/2 h-1/2 md:h-full p-4
                    bg-zinc-900 rounded-2xl border border-zinc-800
                    flex flex-col gap-y-4
                ">
                    <div className="flex justify-start gap-x-4 px-4">
                        <SideTab id="chara-sheet" name="キャラシート"/>
                        <SideTab id="scenario" name="シナリオ"/>
                        <SideTab id="settings" name="設定"/>
                    </div>
                    <div className="grow overflow-y-scroll">
                        {(() => {
                            switch (sidePage) {
                                case "chara-sheet":
                                    return <CharaSheet/>
                                case "scenario":
                                    return <div>シナリオ</div>
                                case "settings":
                                    return <Settings/>
                            }
                        })()}
                    </div>
                </div>
            </main>
        </ThemeProvider>
    );
}

export default function Home() {
    return (
        <Provider store={store}>
            <Main/>
        </Provider>
    )
}