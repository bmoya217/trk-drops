import { addWeeks, isWithinInterval, subWeeks } from "date-fns";
import {
  ArmorType,
  Data,
  Difficulty,
  Grouping,
  Links,
  Order,
  RaidbotsDroptimizerItem,
  RaidbotsProfileResult,
  RaidbotsReport,
  Reports_Difficulty,
  Row,
} from "./types";

export const formatSlot = (slot: string) =>
  slot.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

type RaidbotsReportDate = NonNullable<RaidbotsReport["simbot"]>["date"];

export const CLASS_COLORS = [
  "",
  "#C69B6D", // Warrior
  "#F48CBA", // Paladin
  "#AAD372", // Hunter
  "#FFF468", // Rogue
  "#FFFFFF", // Priest
  "#C41E3A", // DeathKnight
  "#0070DD", // Shaman
  "#3FC7EB", // Mage
  "#8788EE", // Warlock
  "#00FF98", // Monk
  "#FF7C0A", // Druid
  "#A330C9", // DemonHunter
  "#33937F", // Evoker
];

export const ARMOR_TYPES = [
  ArmorType.Cloth,
  ArmorType.Leather,
  ArmorType.Mail,
  ArmorType.Plate,
];

const ARMOR_TYPE_BY_CLASS_ID: Record<number, ArmorType> = {
  1: ArmorType.Plate, // Warrior
  2: ArmorType.Plate, // Paladin
  3: ArmorType.Mail, // Hunter
  4: ArmorType.Leather, // Rogue
  5: ArmorType.Cloth, // Priest
  6: ArmorType.Plate, // Death Knight
  7: ArmorType.Mail, // Shaman
  8: ArmorType.Cloth, // Mage
  9: ArmorType.Cloth, // Warlock
  10: ArmorType.Leather, // Monk
  11: ArmorType.Leather, // Druid
  12: ArmorType.Leather, // Demon Hunter
  13: ArmorType.Mail, // Evoker
};

export const getArmorType = (row: Row) =>
  ARMOR_TYPE_BY_CLASS_ID[row.classId as number];

export const filterRowsByArmorType = (rows: Row[], armorType: ArmorType) =>
  armorType === ArmorType.All
    ? rows
    : rows.filter((row) => getArmorType(row) === armorType);

export const filterRowsByArmorTypes = (rows: Row[], armorTypes: ArmorType[]) =>
  armorTypes.length
    ? rows.filter((row) => armorTypes.includes(getArmorType(row)))
    : rows;

// Groups by boss
export const BOSSES = [
  "Imperator Averzian",
  "Vorasius",
  "Fallen-King Salhadaar",
  "Vaelgor & Ezzorak",
  "Lightblinded Vanguard",
  "Crown of the Cosmos",
  "Chimaerus the Undreamt God",
  "Belo'ren, Child of Al'ar",
  "Midnight Falls",
  "Catalyst",
];

export const openUrl = (url: string) => {
  window.open(url, "_blank")?.focus();
};

// table utils
export const descendingComparator =
  (order: Order, orderBy: string) => (a: Row, b: Row) => {
    const mag = order === "desc" ? 1 : -1;
    if (!a[orderBy]) return 1 * mag;
    if (!b[orderBy]) return -1 * mag;
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  };

export const getComparator = (order: Order, orderBy: string) => {
  return order === "desc"
    ? (a: Row, b: Row) => descendingComparator(order, orderBy)(a, b)
    : (a: Row, b: Row) => -descendingComparator(order, orderBy)(a, b);
};

export const getHeadCells = (rows: Row[] = [], grouping: Grouping) => {
  let headCells = new Set<string>();
  rows.forEach((row) => Object.keys(row).forEach((key) => headCells.add(key)));
  headCells.delete(grouping === Grouping.Boss ? "Player" : "Item");
  headCells.delete("color");
  headCells.delete("classId");
  return [
    grouping === Grouping.Boss ? "Player" : "Item",
    ...Array.from(headCells).sort(),
  ];
};

export const getLink = (row: Row, difficulty: Difficulty, links: Links) => {
  const name = row?.Item ?? row?.Player;

  return (
    links[name + "_" + difficulty] ?? links[name + "_" + Difficulty.Dungeon]
  );
};

// data fetching
export const fetchReport = async (
  report: string,
): Promise<RaidbotsReport | null> => {
  const page = await fetch("api/report?report=" + encodeURIComponent(report), {
    cache: "force-cache",
  }).catch((): null => null);
  if (page?.status !== 200) return null;

  return page.json();
};

export const fetchReports = async (): Promise<Reports_Difficulty | null> => {
  const reports = await fetch(`api/reports`, {
    cache: "no-store",
  })
    .then((reports) => reports.json())
    .catch((): null => null);

  return reports;
};

const getReportDate = (timestamp: RaidbotsReportDate) => {
  if (!timestamp) return null;

  if (typeof timestamp === "number") {
    return new Date(
      timestamp < 1_000_000_000_000 ? timestamp * 1000 : timestamp,
    );
  }

  const parsedDate = new Date(timestamp);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
};

const isCurrent = (timestamp: RaidbotsReportDate) => {
  const reportDate = getReportDate(timestamp);
  if (!reportDate) return false;

  return isWithinInterval(reportDate, {
    start: subWeeks(new Date(), 1),
    end: addWeeks(new Date(), 1),
  });
};

const isCorrectDifficulty = (report: RaidbotsReport, difficulty: Difficulty) =>
  report.simbot?.meta?.itemLibrary?.[0]?.difficulty?.includes(
    difficulty.toLowerCase(),
  );

export const validateReport = (
  report: RaidbotsReport | null,
  difficulty: Difficulty,
) => {
  if (!report) return false;
  if ((report.sim?.options?.desired_targets ?? 0) > 1) return false;
  if (report.sim?.options?.fight_style !== "Patchwerk") return false;
  if (report.sim?.options?.max_time !== 300) return false;
  // tier is over. comment out for now so data isn't empty
  // if (!isCurrent(report.simbot?.date)) return false;
  if (!isCorrectDifficulty(report, difficulty)) return false;
  return true;
};

const getEncounter = (item: RaidbotsDroptimizerItem) => {
  const boss = item.item.encounter?.name;
  if (boss) return boss;

  const dungeonIds = (item.item.sources ?? []).flatMap((src) =>
    src.encounterId ? [src.encounterId] : [],
  );
  const dungeon = item.item.instance?.encounters?.find((en) =>
    en.id ? dungeonIds.includes(en.id) : false,
  );
  return dungeon?.name ?? "";
};
type ResultsData = {
  itemName: string;
  column: string;
  sim: number;
  boss: string;
  slot: string;
  link: string;
};

export const formatResults = (
  report: RaidbotsReport,
  difficulty: Difficulty,
): { data: Data; links: Links } => {
  const id = report.simbot?.parentSimId ?? "id";
  const player = report.sim?.players?.[0]?.name ?? "anon player";
  const current = report.sim?.statistics?.raid_dps?.mean ?? 0;
  const results = report.sim?.profilesets?.results ?? []; // numerical sim results
  const items = report.simbot?.meta?.rawFormData?.droptimizerItems ?? []; // item description
  const color = report.simbot?.meta?.rawFormData?.character?.class;

  // match itemset list with sim results list
  const data = items.reduce<ResultsData[]>((prev, item) => {
    const result = results.reduce<RaidbotsProfileResult | undefined>(
      (bestResult, result) => {
        if (item.id !== result.name) return bestResult;
        if (
          (bestResult?.mean ?? Number.NEGATIVE_INFINITY) > (result.mean ?? 0)
        ) {
          return bestResult;
        }
        return result;
      },
      undefined,
    );
    if (result?.mean === undefined) return prev;

    const isTier = item.item.sourceItem?.name;
    const itemId = item.item.id;
    const slot = item.slot.replace(/[0-9]/g, "");
    const itemName = item.item.name;
    if (!itemName) return prev;

    const column = isTier ? slot + " tier" : itemName;
    const boss = isTier ? "Catalyst" : getEncounter(item);
    const sim = Math.floor(result.mean - current);
    const bonus_id = item.item.bonus_id;
    const itemLevel = item.item.itemLevel;
    const link = `https://www.wowhead.com/item=${itemId}?bonus=${bonus_id}&ilvl=${itemLevel}`;
    const newEntry: ResultsData = { itemName, column, sim, boss, slot, link };

    // check for item variation, return normally if not found
    const index = prev.findIndex((x) => x.itemName === itemName);
    if (index === -1) return [...prev, newEntry];

    // other variation was better, use that
    if (prev[index].sim > sim) return prev;

    // this variation was better, replace the old one
    return [...prev.slice(0, index), newEntry, ...prev.slice(index + 1)];
  }, []);

  const Boss = Object.fromEntries(
    BOSSES.map((boss) => {
      return [
        boss,
        [
          {
            ...Object.fromEntries(
              data
                .filter((d) => d.boss === boss)
                .map((e) => [e.column ?? e.itemName, e.sim]),
            ),
            Player: player,
            color: CLASS_COLORS[color],
            classId: color,
          },
        ],
      ];
    }),
  );

  const Player = {
    [player]: data.map((d) => ({
      Item: d.itemName,
      [d.slot]: d.sim,
      color: CLASS_COLORS[color],
      classId: color,
    })),
  };

  const links = {
    [player + "_" + difficulty]: `https://www.raidbots.com/simbot/report/${id}`,
    ...Object.fromEntries(
      data.map((d) => [d.itemName + "_" + difficulty, d.link]),
    ),
  };

  return {
    data: { Boss, Player },
    links,
  };
};
