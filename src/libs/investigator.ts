import {
    faFaceSmile,
    faHandFist,
    faHandHoldingMagic,
    faHeadSideBrain,
    faPersonFallingBurst,
    faPersonRunningFast,
    faRulerVertical,
    faUserGraduate
} from "@awesome.me/kit-ae9e2bd1c8/icons/classic/solid";
import {IconDefinition} from "@fortawesome/fontawesome-svg-core";

export type InvestigatorSheet = {
    name: string
    read?: string
    profession?: string
    age?: number
    gender?: string
    address?: string
    origin?: string
    status: { // HP, MP, SAN, 幸運
        name: string
        value: number
    }[]
    params: {
        name: string
        value: number
    }[]
    skills: (Skill | SimpleSkill)[]
    commands: string[]
    externalUrl: string
    icons: string[]
    memo: string
}

export type InvestigatorSheetDraft = {
    name?: string
    read?: string
    profession?: string
    age?: number
    gender?: string
    address?: string
    origin?: string
    status: { // HP, MP, SAN, 幸運
        name: string
        value: number
    }[]
    params: {
        name: string
        value: number
    }[]
    skills: (Skill | SimpleSkill)[]
    commands: string[]
    externalUrl?: string
    icons: string[]
    memo?: string
}

export type Investigator = {
    id: string
    sheet: InvestigatorSheet
    statusDeltas: {
        name: string
        value: number
    }[]
    paramDeltas: {
        name: string
        value: number
    }[]
    tempInsanity: boolean
    indefiniteInsanity: boolean
    injury: boolean
}

export type SkillCategory = "combat" | "investigation" | "communication" | "knowledge" | "action" | "other"

export type SimpleSkill = {
    added: boolean
    name: string
    branch?: string
    rate: number | string
    category: SkillCategory
}

export type Skill = {
    added: boolean
    name: string
    branch?: string
    rateBase: number
    rateProfession: number
    rateInterest: number
    rateGrowth: number
    rateOther: number | string
    category: SkillCategory
}

export type SkillInfo = {
    name: string
    branches?: ([string, number] | string)[]
    rateBase: number
    category: SkillCategory
    icon: IconDefinition
}


export type CCFoliaPiece = {
    kind: "character"
    data: {
        name: string
        initiative: number
        externalUrl: string
        iconUrl: string
        command: string
        status: {
            label: string
            value: number
            max: number
        }[]
        params: {
            label: string
            value: string
        }[]
    }
}

function isCCFoliaPiece(piece: any): piece is CCFoliaPiece {
    return piece &&
        piece.kind === "character" &&
        piece.data &&
        typeof piece.data.name === "string" &&
        typeof piece.data.initiative === "number" &&
        typeof piece.data.externalUrl === "string" &&
        typeof piece.data.iconUrl === "string" &&
        typeof piece.data.command === "string" &&
        Array.isArray(piece.data.status) &&
        piece.data.status.every((status: any) =>
            typeof status.label === "string" &&
            typeof status.value === "number" &&
            typeof status.max === "number"
        ) &&
        Array.isArray(piece.data.params) &&
        piece.data.params.every((param: any) =>
            typeof param.label === "string" &&
            typeof param.value === "number"
        );
}

//
// export function ccfoliaToChara(ccfolia: any): Chara | undefined {
//     if (!isCCFoliaPiece(ccfolia)) return undefined;
//
//     const {status, params, externalUrl, iconUrl, command, name: nameWithRead} = ccfolia.data;
//
//     const nameReadRegex = /(?<name>.+)\s\((?<read>.+)\)/;
//
//     const groups = nameReadRegex.exec(nameWithRead)?.groups;
//     const name = groups?.name ?? nameWithRead;
//     const read = groups?.read ?? "";
//
//     // [
//     //     ...status.map(it => ({label: it.label, value: it.value})),
//     //     ...params.map(it => ({label: it.label, value: parseInt(it.value)}))
//     // ].reduce(
//     //     (acc: string, status: {
//     //         label: string,
//     //         value: number
//     //     }) => acc.replaceAll(`{${status.label}}`, status.value.toString()),
//     //     command
//     // ).split()
//
//     const commandRegex = /(?<name>.+)<=(?<value>.+)/;
//
//     command.split("\n").filter(it => it !== "").map(it => {
//
//     })
//
//     return {
//         id: uuidv6(),
//         sheet: {
//             name: name,
//             read: read,
//             status: status.map((status) => ({
//                 name: status.label,
//                 value: status.max
//             })),
//             skills: [],
//             externalUrl: externalUrl,
//             icons: [iconUrl],
//             memo: ""
//         },
//         statusDeltas: status.map((status) => ({
//             name: status.label,
//             value: status.value - status.max
//         })),
//         tempInsanity: false,
//         indefiniteInsanity: false,
//         injury: false
//     }
// }

export const params = [
    {
        label: "STR",
        icon: faHandFist,
        command: "3D6"
    },
    {
        label: "DEX",
        icon: faPersonRunningFast,
        command: "3D6"
    },
    {
        label: "INT",
        icon: faHeadSideBrain,
        command: "2D6+6"
    },
    {
        label: "CON",
        icon: faPersonFallingBurst,
        command: "3D6"
    },
    {
        label: "APP",
        icon: faFaceSmile,
        command: "3D6"
    },
    {
        label: "POW",
        icon: faHandHoldingMagic,
        command: "3D6"
    },
    {
        label: "SIZ",
        icon: faRulerVertical,
        command: "2D6+6"
    },
    {
        label: "EDU",
        icon: faUserGraduate,
        command: "2D6+6"
    }
]