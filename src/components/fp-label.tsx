import {IconDefinition} from "@fortawesome/fontawesome-svg-core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export function FpLabel({className, points, icon}: { className?: string, points: number, icon?: IconDefinition }) {
    return (
        <span className={`${className} bg-zinc-50 text-zinc-950 font-bold px-2 py-1 inline-flex gap-x-1 items-center rounded leading-none h-6`}>
            {
                icon &&
                <FontAwesomeIcon icon={icon} className="mr-1"/>
            }
            <span>{points}</span>
            <span className="text-xs">
                FP
            </span>
        </span>
    )
}