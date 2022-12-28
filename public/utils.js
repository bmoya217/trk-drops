import { addWeeks, isWithinInterval, subWeeks } from "date-fns";

export const TIER_BY_SLOT = {
  // Grimtotem
  "Chest Tier": [
    "Skybound Avenger's Harness",
    "Lost Landcaller's Robes",
    "Hauberk of the Awakened",
    "Stormwing Harrier's Cuirass",
    "Crystal Scholar's Tunic",
    "Chestwrap of the Waking Fist",
    "Virtuous Silver Breastplate",
    "Robe of Infused Earth",
    "Vault Delver's Brigandine",
    "Husk of the Walking Mountain",
    "Breastplate of the Haunted Frostbrood",
    "Scalesworn Cultist's Frock",
    "Draconic Hierophant's Vestment",
  ],
  // Dathea
  "Hands Tier": [
    "Skybound Avenger's Grips",
    "Lost Landcaller's Claws",
    "Gauntlets of the Awakened",
    "Stormwing Harrier's Handguards",
    "Crystal Scholar's Pageturners",
    "Palms of the Waking Fist",
    "Virtuous Silver Gauntlets",
    "Gauntlets of Infused Earth",
    "Vault Delver's Lockbreakers",
    "Gauntlets of the Walking Mountain",
    "Grasps of the Haunted Frostbrood",
    "Scalesworn Cultist's Gloves",
    "Draconic Hierophant's Grips",
  ],
  // Raszageth
  "Head Tier": [
    "Skybound Avenger's Visor",
    "Lost Landcaller's Antlers",
    "Crown of the Awakened",
    "Stormwing Harrier's Skullmask",
    "Crystal Scholar's Cowl",
    "Gaze of the Waking Fist",
    "Virtuous Silver Heaume",
    "Faceguard of Infused Earth",
    "Vault Delver's Vizard",
    "Casque of the Walking Mountain",
    "Maw of the Haunted Frostbrood",
    "Scalesworn Cultist's Scorn",
    "Draconic Hierophant's Archcowl",
  ],
  // Sennarath
  "Legs Tier": [
    "Skybound Avenger's Legguards",
    "Lost Landcaller's Leggings",
    "Legguards of the Awakened",
    "Stormwing Harrier's Greaves",
    "Crystal Scholar's Britches",
    "Legguards of the Waking Fist",
    "Virtuous Silver Cuisses",
    "Leggings of Infused Earth",
    "Vault Delver's Pantaloons",
    "Poleyns of the Walking Mountain",
    "Greaves of the Haunted Frostbrood",
    "Scalesworn Cultist's Culottes",
    "Draconic Hierophant's Britches",
  ],
  // Diurna
  "Shoulders Tier": [
    "Skybound Avenger's Ailerons",
    "Lost Landcaller's Mantle",
    "Talons of the Awakened",
    "Stormwing Harrier's Pinions",
    "Crystal Scholar's Beacons",
    "Mantle of the Waking Fist",
    "Virtuous Silver Pauldrons",
    "Calderas of Infused Earth",
    "Vault Delver's Epaulets",
    "Peaks of the Walking Mountain",
    "Jaws of the Haunted Frostbrood",
    "Scalesworn Cultist's Effigy",
    "Draconic Hierophant's Wisdom",
  ],
};

export const ITEMS_BY_BOSS = {
  Eranog: [
    "Searing Blazecaster",
    "Flame Marshal's Bulwark",
    "Eranog's Adorned Sallet",
    "Scaldrons of Molten Might",
    "Decorated Commander's Cindercloak",
    "Valdrakken Protector's Turncoat",
    "Flametender's Legwraps",
    "Seal of Diurna's Chosen"
  ],
  Terros: [
    "Awakened Planar Pillar",
    "Compressed Cultist's Frock",
    "Enduring Shard of Terros",
    "Faultline Mantle",
    "Fused Shale Waistband",
    "Gaze of the Living Quarry",
    "Quake-Detecting Seismostaff",
    "Rumbling Ruby",
    "Terros's Captive Core",
  ],
  Council: [
    "Councilor's Terrormask",
    "Twisted Loam Spaulders",
    "Embar's Ashen Hauberk",
    "Icewrath's Channeling Conduit",
    "Maul of the Earthshaper",
    "Opalfang's Earthbound Legguards",
    "Conjured Chillglobe",
    "Whispering Incarnate",
    "Awak'mani, Grimtotem's Legacy",
  ],
  Sennarth: [
    "Acid-Proof Webbing",
    "Caustic Coldsteel Slicer",
    "Chilled Silken Restraints",
    "Diamond-Etched Gauntlets",
    "Frostbreath Thumper",
    "Ice-Climber's Cleats",
    "Iceblood Deathsnare",
    "Unnatural Dripstone Cinch",
    "Legs Tier",
  ],
  Dathea: [
    "Ascended Squallspires",
    "Daring Chasm-Leapers",
    "Dathea's Cyclonic Cage",
    "Eye of the Vengeful Hurricane",
    "Infused Stormglaives",
    "Scepter of Drastic Measures",
    "Storm-Eater's Boon",
    "Windborne Hatsuburi",
    "Hands Tier",
  ],
  Grimtotem: [
    "All-Totem of the Master",
    "Awak'mani, Grimtotem's Legacy",
    "Controlled Current Technique",
    "Fist of the Grand Summoner",
    "Kurog's Thunderhooves",
    "Magatha's Spiritual Sash",
    "Scripture of Primal Devotion",
    "Surging-Song Conductors",
    "Treacherous Totem Wraps",
    "Chest Tier",
  ],
  Diurna: [
    "Broodkeeper's Promise",
    "Broodsworn Legionnaire's Pavise",
    "Eggtender's Safety Mitts",
    "Kharnalex, The First Light",
    "Loyal Flametender's Bracers",
    "Manic Grieftorch",
    "Matriarch's Opulent Girdle",
    "Ornamental Drakonid Claw",
    "Seal of Filial Duty",
    "Tassets of the Tarasek Legion",
    "Shoulders Tier",
  ],
  Raszageth: [
    "Calamitous Shockguards",
    "Desperate Invoker's Codex",
    "Incarnate Sky-Splitter",
    "Loathsome Thunderhosen",
    "Neltharax, Enemy of the Sky",
    "Sandals of the Wild Sovereign",
    "Shackles of Titanic Failure",
    "Spiteful Storm",
    "Stormlash's Last Resort",
    "Head Tier",
  ],
};

export const ITEMS_FLAT = [
  ...ITEMS_BY_BOSS.Eranog,
  ...ITEMS_BY_BOSS.Terros,
  ...ITEMS_BY_BOSS.Council,
  ...ITEMS_BY_BOSS.Sennarth,
  ...ITEMS_BY_BOSS.Dathea,
  ...ITEMS_BY_BOSS.Grimtotem,
  ...ITEMS_BY_BOSS.Diurna,
  ...ITEMS_BY_BOSS.Raszageth,
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
  $?.simbot?.meta?.itemLibrary?.[0]?.difficulty?.includes(difficulty.toLowerCase());

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
