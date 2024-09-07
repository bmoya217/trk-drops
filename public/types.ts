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

export type Links = Record<string, string>;
