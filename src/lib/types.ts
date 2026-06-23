export enum Screen {
  Small = "Small",
  Large = "Large",
}

export enum Difficulty {
  Mythic = "Mythic",
  Heroic = "Heroic",
  Dungeon = "Dungeon",
}

export enum Grouping {
  Boss = "Boss",
  Player = "Player",
}

export enum View {
  Table = "Table",
  Chart = "Chart",
  List = "List",
}

export enum ArmorType {
  All = "All",
  Cloth = "Cloth",
  Leather = "Leather",
  Mail = "Mail",
  Plate = "Plate",
}

export type ReportsByDifficulty = Record<Difficulty, string[]>;
export type ReportCsvRow = Record<Difficulty, string>;

export interface RaidbotsReport {
  sim?: {
    options?: {
      desired_targets?: number;
      fight_style?: string;
      max_time?: number;
    };
    players?: Array<{
      name?: string;
    }>;
    profilesets?: {
      results?: RaidbotsProfileResult[];
    };
    statistics?: {
      raid_dps?: {
        mean?: number;
      };
    };
  };
  simbot?: {
    date?: number | string;
    meta?: {
      itemLibrary?: Array<{
        difficulty?: string;
      }>;
      rawFormData?: {
        character?: {
          class?: number;
        };
        droptimizerItems?: RaidbotsDroptimizerItem[];
      };
    };
    parentSimId?: string;
  };
}

export interface RaidbotsProfileResult {
  mean?: number;
  name?: string;
}

export interface RaidbotsDroptimizerItem {
  id?: string;
  item: {
    bonus_id?: string | number;
    encounter?: {
      name?: string;
    };
    id?: string | number;
    instance?: {
      encounters?: Array<{
        id?: string;
        name?: string;
      }>;
    };
    itemLevel?: number;
    name?: string;
    sourceItem?: {
      name?: string;
    };
    sources?: Array<{
      encounterId?: string;
    }>;
  };
  slot: string;
}

/*
data = {
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
}
data[grouping][group][row][col] = value
  */
export type Row = Record<string, string | number>;

export type Data = {
  [key in Grouping]: Record<string, Array<Row>>;
};

export type ByDifficulty = Record<Difficulty, Data>;

export type Links = Record<string, string>;

export enum Order {
  asc = "asc",
  desc = "desc",
}
