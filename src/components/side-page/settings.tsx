import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/stores/store";
import {Button, TextField} from "@mui/material";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFloppyDisk, faGear} from "@awesome.me/kit-ae9e2bd1c8/icons/classic/solid";
import {setBase} from "@/stores/bcdice-slice";

export function Settings() {
    const [baseURL, setBaseURL] = useState<string>(useSelector((state: RootState) => state.bcdice.base))
    const dispatch = useDispatch()

    const [baseSaved, setBaseSaved] = useState(false)

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">
                <FontAwesomeIcon icon={faGear}/> 設定
            </h1>
            <div>
                <div className="flex gap-x-2">
                    <TextField
                        variant="outlined"
                        size="small"
                        label="BCDice URL"
                        value={baseURL}
                        onChange={(e) => setBaseURL(e.target.value)}
                        className="grow"
                        helperText={baseSaved && "保存しました"}
                    />
                    <Button variant="contained" startIcon={<FontAwesomeIcon icon={faFloppyDisk}/>}
                            onClick={() => {
                                dispatch(setBase(baseURL))
                                setBaseSaved(true)
                                setTimeout(() => setBaseSaved(false), 3000)
                            }}
                            className="h-fit text-nowrap">
                        保存
                    </Button>
                </div>
            </div>
        </div>
    );
}