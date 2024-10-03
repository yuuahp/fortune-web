import {faHandFist, faHandHoldingMagic, faPersonRunningFast} from "@awesome.me/kit-ae9e2bd1c8/icons/classic/solid";
import {SkillInfo} from "@/libs/investigator";

export namespace Skills {
    export const combat = [
        {
            name: "回避",
            rateBase: 30,
            icon: faPersonRunningFast
        },
        {
            name: "近接戦闘",
            branches: [["斧", 15], ["格闘", 25], ["絞殺ひも", 15], ["チェーンソー", 10], ["刀剣", 20], ["フレイル", 10], ["むち", 5], ["槍", 20]],
            rateBase: 25,
            icon: faHandFist
        },
        {
            name: "投擲",
            rateBase: 20,
            icon: faHandFist
        },
        {
            name: "射撃",
            branches: [["火炎放射器", 10], ["拳銃", 20], ["サブマシンガン", 15], ["重火器", 10], ["マシンガン", 10], ["弓", 15], ["ライフル・ショットガン", 25]],
            rateBase: 0,
            icon: faHandFist
        }
    ].map(it => ({...it, category: "combat"}) as SkillInfo)
    export const investigation: SkillInfo[] = [
        {
            name: "応急手当",
            rateBase: 30,
            icon: faHandHoldingMagic
        },
        {
            name: "鍵開け",
            rateBase: 1,
            icon: faHandHoldingMagic
        },
        {
            name: "手さばき",
            rateBase: 10,
            icon: faHandHoldingMagic
        },
        {
            name: "聞き耳",
            rateBase: 20,
            icon: faHandHoldingMagic
        },
        {
            name: "隠密",
            rateBase: 20,
            icon: faHandHoldingMagic
        },
        {
            name: "精神分析",
            rateBase: 1,
            icon: faHandHoldingMagic
        },
        {
            name: "追跡",
            rateBase: 10,
            icon: faHandHoldingMagic
        },
        {
            name: "登攀",
            rateBase: 20,
            icon: faHandHoldingMagic
        },
        {
            name: "図書館",
            rateBase: 20,
            icon: faHandHoldingMagic
        },
        {
            name: "目星",
            rateBase: 25,
            icon: faHandHoldingMagic
        },
        {
            name: "鑑定",
            rateBase: 5,
            icon: faHandHoldingMagic
        }
    ].map(it => ({...it, category: "investigation"}) as SkillInfo);
    export const action: SkillInfo[] = [
        {
            name: "運転",
            rateBase: 20,
            branches: [],
            icon: faHandHoldingMagic
        },
        {
            name: "機械修理",
            rateBase: 10,
            icon: faHandHoldingMagic
        },
        {
            name: "重機械操作",
            rateBase: 1,
            icon: faHandHoldingMagic
        },
        {
            name: "乗馬",
            rateBase: 5,
            icon: faHandHoldingMagic
        },
        {
            name: "水泳",
            rateBase: 20,
            icon: faHandHoldingMagic
        },
        {
            name: "製作",
            rateBase: 5,
            branches: [],
            icon: faHandHoldingMagic
        },
        {
            name: "操縦",
            rateBase: 1,
            branches: [],
            icon: faHandHoldingMagic
        },
        {
            name: "跳躍",
            rateBase: 20,
            icon: faHandHoldingMagic
        },
        {
            name: "電気修理",
            rateBase: 10,
            icon: faHandHoldingMagic
        },
        {
            name: "ナビゲート",
            rateBase: 10,
            icon: faHandHoldingMagic
        },
        {
            name: "変装",
            rateBase: 5,
            icon: faHandHoldingMagic
        },
    ].map(it => ({...it, category: "action"}) as SkillInfo);
    export const communication: SkillInfo[] = [
        {
            name: "言いくるめ",
            rateBase: 5,
            icon: faHandHoldingMagic
        },
        {
            name: "信用",
            rateBase: 0,
            icon: faHandHoldingMagic
        },
        {
            name: "説得",
            rateBase: 10,
            icon: faHandHoldingMagic
        },
        {
            name: "母国語",
            rateBase: 85,
            branches: [],
            icon: faHandHoldingMagic
        },
        {
            name: "威圧",
            rateBase: 15,
            icon: faHandHoldingMagic
        },
        {
            name: "魅惑",
            rateBase: 15,
            icon: faHandHoldingMagic
        },
        {
            name: "言語",
            rateBase: 1,
            branches: [],
            icon: faHandHoldingMagic
        }
    ].map(it => ({...it, category: "communication"}) as SkillInfo);
    export const knowledge: SkillInfo[] = [
        {
            name: "医学",
            rateBase: 1,
            icon: faHandHoldingMagic
        },
        {
            name: "オカルト",
            rateBase: 5,
            icon: faHandHoldingMagic
        },
        {
            name: "クトゥルフ神話",
            rateBase: 0,
            icon: faHandHoldingMagic
        },
        {
            name: "芸術",
            rateBase: 5,
            branches: [],
            icon: faHandHoldingMagic
        },
        {
            name: "経理",
            rateBase: 5,
            icon: faHandHoldingMagic
        },
        {
            name: "考古学",
            rateBase: 1,
            icon: faHandHoldingMagic
        },
        {
            name: "コンピューター",
            rateBase: 5,
            icon: faHandHoldingMagic
        },
        {
            name: "科学",
            rateBase: 1,
            branches: ["暗号学", "化学", "気象学", "工学", "植物学", "数学", "生物学", "地質学", "天文学", "動物学", "物理学", "法医学", "薬学"],
            icon: faHandHoldingMagic
        },
        {
            name: "心理学",
            rateBase: 10,
            icon: faHandHoldingMagic
        },
        {
            name: "人類学",
            rateBase: 1,
            icon: faHandHoldingMagic
        },
        {
            name: "電子工学",
            rateBase: 1,
            icon: faHandHoldingMagic
        },
        {
            name: "自然",
            rateBase: 10,
            icon: faHandHoldingMagic
        },
        {
            name: "法律",
            rateBase: 5,
            icon: faHandHoldingMagic
        },
        {
            name: "歴史",
            rateBase: 5,
            icon: faHandHoldingMagic
        },
        {
            name: "サバイバル",
            rateBase: 10,
            branches: [],
            icon: faHandHoldingMagic
        }
    ].map(it => ({...it, category: "knowledge"}) as SkillInfo);
    export const other: SkillInfo[] = [{
        name: "信用",
        rateBase: 0,
        category: "other",
        icon: faHandHoldingMagic
    }]

    export const all: SkillInfo[] = [
        ...combat,
        ...investigation,
        ...action,
        ...communication,
        ...knowledge,
        ...other
    ]
}

