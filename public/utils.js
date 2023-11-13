import { addWeeks, isWithinInterval, subWeeks } from "date-fns";

export const TIER_BY_SLOT = {
  // Tindral
  "Helm Tier": [
    "Zealous Pyreknight's Barbute",
    "Molten Vanguard's Domeplate",
    "Blazing Dreamstalker's Flamewaker Horns",
    "Lucid Shadewalker's Deathmask",
    "Crest of Lunar Communion",
    "Greatwolf Outcast's Jaws",
    "Wayward Chronomancer's Chronocap",
    "Devout Ashdevil's Grimhorns",
    "Mystic Heron's Hatsuburi",
    "Benevolent Embersage's Casque",
    "Screaming Torchfiend's Burning Scowl",
    "Piercing Gaze of the Risen Nightmare",
    "Weyrnkeeper's Timeless Dracoif",
  ],
  // Smolderon
  "Shoulders Tier": [
    "Zealous Pyreknight's Ailettes",
    "Molten Vanguard's Shouldervents",
    "Blazing Dreamstalker's Finest Hunt",
    "Lucid Shadewalker's Bladed Spaulders",
    "Shoulderguardians of Lunar Communion",
    "Greatwolf Outcast's Companions",
    "Wayward Chronomancer's Metronomes",
    "Devout Ashdevil's Hatespikes",
    "Mystic Heron's Hopeful Effigy",
    "Benevolent Embersage's Wisdom",
    "Screaming Torchfiend's Horned Memento",
    "Skewers of the Risen Nightmare",
    "Weyrnkeeper's Timeless Sandbrace",
  ],
  // Nymue
  "Chest Tier": [
    "Zealous Pyreknight's Warplate",
    "Molten Vanguard's Plackart",
    "Blazing Dreamstalker's Scaled Hauberk",
    "Lucid Shadewalker's Cuirass",
    "Cassock of Lunar Communion",
    "Greatwolf Outcast's Harness",
    "Wayward Chronomancer's Patchwork",
    "Devout Ashdevil's Razorhide",
    "Mystic Heron's Burdens",
    "Benevolent Embersage's Robe",
    "Screaming Torchfiend's Binding",
    "Casket of the Risen Nightmare",
    "Weyrnkeeper's Timeless Raiment",
  ],
  // Igira
  "Hands Tier": [
    "Zealous Pyreknight's Jeweled Gauntlets",
    "Molten Vanguard's Crushers",
    "Blazing Dreamstalker's Skinners",
    "Lucid Shadewalker's Clawgrips",
    "Touch of Lunar Communion",
    "Greatwolf Outcast's Grips",
    "Wayward Chronomancer's Gloves",
    "Devout Ashdevil's Claws",
    "Mystic Heron's Glovebills",
    "Benevolent Embersage's Talons",
    "Screaming Torchfiend's Grasp",
    "Thorns of the Risen Nightmare",
    "Weyrnkeeper's Timeless Clawguards",
  ],
  // Larodar
  "Legs Tier": [
    "Zealous Pyreknight's Cuisses",
    "Molten Vanguard's Steel Tassets",
    "Blazing Dreamstalker's Shellgreaves",
    "Lucid Shadewalker's Chausses",
    "Leggings of Lunar Communion",
    "Greatwolf Outcast's Fur-Lined Kilt",
    "Wayward Chronomancer's Pantaloons",
    "Devout Ashdevil's Tights",
    "Mystic Heron's Waders",
    "Benevolent Embersage's Leggings",
    "Screaming Torchfiend's Blazewraps",
    "Greaves of the Risen Nightmare",
    "Weyrnkeeper's Timeless Breeches",
  ],
  // Fyrakk
  "Role Trinket": [
    "Augury of the Primal Flame",
    "Blossom of Amirdrassil",
    "Fyrakk's Tainted Rageheart",
  ],
};

export const ITEMS_BY_BOSS = {
  Gnarlroot: [
    "Gnarlroot's Bonecrusher",
    "Staff of Incandescent Torment",
    "Defender of the Ancient",
    "Silent Tormentor's Hood",
    "Requiem Rootmantle",
    "Inflammable Drapeleaf",
    "Ancient Haubark",
    "Anguished Restraints",
    "Forlorn Leaf Clasp",
    "Seared Ironwood Greaves",
    "Twisted Blossom Stompers",
    "Branch of the Tormented Ancient",
  ],
  Igira: [
    "Legs Tier",
    "Cruel Dreamcarver",
    "Igira's Flaying Hatchet",
    "Drakestalker's Trophy Pauldrons",
    "Agonizing Manacles",
    "Bloody Dragonhide Belt",
    "Elder's Volcanic Wrap",
    "Signet of the Last Elder",
    "Bandolier of Twisted Blades",
  ],
  Volcoross: [
    "Volcoross's Barbed Fang",
    "Magmatic Volcannon",
    "Snake Eater's Cowl",
    "Volcanic Spelunker's Vents",
    "Vesture of the Smoldering Serpent",
    "Primordial Serpent's Bindings",
    "Flamewaker's Grips",
    "Jeweled Sash of the Viper",
    "Lavaforged Sollerets",
    "Lost Scholar's Belted Treads",
    "Coiled Serpent Idol",
    "Ouroboreal Necklet",
  ],
  Council: [
    "Sickle of the White Stag",
    "Thorncaller Claw",
    "Trickster's Captivating Chime",
    "Emerald Guardian's Casque",
    "Strigine Epaults",
    "Verdant Sanctuary Bands",
    "Vigilant Protector's Bracers",
    "Urctos's Hibernal Dial",
    "Aerwynn's Ritual Sarong",
    "Cleats of the Savage Claw",
    "Gift of Ursine Vengeance",
    "Pip's Emerald Friendship Badge",
  ],
  Larodar: [
    "Legs Tier",
    "Scythe of the Fallen Keeper",
    "Larodar's Moonblade",
    "Lost Scholar's Timely Hat",
    "Robes of the Ashen Grove",
    "Twisted Flamecuffs",
    "Phlegethic Girdle",
    "Band of Burning Thorns",
    "Smoldering Seedling",
  ],
  Nymue: [
    "Chest Tier",
    "Verdant Matrix Beacon",
    "Amulet of Eonar's Chosen",
    "Wellspring Wristlets",
    "Eldermoss Gauntlets",
    "Eternal Sentinel's Cord",
    "Lifewoven Slippers",
    "Nymue's Unraveling Spindle",
    "Dreambinder, Loom of the Great Cycle",
  ],
  Smolderon: [
    "Shoulder Tier",
    "Incandescent Soulcleaver",
    "Remnant Charglaive",
    "Mantle of Blazing Sacrifice",
    "Fading Flame Wristbands",
    "Fused Obsidian Sabatons",
    "Ashes of the Embersoul",
    "Cataclysmic Signet Brand",
  ],
  Tindral: [
    "Helm Tier",
    "Eternal Kindler's Greatstaff",
    "Betrayer's Charblade",
    "Ashen Ranger's Longbow",
    "Eye of the Rising Flame",
    "Flameseer's Winged Grasps",
    "Smoldering Chevalier's Greatbelt",
    "Tasseted Emberwalkers",
    "Belor'relos, the Suncaller",
  ],
  Fyrakk: [
    "Role Trinket",
    "Rashok, the Immortal Blaze",
    "Gholak, the Final Conflagration",
    "Vakash, the Shadowed Inferno",
    "Carapace of the Unbending Flame",
    "Twisting Shadow Claws",
    "Blooming Redeemer's Sash",
    "Frenzied Incarnate Legwraps",
    "Boots of the Molten Hoard",
  ],
};

export const ITEMS_FLAT = Object.keys(ITEMS_BY_BOSS).reduce(
  (prev, curr) => [...ITEMS_BY_BOSS[curr], ...prev],
  []
);

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
    start: subWeeks(new Date(), 1),
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
