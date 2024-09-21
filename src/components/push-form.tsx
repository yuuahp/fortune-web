import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/stores/store";
import {addPush, getHistoryById} from "@/stores/history-slice";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBomb} from "@awesome.me/kit-ae9e2bd1c8/icons/classic/solid";
import {Button} from "@mui/material";
import {useBCDiceRoll} from "@/libs/bcdice-fetch";
import {useState} from "react";

export function PushForm({historyId, setOpen}: {
    historyId: string, setOpen: (open: boolean) => void
}) {
    const entry = useSelector((state: RootState) => getHistoryById(state, historyId))

    if (!entry) return (
        <div>
            <p>エントリーが見つかりません。</p>
        </div>
    )

    const dispatch = useDispatch()

    const [errorOccurred, setErrorOccurred] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    const {fetchRoll} = useBCDiceRoll({
        onSuccess: (result) => {
            setErrorOccurred(false)
            dispatch(addPush({id: entry.id, push: result}))
        },
        onBCDiceError: (error) => {
            setErrorOccurred(true)
            setErrorMessage(`${error.reason}`)
        },
        onTypeError: () => {
            setErrorOccurred(true)
            setErrorMessage("Unknown Error")
        },
        onFetchError: () => {
            setErrorOccurred(true)
            setErrorMessage("Request to BCDice API failed")
        }
    })

    return (
        <div>
            <h1 className="text-xl font-bold mb-4">
                <FontAwesomeIcon icon={faBomb} className="mr-2"/>
                プッシュロール
            </h1>
            <p className="mb-4">
                本当にプッシュしますか？
            </p>
            <div className="flex justify-end gap-x-4">
                <Button onClick={() => setOpen(false)}>
                    キャンセル
                </Button>
                <Button type="submit" variant="contained" onClick={() => {
                    // @ts-ignore
                    fetchRoll(entry.command).then();
                    setOpen(false)
                }}>
                    確定
                </Button>
            </div>
            {
                errorOccurred && (
                    <div className="mt-4 text-red-500">
                        <p>{errorMessage}</p>
                    </div>
                )
            }
        </div>
    )
}