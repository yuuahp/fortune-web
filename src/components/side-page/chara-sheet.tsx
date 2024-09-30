import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAddressBook, faChessPawn, faFileImport, faScrollOld} from "@awesome.me/kit-ae9e2bd1c8/icons/classic/solid";
import {IconDefinition} from "@fortawesome/fontawesome-svg-core";
import {useState} from "react";
import {InvestigatorCreator} from "@/components/investigator-creator";

function NewCharaSelect({className, title, subtitle, icon, onClick}: {
    className?: string,
    title: string,
    subtitle: string,
    icon: IconDefinition,
    onClick?: () => void
}) {
    return <div className={`
        bg-zinc-800 rounded-md px-4 py-2 flex items-center gap-x-4
        cursor-pointer hover:bg-zinc-700 transition-all select-none
        ${className}
    `} onClick={onClick}>
        <FontAwesomeIcon icon={icon} className="text-3xl aspect-square"/>
        <div>
            <p className="text-lg font-bold">
                {title}
            </p>
            <p className="text-zinc-500">
                {subtitle}
            </p>
        </div>
    </div>
}

export function CharaSheet() {
    const [method, setMethod] = useState<"create-pc" | "create-npc" | "import" | undefined>(undefined)

    switch (method) {
        case "create-pc":
            return <InvestigatorCreator/>
        case "create-npc":
            return <div>create-npc</div>
        case "import":
            return <div>import</div>
        case undefined:
            return <div className="flex flex-col gap-y-4 justify-center items-center w-full h-full">
                <FontAwesomeIcon icon={faScrollOld} size="5x"/>
                <div className="flex flex-col gap-y-2">
                    <NewCharaSelect
                        title="新しい探索者を作る"
                        subtitle="ステータス・技能・バックストーリー・メモ"
                        icon={faAddressBook}
                        className="rounded-t-2xl"
                        onClick={() => setMethod("create-pc")}
                    />
                    <NewCharaSelect
                        title="新しい NPC を作る"
                        subtitle="ステータス・技能・メモ"
                        icon={faChessPawn}
                        onClick={() => setMethod("create-npc")}
                    />
                    <NewCharaSelect
                        title="CCFolia 駒をインポート"
                        subtitle="ステータス・技能"
                        icon={faFileImport}
                        className="rounded-b-2xl"
                        onClick={() => setMethod("import")}
                    />
                </div>
            </div>
    }
}