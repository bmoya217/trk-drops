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

export type Reports_Difficulty = Record<Difficulty, string[]>;
export type Records = Record<Difficulty, string>;

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
