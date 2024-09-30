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

export type CharaSheet = {
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

export type Chara = {
    id: string
    sheet: CharaSheet
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

export type SkillType = "combat" | "investigation" | "communication" | "knowledge" | "action" | "other"

export type SimpleSkill = {
    added: boolean
    name: string
    branch?: string
    rate: number | string
    type: SkillType
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
    type: SkillType
}

export type SkillInfo = {
    name: string
    branches?: ([string, number] | string)[]
    rateBase: number
    type: SkillType
    icon: IconDefinition
}

export const combatSkills: SkillInfo[] = [
    {
        name: "回避",
        rateBase: 30,
        type: "combat",
        icon: faPersonRunningFast
    },
    {
        name: "近接戦闘",
        branches: [["斧", 15], ["格闘", 25], ["絞殺ひも", 15], ["チェーンソー", 10], ["刀剣", 20], ["フレイル", 10], ["むち", 5], ["槍", 20]],
        rateBase: 25,
        type: "combat",
        icon: faHandFist
    },
    {
        name: "投擲",
        rateBase: 20,
        type: "combat",
        icon: faHandFist
    },
    {
        name: "射撃",
        branches: [["火炎放射器", 10], ["拳銃", 20], ["サブマシンガン", 15], ["重火器", 10], ["マシンガン", 10], ["弓", 15], ["ライフル・ショットガン", 25]],
        rateBase: 0,
        type: "combat",
        icon: faHandFist
    }
]
export const investigationSkills: SkillInfo[] = [
    {
        name: "応急手当",
        rateBase: 30,
        type: "investigation",
        icon: faHandHoldingMagic
    },
    {
        name: "鍵開け",
        rateBase: 1,
        type: "investigation",
        icon: faHandHoldingMagic
    },
    {
        name: "手さばき",
        rateBase: 10,
        type: "investigation",
        icon: faHandHoldingMagic
    },
    {
        name: "聞き耳",
        rateBase: 20,
        type: "investigation",
        icon: faHandHoldingMagic
    },
    {
        name: "隠密",
        rateBase: 20,
        type: "investigation",
        icon: faHandHoldingMagic
    },
    {
        name: "精神分析",
        rateBase: 1,
        type: "investigation",
        icon: faHandHoldingMagic
    },
    {
        name: "追跡",
        rateBase: 10,
        type: "investigation",
        icon: faHandHoldingMagic
    },
    {
        name: "登攀",
        rateBase: 20,
        type: "investigation",
        icon: faHandHoldingMagic
    },
    {
        name: "図書館",
        rateBase: 20,
        type: "investigation",
        icon: faHandHoldingMagic
    },
    {
        name: "目星",
        rateBase: 25,
        type: "investigation",
        icon: faHandHoldingMagic
    },
    {
        name: "鑑定",
        rateBase: 5,
        type: "investigation",
        icon: faHandHoldingMagic
    },
];
export const actionSkills: SkillInfo[] = [
    {
        name: "運転",
        rateBase: 20,
        branches: [],
        type: "action",
        icon: faHandHoldingMagic
    },
    {
        name: "機械修理",
        rateBase: 10,
        type: "action",
        icon: faHandHoldingMagic
    },
    {
        name: "重機械操作",
        rateBase: 1,
        type: "action",
        icon: faHandHoldingMagic
    },
    {
        name: "乗馬",
        rateBase: 5,
        type: "action",
        icon: faHandHoldingMagic
    },
    {
        name: "水泳",
        rateBase: 20,
        type: "action",
        icon: faHandHoldingMagic
    },
    {
        name: "製作",
        rateBase: 5,
        branches: [],
        type: "action",
        icon: faHandHoldingMagic
    },
    {
        name: "操縦",
        rateBase: 1,
        branches: [],
        type: "action",
        icon: faHandHoldingMagic
    },
    {
        name: "跳躍",
        rateBase: 20,
        type: "action",
        icon: faHandHoldingMagic
    },
    {
        name: "電気修理",
        rateBase: 10,
        type: "action",
        icon: faHandHoldingMagic
    },
    {
        name: "ナビゲート",
        rateBase: 10,
        type: "action",
        icon: faHandHoldingMagic
    },
    {
        name: "変装",
        rateBase: 5,
        type: "action",
        icon: faHandHoldingMagic
    },
];
export const communicationSkills: SkillInfo[] = [
    {
        name: "言いくるめ",
        rateBase: 5,
        type: "communication",
        icon: faHandHoldingMagic
    },
    {
        name: "信用",
        rateBase: 0,
        type: "communication",
        icon: faHandHoldingMagic
    },
    {
        name: "説得",
        rateBase: 10,
        type: "communication",
        icon: faHandHoldingMagic
    },
    {
        name: "母国語",
        rateBase: 85,
        branches: [],
        type: "communication",
        icon: faHandHoldingMagic
    },
    {
        name: "威圧",
        rateBase: 15,
        type: "communication",
        icon: faHandHoldingMagic
    },
    {
        name: "魅惑",
        rateBase: 15,
        type: "communication",
        icon: faHandHoldingMagic
    },
    {
        name: "言語",
        rateBase: 1,
        branches: [],
        type: "communication",
        icon: faHandHoldingMagic
    }
];
export const knowledgeSkills: SkillInfo[] = [
    {
        name: "医学",
        rateBase: 1,
        type: "knowledge",
        icon: faHandHoldingMagic
    },
    {
        name: "オカルト",
        rateBase: 5,
        type: "knowledge",
        icon: faHandHoldingMagic
    },
    {
        name: "クトゥルフ神話",
        rateBase: 0,
        type: "knowledge",
        icon: faHandHoldingMagic
    },
    {
        name: "芸術",
        rateBase: 5,
        branches: [],
        type: "knowledge",
        icon: faHandHoldingMagic
    },
    {
        name: "経理",
        rateBase: 5,
        type: "knowledge",
        icon: faHandHoldingMagic
    },
    {
        name: "考古学",
        rateBase: 1,
        type: "knowledge",
        icon: faHandHoldingMagic
    },
    {
        name: "コンピューター",
        rateBase: 5,
        type: "knowledge",
        icon: faHandHoldingMagic
    },
    {
        name: "科学",
        rateBase: 1,
        type: "knowledge",
        branches: ["暗号学", "化学", "気象学", "工学", "植物学", "数学", "生物学", "地質学", "天文学", "動物学", "物理学", "法医学", "薬学"],
        icon: faHandHoldingMagic
    },
    {
        name: "心理学",
        rateBase: 10,
        type: "knowledge",
        icon: faHandHoldingMagic
    },
    {
        name: "人類学",
        rateBase: 1,
        type: "knowledge",
        icon: faHandHoldingMagic
    },
    {
        name: "電子工学",
        rateBase: 1,
        type: "knowledge",
        icon: faHandHoldingMagic
    },
    {
        name: "自然",
        rateBase: 10,
        type: "knowledge",
        icon: faHandHoldingMagic
    },
    {
        name: "法律",
        rateBase: 5,
        type: "knowledge",
        icon: faHandHoldingMagic
    },
    {
        name: "歴史",
        rateBase: 5,
        type: "knowledge",
        icon: faHandHoldingMagic
    },
    {
        name: "サバイバル",
        rateBase: 10,
        branches: [],
        type: "knowledge",
        icon: faHandHoldingMagic
    }
];

export const skills: SkillInfo[] = [
    ...combatSkills,
    ...investigationSkills,
    ...actionSkills,
    ...communicationSkills,
    ...knowledgeSkills,
    {
        name: "信用",
        rateBase: 0,
        type: "other",
        icon: faHandHoldingMagic
    }
]


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