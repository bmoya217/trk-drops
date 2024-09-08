import MuiTable from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import { FC, useState } from "react";
import {
  Data,
  Difficulty,
  Grouping,
  Links,
  Order,
} from "../../../public/types";
import { getHeadCells } from "../../../public/utils";
import Body from "./Body";
import Head from "./Head";

interface Props {
  data: Record<Difficulty, Data>;
  difficulty: Difficulty;
  grouping: Grouping;
  group: string;
  links: Links;
  loading: boolean;
}

const Table: FC<Props> = ({
  data,
  difficulty,
  grouping,
  group,
  links,
  loading,
}) => {
  const [order, setOrder] = useState(Order.desc);
  const [orderBy, setOrderBy] = useState("Player");

  const difficultyRows = data?.[difficulty]?.[grouping]?.[group] ?? [];
  const playerRows =
    grouping === Grouping.Player ? (data?.Dungeon?.Player?.[group] ?? []) : [];
  const rows = [...difficultyRows, ...playerRows];
  const headCells = getHeadCells(rows, grouping);

  const handleRequestSort = (_: any, property: string) => {
    const isDesc = orderBy === property && order === Order.desc;
    setOrder(isDesc ? Order.asc : Order.desc);
    setOrderBy(property);
  };

  return (
    <TableContainer>
      <MuiTable
        sx={{ minWidth: 750 }}
        aria-labelledby="tableTitle"
        size={"small"}
      >
        <Head
          headCells={headCells}
          links={links}
          order={order}
          orderBy={orderBy}
          onRequestSort={handleRequestSort}
        />

        <Body
          headCells={headCells}
          rows={rows}
          difficulty={difficulty}
          links={links}
          order={order}
          orderBy={orderBy}
          loading={loading}
        />
      </MuiTable>
    </TableContainer>
  );
};

export default Table;
