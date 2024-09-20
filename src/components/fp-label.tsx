import {IconDefinition} from "@fortawesome/fontawesome-svg-core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export function FpLabel({points, icon}: { points: number, icon?: IconDefinition }) {
    return (
        <span className={`bg-zinc-50 text-zinc-950 font-bold px-2 inline-flex gap-x-1 items-center mr-2 rounded`}>
            {
                icon &&
                <FontAwesomeIcon icon={icon} className="text-zinc-900 mr-1"/>
            }
            <span>{points}</span>
            <span className="text-xs">
                FP
            </span>
        </span>
    )
}