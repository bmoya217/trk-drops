import { addWeeks, isWithinInterval, subWeeks } from "date-fns";
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

// Columns for each boss
export const ITEMS_BY_BOSS = {
  Ulgrax: [
    "Ulgrax's Morsel-Masher",
    "Venom-Etched Claw",
    "Husk of Swallowing Darkness",
    "Final Meal's Horns",
    "Seasoned Earthen Boulderplates",
    "Royal Emblem of Nerub-ar",
    "Bile-Soaked Harness",
    "Crunchy Intruder's Wristband",
    "Devourer's Taut Innards",
    "Greatbelt of the Hungerer",
    "Rebel's Drained Marrowslacks",
    "Undermoth-Lined Footpads",
    "Foul Behemoth's Chelicera",
  ],
  Bloodbound: [
    "Blood-Kissed Kukri",
    "Sceptor of Manifested Miasma",
    "Beyond's Dark Visage",
    "Beacons of the False Dawn",
    "Goresplattered Membrane",
    "Polluted Spectre's Cover",
    "Lost Watcher's Remains",
    "Shattered Eye Cincture",
    "Bloodbound Horror's Legplates",
    "Boots of the Black Bulwark",
    "Key to the Unseeming",
    "Aberrant Spellforge",
    "Creeping Coagulum",
  ],
  Sikran: [
    "Hands Tier",
    "Honored Executioner's Perforator",
    "Duelist's Dancing Steel",
    "Flawless Phase Blade",
    "Splintershot Silkbow",
    "Visor of the Evolved Captain",
    "Throne Defender's Bangles",
    "Chitin-Spiked Jackboots",
    "Cosmic-Tinged Treads",
    "Sikran's Endless Arsenal",
    "Sureki Zaelot's Insignia",
  ],
  "Rasha'nan": [
    "Shoulders Tier",
    "Bludgeons of Blistering Wind",
    "Predator's Feasthooks",
    "Devotee's Discarded Headdress",
    "Locket of Broken Memories",
    "Ravaged Lamplighter's Manacles",
    "Behemoth's Eroded Cinch",
    "Rasha'nan's Grotesque Talons",
    "Skyterror's Corrosive Organ",
    "Wings of Shattered Sorrow",
  ],
  Broodtwister: [
    "Chest Tier",
    "Spire of Transfused Horrors",
    "Broodtwister's Grim Catalyst",
    "Sanguine Experiment's Bandages",
    "Black Blood Injectors",
    "Accelerated Evolution Coil",
    "Assimilated Eggshell Slippers",
    "Writhing Ringworm",
    "Gruesome Syringe",
    "Ovinax's Mercurial Egg",
  ],
  Nexus: [
    "Legs Tier",
    "Regicide",
    "Shade-Touched Silencer",
    "Ky-veza's Covert Clasps",
    "Binding of the Starless Night",
    "Nether Bounty's Greatbelt",
    "Fleeting Massacre Footpads",
    "Treacherous Transmitter",
    "Void Reaper's Contract",
    "Void Reaper's Warp Blade",
  ],
  "Silken Court": [
    "Helm Tier",
    "Anub'arash's Colossal Mandible",
    "Takazj's Entropic Edict",
    "Silken Advisor's Favor",
    "Whispering Voidlight Spaulders",
    "Skeinspinner's Duplicitous Cuffs",
    "Thousand-Scar Impalers",
    "Shattershell Greaves",
    "Spymaster's Web",
    "Swarmlord's Authority",
  ],
  Ansurek: [
    "Ansurek's Final Judgement",
    "Sovereign's Disdain",
    "Crest of the Caustic Despot",
    "Frame of Felled Insurgents",
    "Omnivore's Venomous Camouflage",
    "Queensguard's Carapace",
    "Devoted Offering's Irons",
    "Clutches of Paranoia",
    "Acrid Ascendant's Sash",
    "Liquidifed Defector's Leggings",
    "Voidspoken Sarong",
    "Mad Queen's Mandate",
    "Seal of the Poisoned Pact",
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

export const buildResults = (results, items, current) =>
  results?.reduce((prev, curr) => {
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

export const formatResults = ($) => {
  const results = selectResults($);
  const items = selectDroptimizerItems($);
  const current = selectCurrent($);
  return buildResults(results, items, current);
};
