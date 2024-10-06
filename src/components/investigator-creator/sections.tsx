import {
    faBinoculars,
    faBooks,
    faComments,
    faHandFist,
    faPersonRunning
} from "@awesome.me/kit-ae9e2bd1c8/icons/classic/solid";
import {IconDefinition} from "@fortawesome/fontawesome-svg-core";
import {InvestigatorSheetDraft, SkillCategory} from "@/libs/investigator";
import {SkillCategoryEditor} from "@/components/investigator-creator/investigator-creator-lib";
import {useState} from "react";

export function SkillsSection({data, setData}: {
    data: InvestigatorSheetDraft,
    setData: (data: InvestigatorSheetDraft) => void
}) {
    const [editingStatus, setEditingStatus] = useState<boolean[]>([])

    return <div className="flex flex-col gap-y-4">
        {
            ([
                {icon: faHandFist, name: "戦闘技能", type: "combat"},
                {icon: faBinoculars, name: "探索技能", type: "investigation"},
                {icon: faPersonRunning, name: "行動技能", type: "action"},
                {icon: faComments, name: "交渉技能", type: "communication"},
                {icon: faBooks, name: "知識技能", type: "knowledge"}
            ] as { icon: IconDefinition, name: string, type: SkillCategory }[])
                .map(({icon, name, type}, index) => (
                    <SkillCategoryEditor
                        key={type}
                        icon={icon}
                        name={name}
                        type={type}
                        data={data}
                        setData={setData}
                        edit={editingStatus[index]}
                        editHook={editing => {
                            if (editing) {
                                const newEditingStatus = [...editingStatus].map(_ => false)
                                newEditingStatus[index] = editing
                                setEditingStatus(newEditingStatus)
                            }
                        }}
                    />
                ))
        }
    </div>
}