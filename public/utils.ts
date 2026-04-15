import { addWeeks, isWithinInterval, subWeeks } from "date-fns";
import {
  Data,
  Difficulty,
  Grouping,
  Links,
  Order,
  Reports_Team,
  Row,
} from "./types";

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

export const getHeight = () => {
  return Math.max(
    document?.documentElement?.clientHeight || 0,
    window?.innerHeight || 0,
  );
};

export const getWidth = () => {
  return Math.max(
    document?.documentElement?.clientWidth || 0,
    window?.innerWidth || 0,
  );
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
export const fetchReport = async (report: string) => {
  const page = await fetch("api/report?report=" + report, {
    cache: "force-cache",
  }).catch(() => null);
  if (page?.status !== 200) return {};

  return page.json();
};

export const fetchReports = async (): Promise<Reports_Team | null> => {
  const reports = await fetch(`api/reports`, {
    cache: "no-store",
  })
    .then((reports) => reports.json())
    .catch((): any => null);

  return reports;
};

const isCurrent = (timestamp: number) =>
  isWithinInterval(timestamp, {
    start: subWeeks(new Date(), 1),
    end: addWeeks(new Date(), 1),
  });

const isCorrectDifficulty = ($: any, difficulty: Difficulty) =>
  $?.simbot?.meta?.itemLibrary?.[0]?.difficulty?.includes(
    difficulty.toLowerCase(),
  );

export const validateReport = ($: any, difficulty: Difficulty) => {
  if ($?.sim?.options?.desired_targets > 1) return false;
  if ($?.sim?.options?.fight_style !== "Patchwerk") return false;
  if ($?.sim?.options?.max_time !== 300) return false;
  // if (!isCurrent($?.simbot?.date)) return false;
  if (!isCorrectDifficulty($, difficulty)) return false;
  return true;
};

const getEncounter = (item: any) => {
  const boss = item.item.encounter?.name;
  if (boss) return boss;

  const dungeonIds: string[] = item.item.sources.map(
    (src: any) => src.encounterId,
  );
  const dungeon = item.item.instance.encounters.find((en: any) =>
    dungeonIds.includes(en.id),
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
  $: any,
  difficulty: Difficulty,
): { data: Data; links: Links } => {
  const id = $?.simbot?.parentSimId ?? "id";
  const player = $?.sim?.players?.[0]?.name ?? "anon player";
  const current = $?.sim?.statistics?.raid_dps?.mean ?? 0;
  const results = $?.sim?.profilesets?.results ?? []; // numerical sim results
  const items = $?.simbot?.meta?.rawFormData?.droptimizerItems ?? []; // item description
  const color = $?.simbot?.meta?.rawFormData?.character?.class;

  // match itemset list with sim results list
  const data: ResultsData[] = items?.reduce((prev: any, item: any) => {
    const result = results?.reduce((prev: any, result: any) => {
      if (item.id !== result.name) return prev;
      if (prev?.mean > result.mean) return prev;
      return result;
    }, undefined);
    if (!result) return prev;

    const isTier = item.item.sourceItem?.name;
    const id = item.item.id;
    const slot = item.slot.replace(/[0-9]/g, "");
    const itemName = item.item.name;
    const column = isTier ? slot + " tier" : itemName;
    const boss = isTier ? "Catalyst" : getEncounter(item);
    const sim = Math.floor(result.mean - current);
    const bonus_id = item.item.bonus_id;
    const itemLevel = item.item.itemLevel;
    const link = `https://www.wowhead.com/item=${id}?bonus=${bonus_id}&ilvl=${itemLevel}`;
    const newEntry: ResultsData = { itemName, column, sim, boss, slot, link };

    // check for item variation, return normally if not found
    const index = prev.findIndex((x: any) => x.itemName === itemName);
    if (index === -1) return [...prev, newEntry];

    // other variation was better, use that
    if (prev[index.sim] > sim) return prev;

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
