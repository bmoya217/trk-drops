export const TIER_BY_SLOT = {
  "Hands Tier": [],
  "Chest Tier": [],
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
  "Primal Council": [
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
    "Dreadful Jade Forgestone",
    "Frostbreath Thumper",
    "Ice-Climber's Cleats",
    "Iceblood Deathsnare",
    "Mystic Jade Forgestone",
    "Unnatural Dripstone Cinch",
    "Venerated Jade Forgestone",
    "Zenith Jade Forgestone",
  ],
  Dathea: [
    "Ascended Squallspires",
    "Daring Chasm-Leapers",
    "Dathea's Cyclonic Cage",
    "Dreadful Garnet Forgestone",
    "Eye of the Vengeful Hurricane",
    "Infused Stormglaives",
    "Mystic Garnet Forgestone",
    "Scepter of Drastic Measures",
    "Storm-Eater's Boon",
    "Venerated Garnet Forgestone",
    "Windborne Hatsuburi",
    "Zenith Garnet Forgestone",
  ],
  Grimtotem: [
    "All-Totem of the Master",
    "Awak'mani, Grimtotem's Legacy",
    "Controlled Current Technique",
    "Dreadful Amethyst Forgestone",
    "Fist of the Grand Summoner",
    "Kurog's Thunderhooves",
    "Magatha's Spiritual Sash",
    "Mystic Amethyst Forgestone",
    "Scripture of Primal Devotion",
    "Surging-Song Conductors",
    "Treacherous Totem Wraps",
    "Venerated Amethyst Forgestone",
    "Zenith Amethyst Forgestone",
  ],
  Diurna: [
    "Broodkeeper's Promise",
    "Broodsworn Legionnaire's Pavise",
    "Dreadful Lapis Forgestone",
    "Eggtender's Safety Mitts",
    "Kharnalex, The First Light",
    "Loyal Flametender's Bracers",
    "Manic Grieftorch",
    "Matriarch's Opulent Girdle",
    "Mystic Lapis Forgestone",
    "Ornamental Drakonid Claw",
    "Seal of Filial Duty",
    "Tassets of the Tarasek Legion",
    "Venerated Lapis Forgestone",
    "Zenith Lapis Forgestone",
  ],
  Raszageth: [
    "Calamitous Shockguards",
    "Desperate Invoker's Codex",
    "Dreadful Topaz Forgestone",
    "Incarnate Sky-Splitter",
    "Loathsome Thunderhosen",
    "Mystic Topaz Forgestone",
    "Neltharax, Enemy of the Sky",
    "Sandals of the Wild Sovereign",
    "Shackles of Titanic Failure",
    "Spiteful Storm",
    "Stormlash's Last Resort",
    "Venerated Topaz Forgestone",
    "Zenith Topaz Forgestone",
  ],
};

export const ITEMS_FLAT = [
  ...ITEMS_BY_BOSS.Eranog,
  ...ITEMS_BY_BOSS.Terros,
  ...ITEMS_BY_BOSS["Primal Council"],
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

export const fetchReports = async () => {
  const page = await fetch("api/reports").catch(() => null);
  if (page?.status !== 200) return [];

  return page.json();
};

export const selectId = ($) => $?.simbot?.parentSimId ?? "id";
export const selectPlayer = ($) => $?.sim?.players?.[0]?.name ?? "anon player";
export const selectResults = ($) => $?.sim?.profilesets?.results ?? [];
export const selectCurrent = ($) => $?.sim?.statistics?.raid_dps?.mean ?? 0;
export const selectDroptimizerItems = ($) =>
  $?.simbot?.meta?.rawFormData?.droptimizerItems ?? [];

export const getItemName = (item) => {
  const slot = TIER_BY_SLOT.find((slot) => slot.includes(item));
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
