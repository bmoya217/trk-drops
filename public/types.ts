export enum Screen {
  Small = "Small",
  Large = "Large",
}

export enum Team {
  Royal = "Royal",
  Kingdom = "Kingdom",
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
}

export type Reports_Difficulty = Record<Difficulty, string[]>;
export type Reports_Team = Record<Team, Reports_Difficulty>;
export interface Records extends Record<Difficulty, string> {
  Team: Team;
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

export type ByTeam = Record<Team, ByDifficulty>;

export type Links = Record<string, string>;

export enum Order {
  asc = "asc",
  desc = "desc",
}
