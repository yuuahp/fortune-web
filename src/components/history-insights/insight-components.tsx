import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleUp} from "@awesome.me/kit-ae9e2bd1c8/icons/classic/solid";

export function CloseButton({closeHandler}: { closeHandler: () => void }) {
    return (
        <div className="
                 group/fp-button bg-zinc-800 hover:bg-zinc-700 hover:mr-1
                 cursor-pointer select-none transition-all
                 px-4 rounded-full font-bold text-nowrap w-fit
             "
             onClick={closeHandler}>
            閉じる
            <FontAwesomeIcon icon={faAngleUp}
                             className={`ml-2 group-hover/fp-button:ml-1 group-active/fp-button:-translate-y-0.5 transition-all`}/>
        </div>
    )
}

export function PrimaryValue({value, result, accent}: { value?: number, result?: string, accent?: string }) {
    return (
        <div className="inline-flex h-20 w-20 flex-col">
            <div
                className="mb-1 flex w-20 items-center justify-center rounded-t-lg rounded-b-md border border-zinc-800 text-4xl font-bold h-[3.25rem] bg-zinc-950">
                {value || "?"}
            </div>
            <div
                className={`h-[calc(100%-3.25rem-.25rem)] flex justify-center items-center bg-zinc-950 border border-zinc-800 rounded-b-lg rounded-t-md text-sm font-bold text-${accent || 'zinc'}-500`}>
                {result || ""}
            </div>
        </div>
    )
}