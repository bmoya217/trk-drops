import { addWeeks, isWithinInterval, subWeeks } from "date-fns";

export const TIER_BY_SLOT = {
  // Magmorax
  "Helm Tier": [
    "Lingering Phantom's Dreadhorns",
    "Kinslayer's Hood",
    "Bough of the Autumn Blaze",
    "Crown of Obsidian Secrets",
    "Ashen Predator's Faceguard",
    "Underlight Conjurer's Arcanocowl",
    "Cover of the Vermillion Forge",
    "Heartfire Sentinel's Forgehelm",
    "Mask of the Furnace Seraph",
    "Lurking Specter's Visage",
    "Spangenhelm of the Cinderwolf",
    "Grimhorns of the Sinister Savant",
    "Thraexhelm of the Onyx Crucible",
  ],
  // Neltharion
  "Shoulders Tier": [
    "Lingering Phantom's Shoulderplates",
    "Kinslayer's Tainted Spaulders",
    "Mantle of the Autumn Blaze",
    "Wingspan of Obsidian Secrets",
    "Ashen Predator's Trophy",
    "Underlight Conjurer's Aurora",
    "Spines of the Vermillion Forge",
    "Heartfire Sentinel's Steelwings",
    "Devotion of the Furnace Seraph",
    "Lurking Specter's Shoulderblades",
    "Thunderpads of the Cinderwolf",
    "Amice of the Sinister Savant",
    "Pauldrons of the Onyx Crucible",
  ],
  // Zskarn
  "Chest Tier": [
    "Lingering Phantom's Plackart",
    "Kinslayer's Vest",
    "Chestroots of the Autumn Blaze",
    "Hauberk of Obsidian Secrets	",
    "Ashen Predator's Sling Vest",
    "Underlight Conjurer's Vestment",
    "Cuirass of the Vermillion Forge",
    "Heartfire Sentinel's Brigandine",
    "Command of the Furnace Seraph",
    "Lurking Specter's Brigandine",
    "Adornments of the Cinderwolf",
    "Cursed Robes of the Sinister Savant",
    "Battlechest of the Onyx Crucible",
  ],
  // Experiments
  "Hands Tier": [
    "Lingering Phantom's Gauntlets",
    "Kinslayer's Bloodstained Grips",
    "Handguards of the Autumn Blaze",
    "Claws of Obsidian Secrets",
    "Ashen Predator's Skinners",
    "Underlight Conjurer's Gloves",
    "Fists of the Vermillion Forge",
    "Heartfire Sentinel's Protectors",
    "Grasp of the Furnace Seraph",
    "Lurking Specter's Handgrips",
    "Knuckles of the Cinderwolf",
    "Grips of the Sinister Savant",
    "Handguards of the Onyx Crucible",
  ],
  // Rashok
  "Legs Tier": [
    "Lingering Phantom's Schynbalds",
    "Kinslayer's Legguards",
    "Pants of the Autumn Blaze",
    "Chausses of Obsidian Secrets",
    "Ashen Predator's Poleyns",
    "Underlight Conjurer's Trousers",
    "Pantaloons of the Vermillion Forge",
    "Heartfire Sentinel's Faulds",
    "Breeches of the Furnace Seraph",
    "Lurking Specter's Tights",
    "Braies of the Cinderwolf",
    "Leggings of the Sinister Savant",
    "Legplates of the Onyx Crucible",
  ],
  // Neltharion
  "Class Trinket": [
    "Neltharion's Call to Chaos",
    "Neltharion's Call to Suffering",
    "Neltharion's Call to Dominance",
  ],
};

export const ITEMS_BY_BOSS = {
  Kazzara: [
    "Etchings of the Captive Revenant",
    "Reanimator's Wicked Cassock",
    "Sash of Abandoned Hope",
    "Violent Gravemask",
    "Bloodstench Skinguards",
    "Grasps of Welded Anguish",
    "Kazzara's Grafted Companion",
    "Hellsteel Mutilator",
    "Dreadrift Stompers",
    "Enduring Dreadplate",
    "Screaming Black Dragonscale",
    "Infernal Shadelance",
  ],
  Amalgamation: [
    "Entropic Convergence Loop",
    "Attendant's Concocting Cover",
    "Unstable Vial Handlers",
    "Tassets of Blistering Twilight",
    "Cuirass of Meticulous Mixture",
    "Gloomfused Chemistry Belt",
    "Scholar's Thinking Cudgel",
    "Shoulderplates of Planar Isolation",
    "Elementium Pocket Anvil",
    "Vessel of Searing Shadow",
    "Obsidian Stirring Staff",
  ],
  Experiments: [
    "Hands Tier",
    "Discarded Creation's Restraint",
    "Neldris's Sinewy Scapula",
    "Exacting Augmenter's Sabatons",
    "Thadrion's Erratic Arcanotrode",
    "Rionthus's Bladed Visage",
    "Manacles of Cruel Progress",
    "Experiment 1, Kitewing",
    "Ominous Chromatic Essence",
  ],
  Assault: [
    "Kagni's Scorching Talisman",
    "Phoenix-Plume Gloves",
    "Mystic's Scalding Frame",
    "Warlord's Volcanic Vest",
    "Flamebound Huntsman's Footpads",
    "Gatecrasher Giant's Coif",
    "Boulder-Tossing Bands",
    "Wallclimber's Incursion Hatchet",
    "Obsidian Guard's Chausses",
    "Seal of the Defiant Hordes",
    "Brutal Dragonslayer's Trophy",
    "Zaqali Chaos Grapnel",
  ],
  Rashok: [
    "Legs Tier",
    "Tormentor's Siphoning Signet",
    "Sandals of Ancient Fury",
    "Elder's Volcanic Binding",
    "Shackles of the Shadowed Bastille",
    "Bloodfire Extraction Conduit",
    "Unyielding Goliath's Burgonet",
    "Rashok's Molten Heart",
    "Djaruun, Pillar of the Elder Flame",
  ],
  Zskarn: [
    "Chest Tier",
    "Drape of the Dracthyr Trials",
    "Clasps of the Diligent Steward",
    "Failed Applicant's Footpads",
    "Proctor's Tactical Cleaver",
    "Zskarn's Autopsy Scalpel",
    "Recycled Golemskin Waistguard",
    "Failure Disposal Cannon",
    "Dragonfire Bomb Dispenser",
  ],
  Magmorax: [
    "Helm Tier",
    "Magmorax's Fourth Collar",
    "Cuffs of the Savage Serpent",
    "Hydratooth Girdle",
    "Claws of the Blazing Behemoth",
    "Lavaflow Control Rod",
    "Spittle-Resistant Sollerets",
    "Igneous Flowstone",
  ],
  Neltharion: [
    "Shoulders Tier",
    "Class Trinket",
    "Onyx Impostor's Birthright",
    "Treads of Fractured Realities",
    "Echo's Maddening Volume",
    "Twisted Vision's Demigaunts",
    "Calamity's Herald",
    "Ward of Faceless Ire",
    "Ashkandur, Fall of the Brotherhood",
  ],
  Sarkareth: [
    "Voice of the Silent Star",
    "Coattails of the Rightful Heir",
    "Oathbreaker's Obsessive Gauntlets",
    "Oblivion's Immortal Coil",
    "Crechebound Soldier's Boots",
    "Scalecommander's Ebon Schynbalds",
    "Fang of the Sundered Flame",
    "Sarkareth's Abyssal Embrace",
    "Bonds of Desperate Ascension",
    "Beacon to the Beyond",
    "Erethos, the Empty Promise",
  ],
};

export const ITEMS_FLAT = [
  ...ITEMS_BY_BOSS.Kazzara,
  ...ITEMS_BY_BOSS.Amalgamation,
  ...ITEMS_BY_BOSS.Experiments,
  ...ITEMS_BY_BOSS.Assault,
  ...ITEMS_BY_BOSS.Rashok,
  ...ITEMS_BY_BOSS.Zskarn,
  ...ITEMS_BY_BOSS.Magmorax,
  ...ITEMS_BY_BOSS.Neltharion,
  ...ITEMS_BY_BOSS.Sarkareth,
];

export const EMPTY_ROW = ITEMS_FLAT.reduce((prev, curr) => {
  return {
    ...prev,
    [curr]: 0,
  };
}, {});

export const descendingComparator = (a, b, orderBy) => {
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
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
};

export const createHeadCell = (name, numeric) => ({
  id: name,
  numeric: Boolean(numeric),
  disablePadding: true,
  label: name,
});

export const getHeadCells = (boss) => {
  const bossItems = boss && ITEMS_BY_BOSS[boss];
  if (!bossItems) return ["Player", ...ITEMS_FLAT].map(createHeadCell);

  return ["Player", ...bossItems].map(createHeadCell);
};

export const fetchReport = async (report) => {
  const page = await fetch("api/report?report=" + report).catch(() => null);
  if (page?.status !== 200) return {};

  return page.json();
};

export const fetchReports = async (difficulty) => {
  const page = await fetch("api/reports?difficulty=" + difficulty).catch(
    () => null
  );
  if (page?.status !== 200) return [];

  return page.json();
};

const isCurrent = (timestamp) =>
  isWithinInterval(timestamp, {
    start: subWeeks(new Date(), 3),
    end: addWeeks(new Date(), 1),
  });

const isCorrectDifficulty = ($, difficulty) =>
  $?.simbot?.meta?.itemLibrary?.[0]?.difficulty?.includes(
    difficulty.toLowerCase()
  );

export const validateReport = ($, difficulty) => {
  if ($?.sim?.options?.desired_targets > 1) return false;
  if ($?.sim?.options?.fight_style !== "Patchwerk") return false;
  if ($?.sim?.options?.max_time !== 300) return false;
  if (!isCurrent($?.simbot?.date)) return false;
  if (!isCorrectDifficulty($, difficulty)) return false;
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

export const formatResults = ($) => {
  const results = selectResults($);
  const items = selectDroptimizerItems($);
  const current = selectCurrent($);

  return results?.reduce((prev, curr) => {
    const item = items?.find((item) => item.id === curr.name);
    if (!item) return prev; // likely a trash drop

    const key = getItemName(item.item.name);

    // rings/trinkets that have better variation already
    if (prev[key] !== undefined && prev[key] > curr.mean - current) return prev;

    return {
      ...prev,
      [key]: Math.floor(curr.mean - current),
    };
  }, {});
};
