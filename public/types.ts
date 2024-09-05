export enum Order {
  asc = "asc",
  desc = "desc",
}

export enum Team {
  Royal = "Royal",
  Kingdom = "Kingdom",
}

export enum Difficulty {
  Mythic = "Mythic",
  Heroic = "Heroic",
}

export enum Grouping {
  Boss = "Boss",
  Player = "Player",
}

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
export type Row = Record<string, string | number>;

export type Data = {
  [key in Grouping]: Record<string, Array<Row>>;
};
