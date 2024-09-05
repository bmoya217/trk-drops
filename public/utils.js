import { addWeeks, isWithinInterval, subWeeks } from "date-fns";

export const BOSS_BY_SLOT = {
  head: "The Silken Court",
  shoulder: "Rasha'nan",
  chest: "Broodtwister Ovi'nax",
  hands: "Sikran, Captain of the Sureki",
  legs: "Nexus-Princess Ky'veza",
};

// Converts multiple items to a single column in the table
export const TIER_BY_SLOT = {
  // Silken Court
  "Helm Tier": [
    "Entombed Seraph's Casque",
    "Warscupltor's Barbute",
    "Lightless Scavenger's Skull",
    "K'areshi Phantom's Emptiness",
    "Living Luster's Semblance",
    "Noetic of the Forgotten Reservoir",
    "Hood of Violet Rebirth",
    "Hexflame Coven's All-Seeing Eye",
    "Gatecrasher's Horns",
    "Mask of the Greatlynx",
    "Impalers of the Hypogeal Nemesis",
    "Exhumed Centurion's Galea",
    "Horns of the Destroyer",
  ],
  // Rasha'nan
  "Shoulders Tier": [
    "Entombed Seraph's Plumes",
    "Warscupltor's Horned Spaulders",
    "Lightless Scavenger's Taxidermy",
    "K'areshi Phantom's Shoulderpads",
    "Living Luster's Dominion",
    "Concourse of the Forgotten Reservoir",
    "Beacons of Violet Rebirth",
    "Hexflame Coven's Altar",
    "Gatecrasher's Enduring Effigy",
    "Maw of the Greatlynx",
    "War-Mantle of the Hypogeal Nemesis",
    "Exhumed Centurion's Spikes",
    "Fumaroles of the Destroyer",
  ],
  // Broodtwister Ovi'nax
  "Chest Tier": [
    "Entombed Seraph's Breastplate",
    "Warscupltor's Furred Plastron",
    "Lightless Scavenger's Tunic",
    "K'areshi Phantom's Nexus Wraps",
    "Living Luster's Raiment",
    "Vestments of the Forgotten Reservoir",
    "Runecoat of Violet Rebirth",
    "Hexflame Coven's Ritual Harness",
    "Gatecrasher's Gi",
    "Hide of the Greatlynx",
    "Chestguard of the Hypogeal Nemesis",
    "Exhumed Centurion's Breastplate",
    "Scales of the Destroyer",
  ],
  // Sikran, Captain of the Sureki
  "Hands Tier": [
    "Entombed Seraph's Castigation",
    "Warscupltor's Crushers",
    "Lightless Scavenger's Mitts",
    "K'areshi Phantom's Grips",
    "Living Luster's Touch",
    "Covenant of the Forgotten Reservoir",
    "Jeweled Gauntlets of Violet Rebirth",
    "Hexflame Coven's Sleeves",
    "Gatecrasher's Protectors",
    "Eviscerators of the Greatlynx",
    "Claws of the Hypogeal Nemesis",
    "Exhumed Centurion's Gauntlets",
    "Rippers of the Destroyer",
  ],
  // Nexus Princess
  "Legs Tier": [
    "Entombed Seraph's Greaves",
    "Warscupltor's Cuisses",
    "Lightless Scavenger's Stalkings",
    "K'areshi Phantom's Leggings",
    "Living Luster's Trousers",
    "Sarong of the Forgotten Reservoir",
    "Coattails of Violet Rebirth",
    "Hexflame Coven's Leggings",
    "Gatecrasher's Kilt",
    "Leggings of the Greatlynx",
    "Pantaloons of the Hypogeal Nemesis",
    "Exhumed Centurion's Chausses",
    "Legguards of the Destroyer",
  ],
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

export const openReport = (id) => () => {
  window.open("https://www.raidbots.com/simbot/report/" + id, "_blank").focus();
};

export const descendingComparator = (order, orderBy) => (a, b) => {
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

export const getComparator = (order, orderBy) => {
  return order === "desc"
    ? (a, b) => descendingComparator(order, orderBy)(a, b)
    : (a, b) => -descendingComparator(order, orderBy)(a, b);
};

export const getHeadCells = (rows = [], grouping) => {
  if (grouping === "Player") return ["name", ...SLOTS];

  let headCells = new Set();
  rows.forEach((row) => Object.keys(row).forEach((key) => headCells.add(key)));
  headCells.delete("Player");
  headCells.delete("id");
  return ["Player", ...[...headCells.keys()].sort()];
};

export const fetchReport = async (report) => {
  const page = await fetch("api/report?report=" + report).catch(() => null);
  if (page?.status !== 200) return {};

  return page.json();
};

export const fetchReports = async (team, difficulty) => {
  const page = await fetch(
    `api/reports?team=${team}&difficulty=${difficulty}`
  ).catch(() => null);
  if (page?.status !== 200) return [];

  return page.json();
};

const isCurrent = (timestamp) =>
  isWithinInterval(timestamp, {
    start: subWeeks(new Date(), 1),
    end: addWeeks(new Date(), 1),
  });

const isCorrectDifficulty = ($, difficulty) =>
  $?.simbot?.meta?.itemLibrary?.[0]?.difficulty?.includes(
    difficulty.toLowerCase()
  );

const isUpgradeEquipped = ($) =>
  $?.simbot?.meta?.rawFormData?.droptimizer?.upgradeEquipped;

export const validateReport = ($, difficulty) => {
  if ($?.sim?.options?.desired_targets > 1) return false;
  if ($?.sim?.options?.fight_style !== "Patchwerk") return false;
  if ($?.sim?.options?.max_time !== 300) return false;
  if (!isCurrent($?.simbot?.date)) return false;
  if (!isCorrectDifficulty($, difficulty)) return false;
  if (!isUpgradeEquipped($)) return false;
  return true;
};
export const selectId = ($) => $?.simbot?.parentSimId ?? "id";
export const selectPlayer = ($) => $?.sim?.players?.[0]?.name ?? "anon player";
export const selectResults = ($) => $?.sim?.profilesets?.results ?? [];
export const selectCurrent = ($) => $?.sim?.statistics?.raid_dps?.mean ?? 0;
export const selectDroptimizerItems = ($) =>
  $?.simbot?.meta?.rawFormData?.droptimizerItems ?? [];

export const getItemName = (item) => {
  const slot = Object.keys(TIER_BY_SLOT).find((slot) =>
    TIER_BY_SLOT[slot].includes(item)
  );
  if (slot) return slot;
  return item;
};

/*
  [grouping]: {
    [group]: [
      {
        [col]: [value],
        [col]: [value],
        [col]: [value],
        ...
      },
      ...
    ]
  },
  */
export const formatResults = ($) => {
  const id = selectId($);
  const player = selectPlayer($);
  const current = selectCurrent($);
  const results = selectResults($); // numerical sim results
  const items = selectDroptimizerItems($); // item description

  // match itemset list with sim results list
  const data = results?.reduce((prev, curr) => {
    const item = items?.find((item) => item.id === curr.name);
    if (!item) return prev; // likely a trash drop

    const itemName = getItemName(item.item.name);
    const sim = Math.floor(curr.mean - current);
    const boss = item.item.encounter.name;
    const slot = item.slot.replace(/[0-9]/g, "");

    // Tier is simmed multiple times for some reason, ignore the bad ones
    const isTier = itemName !== item.item.name;
    const tierBoss = boss === BOSS_BY_SLOT[slot];
    if (isTier && !tierBoss) return prev;

    // look for rings/trinkets slot variation already
    const index = prev.findIndex((x) => x.itemName === itemName);
    if (index === -1) return [...prev, { itemName, sim, boss, slot }];

    if (prev[index.sim] > curr.mean - current) return prev;

    return [
      ...prev.slice(0, index),
      { itemName, sim, boss, slot },
      ...prev.slice(index + 1),
    ];
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
            id,
          },
        ],
      ];
    })
  );

  const Player = {
    [player]: data.map((d) => ({ name: d.itemName, [d.slot]: d.sim })),
  };

  return { Boss, Player };
};
