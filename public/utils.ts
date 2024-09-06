import { addWeeks, isWithinInterval, subWeeks } from "date-fns";
import { Difficulty, Grouping, Order, Row, Team } from "./types";

export const BOSS_BY_SLOT = {
  head: "The Silken Court",
  shoulder: "Rasha'nan",
  chest: "Broodtwister Ovi'nax",
  hands: "Sikran, Captain of the Sureki",
  legs: "Nexus-Princess Ky'veza",
};

// Groups by boss
export const BOSSES = [
  "Ulgrax the Devourer",
  "The Bloodbound Horror",
  "Sikran, Captain of the Sureki",
  "Rasha'nan",
  "Broodtwister Ovi'nax",
  "Nexus-Princess Ky'veza",
  "The Silken Court",
  "Queen Ansurek",
  "Catalyst",
];

// Columns for each player
export const SLOTS = [
  "head",
  "neck",
  "shoulder",
  "back",
  "chest",
  "wrist",
  "hands",
  "waist",
  "legs",
  "feet",
  "finger",
  "trinket",
  "main_hand",
  "off_hand",
];

export const openReport = (id: string) => () => {
  window.open("https://www.raidbots.com/simbot/report/" + id, "_blank").focus();
};

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
  if (grouping === "Player") return ["Item", ...SLOTS];

  let headCells = new Set<string>();
  rows.forEach((row) => Object.keys(row).forEach((key) => headCells.add(key)));
  headCells.delete("Player");
  headCells.delete("id");
  headCells.delete("href");
  return ["Player", ...Array.from(headCells).sort()];
};

export const fetchReport = async (report: string) => {
  const page = await fetch("api/report?report=" + report, {
    cache: "force-cache",
  }).catch(() => null);
  if (page?.status !== 200) return {};

  return page.json();
};

export const fetchReports = async (team: Team, difficulty: Difficulty) => {
  const page = await fetch(
    `api/reports?team=${team}&difficulty=${difficulty}`,
    { cache: "no-store" }
  ).catch(() => null);
  if (page?.status !== 200) return [];

  return page.json();
};

const isCurrent = (timestamp: number) =>
  isWithinInterval(timestamp, {
    start: subWeeks(new Date(), 1),
    end: addWeeks(new Date(), 1),
  });

const isCorrectDifficulty = ($: any, difficulty: Difficulty) =>
  $?.simbot?.meta?.itemLibrary?.[0]?.difficulty?.includes(
    difficulty.toLowerCase()
  );

const isUpgradeEquipped = ($: any) =>
  $?.simbot?.meta?.rawFormData?.droptimizer?.upgradeEquipped;

export const validateReport = ($: any, difficulty: Difficulty) => {
  if ($?.sim?.options?.desired_targets > 1) return false;
  if ($?.sim?.options?.fight_style !== "Patchwerk") return false;
  if ($?.sim?.options?.max_time !== 300) return false;
  if (!isCurrent($?.simbot?.date)) return false;
  if (!isCorrectDifficulty($, difficulty)) return false;
  if (!isUpgradeEquipped($)) return false;
  return true;
};

type ResultsData = {
  itemName: string;
  sim: string;
  boss: string;
  slot: string;
  id: string;
  bonus_id: string;
  itemLevel: number;
};

export const formatResults = ($: any) => {
  const id = $?.simbot?.parentSimId ?? "id";
  const player = $?.sim?.players?.[0]?.name ?? "anon player";
  const current = $?.sim?.statistics?.raid_dps?.mean ?? 0;
  const results = $?.sim?.profilesets?.results ?? []; // numerical sim results
  const items = $?.simbot?.meta?.rawFormData?.droptimizerItems ?? []; // item description

  // match itemset list with sim results list
  const data: ResultsData[] = items?.reduce((prev: any, item: any) => {
    const result = results?.reduce((prev: any, result: any) => {
      if (item.id !== result.name) return prev;
      if (prev?.mean > result.mean) return prev;
      return result;
    }, undefined);
    if (!result) return prev;

    const sourceItem = item.item.sourceItem;
    const isCatalyst = item.item.tags?.find(
      (tag: string) => tag === "catalyst"
    );

    const id = item.item.id;
    const slot = item.slot.replace(/[0-9]/g, "");
    const itemName = sourceItem?.name ? slot + " tier" : item.item.name;
    const boss = isCatalyst ? "Catalyst" : item.item.encounter.name;
    const sim = Math.floor(result.mean - current);
    const bonus_id = item.item.bonus_id;
    const itemLevel = item.item.itemLevel;
    const newEntry = { itemName, sim, boss, slot, id, bonus_id, itemLevel };

    // ignore tier that isn't on the right boss
    if (
      sourceItem &&
      !isCatalyst &&
      boss !== BOSS_BY_SLOT[slot as keyof typeof BOSS_BY_SLOT]
    )
      return prev;

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
                .map((e) => [e.itemName, e.sim])
            ),
            Player: player,
            href: `https://www.raidbots.com/simbot/report/${id}`,
          },
        ],
      ];
    })
  );

  const Player = {
    [player]: data.map((d) => ({
      Item: d.itemName,
      [d.slot]: d.sim,
      href: `https://www.wowhead.com/item=${d.id}?bonus=${d.bonus_id}&ilvl=${d.itemLevel}`,
    })),
  };

  return { Boss, Player };
};
