"use client";

import {createTheme, CssBaseline, IconButton, InputAdornment, TextField, ThemeProvider} from "@mui/material";
import {ChangeEvent, useEffect, useRef, useState} from "react";
import {faPaperPlane, faRotate, faSidebarFlip} from "@awesome.me/kit-ae9e2bd1c8/icons/classic/solid";
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
import {useRouter} from "next/navigation";
import gsap from 'gsap';
import {useGSAP} from "@gsap/react";

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

export function Main() {
    gsap.registerPlugin(useGSAP)

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

    function isSidePageId(value: any): value is SidePageId {
        return value === "settings" || value === "chara-sheet" || value === "scenario";
    }

    const [sideOpen, setSideOpen] = useState(false)
    const [sidePage, setSidePage] = useState<SidePageId | undefined>("chara-sheet")

    function openSidePage(id?: SidePageId) {
        if (id) {
            setSidePage(id)
        }
        router.push(`#${id ?? sidePage}`, {scroll: false})
        setSideOpen(true)
    }

    function closeSidePage() {
        setSideOpen(false)

        router.push("", {scroll: false})
    }

    function toggleSidePage() {
        if (sideOpen) closeSidePage()
        else openSidePage()

    }

    const router = useRouter()

    function SideTab({id, name}: { id: SidePageId, name: string }) {
        return (
            <div className={`
                font-bold cursor-pointer select-none 
                hover:text-zinc-200 active:text-zinc-50 active:scale-95 transition-all 
                ${sidePage === id ? "text-zinc-50" : "text-zinc-500"}
            `}
                 onClick={() => openSidePage(id)}>
                {name}
            </div>
        )
    }

    useEffect(() => {
        const hash = window.location.hash
        if (hash === "") return

        const possibleId = hash.slice(1)

        if (isSidePageId(possibleId)) setSidePage(possibleId)
    }, [])

    const [doTransition, setDoTransition] = useState(false)

    useEffect(() => {
        setDoTransition(true)
        setTimeout(() => setDoTransition(false), 300)
    }, [sideOpen]);

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline/>
            <main className="w-screen h-screen overflow-hidden">
                <div className={`flex h-screen gap-4 md:gap-8 p-4 md:p-8 bg-zinc-950
                    w-[calc(100vw+(100vw-1rem))] ${sideOpen ? 'ml-[calc(-100vw+1rem)] md:w-screen md:ml-0' : 'md:w-[calc(100vw+(50vw-3rem))]'} 
                    ${doTransition ? 'transition-all' : ''}
                `}>
                    <div className="w-full md:h-full grow">
                        <div className="h-full">
                            <div className="flex justify-between items-center">
                                <img src="/fortune.png" className="h-8 mb-4" style={{imageRendering: "pixelated"}}
                                     alt="Fortune's Logo"/>
                                <button className="flex group" onClick={toggleSidePage}>
                                    <FontAwesomeIcon icon={faSidebarFlip}
                                                     className="text-xl group-active:scale-95 transition-all"/>
                                </button>
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
                        w-[calc(100vw-2rem)] md:w-[calc(50vw-3rem)] shrink-0 md:h-full p-4
                        bg-zinc-900 rounded-2xl border border-zinc-800
                        flex flex-col gap-y-4
                    ">
                        <div className="flex justify-between items-center">
                            <div className="flex justify-start gap-x-4 px-4">
                                <SideTab id="chara-sheet" name="探索者"/>
                                <SideTab id="scenario" name="シナリオ"/>
                                <SideTab id="settings" name="設定"/>
                            </div>
                            <button className="flex group md:hidden" onClick={toggleSidePage}>
                                <FontAwesomeIcon icon={faSidebarFlip}
                                                 className="text-xl group-active:scale-95 transition-all"/>
                            </button>
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