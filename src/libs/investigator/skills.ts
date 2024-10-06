import {
    faArrowProgress,
    faAxe,
    faBooks,
    faBookSection,
    faBookSparkles,
    faBuildingColumns,
    faCarSide,
    faCastle,
    faComputer,
    faEar,
    faExcavator,
    faEyes,
    faEyeSlash,
    faFaceNoseSteam,
    faFaceSmileHearts,
    faFlask,
    faGhost,
    faGlobe,
    faGun,
    faHammerBrush,
    faHandFist,
    faHandHoldingBox,
    faHandsHoldingDiamond,
    faHeart,
    faHelicopter,
    faHorseSaddle,
    faKey,
    faLanguage,
    faLeaf,
    faLightbulbCflOn,
    faMapLocationDot,
    faMessageExclamation,
    faMessagesQuestion,
    faMountains,
    faPenPaintbrush,
    faPerson,
    faPersonRunningFast,
    faPersonSkiJumping,
    faPersonSwimming,
    faPiggyBank,
    faScaleUnbalanced,
    faScrewdriverWrench,
    faSuitcaseMedical,
    faTransformerBolt,
    faTruckMedical,
    faUfoBeam,
    faUserSecret,
    faVolleyball
} from "@awesome.me/kit-ae9e2bd1c8/icons/classic/solid";
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
            icon: faVolleyball
        },
        {
            name: "射撃",
            branches: [["火炎放射器", 10], ["拳銃", 20], ["サブマシンガン", 15], ["重火器", 10], ["マシンガン", 10], ["弓", 15], ["ライフル・ショットガン", 25]],
            rateBase: 0,
            icon: faGun
        }
    ].map(it => ({...it, category: "combat"}) as SkillInfo)
    export const investigation: SkillInfo[] = [
        {
            name: "応急手当",
            rateBase: 30,
            icon: faSuitcaseMedical
        },
        {
            name: "鍵開け",
            rateBase: 1,
            icon: faKey
        },
        {
            name: "手さばき",
            rateBase: 10,
            icon: faHandHoldingBox
        },
        {
            name: "聞き耳",
            rateBase: 20,
            icon: faEar
        },
        {
            name: "隠密",
            rateBase: 20,
            icon: faEyeSlash
        },
        {
            name: "精神分析",
            rateBase: 1,
            icon: faGhost
        },
        {
            name: "追跡",
            rateBase: 10,
            icon: faArrowProgress
        },
        {
            name: "登攀",
            rateBase: 20,
            icon: faMountains
        },
        {
            name: "図書館",
            rateBase: 20,
            icon: faBooks
        },
        {
            name: "目星",
            rateBase: 25,
            icon: faEyes
        },
        {
            name: "鑑定",
            rateBase: 5,
            icon: faHandsHoldingDiamond
        }
    ].map(it => ({...it, category: "investigation"}) as SkillInfo);
    export const action: SkillInfo[] = [
        {
            name: "運転",
            rateBase: 20,
            branches: [],
            icon: faCarSide
        },
        {
            name: "機械修理",
            rateBase: 10,
            icon: faScrewdriverWrench
        },
        {
            name: "重機械操作",
            rateBase: 1,
            icon: faExcavator
        },
        {
            name: "乗馬",
            rateBase: 5,
            icon: faHorseSaddle
        },
        {
            name: "水泳",
            rateBase: 20,
            icon: faPersonSwimming
        },
        {
            name: "製作",
            rateBase: 5,
            branches: [],
            icon: faHammerBrush
        },
        {
            name: "操縦",
            rateBase: 1,
            branches: [],
            icon: faHelicopter
        },
        {
            name: "跳躍",
            rateBase: 20,
            icon: faPersonSkiJumping
        },
        {
            name: "電気修理",
            rateBase: 10,
            icon: faLightbulbCflOn
        },
        {
            name: "ナビゲート",
            rateBase: 10,
            icon: faMapLocationDot
        },
        {
            name: "変装",
            rateBase: 5,
            icon: faUserSecret
        },
    ].map(it => ({...it, category: "action"}) as SkillInfo);
    export const communication: SkillInfo[] = [
        {
            name: "言いくるめ",
            rateBase: 5,
            icon: faMessageExclamation
        },
        {
            name: "信用",
            rateBase: 0,
            icon: faBuildingColumns
        },
        {
            name: "説得",
            rateBase: 10,
            icon: faMessagesQuestion
        },
        {
            name: "母国語",
            rateBase: 85,
            branches: [],
            icon: faGlobe
        },
        {
            name: "威圧",
            rateBase: 15,
            icon: faFaceNoseSteam
        },
        {
            name: "魅惑",
            rateBase: 15,
            icon: faFaceSmileHearts
        },
        {
            name: "言語",
            rateBase: 1,
            branches: [],
            icon: faLanguage
        }
    ].map(it => ({...it, category: "communication"}) as SkillInfo);
    export const knowledge: SkillInfo[] = [
        {
            name: "医学",
            rateBase: 1,
            icon: faTruckMedical
        },
        {
            name: "オカルト",
            rateBase: 5,
            icon: faUfoBeam
        },
        {
            name: "クトゥルフ神話",
            rateBase: 0,
            icon: faBookSparkles
        },
        {
            name: "芸術",
            rateBase: 5,
            branches: [],
            icon: faPenPaintbrush
        },
        {
            name: "経理",
            rateBase: 5,
            icon: faPiggyBank
        },
        {
            name: "考古学",
            rateBase: 1,
            icon: faCastle
        },
        {
            name: "コンピューター",
            rateBase: 5,
            icon: faComputer
        },
        {
            name: "科学",
            rateBase: 1,
            branches: ["暗号学", "化学", "気象学", "工学", "植物学", "数学", "生物学", "地質学", "天文学", "動物学", "物理学", "法医学", "薬学"],
            icon: faFlask
        },
        {
            name: "心理学",
            rateBase: 10,
            icon: faHeart
        },
        {
            name: "人類学",
            rateBase: 1,
            icon: faPerson
        },
        {
            name: "電子工学",
            rateBase: 1,
            icon: faTransformerBolt
        },
        {
            name: "自然",
            rateBase: 10,
            icon: faLeaf
        },
        {
            name: "法律",
            rateBase: 5,
            icon: faScaleUnbalanced
        },
        {
            name: "歴史",
            rateBase: 5,
            icon: faBookSection
        },
        {
            name: "サバイバル",
            rateBase: 10,
            branches: [],
            icon: faAxe
        }
    ].map(it => ({...it, category: "knowledge"}) as SkillInfo);
    export const other: SkillInfo[] = []

    export const all: SkillInfo[] = [
        ...combat,
        ...investigation,
        ...action,
        ...communication,
        ...knowledge,
        ...other
    ]
}

