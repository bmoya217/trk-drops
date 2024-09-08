import MuiTable from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import { FC, useState } from "react";
import { Difficulty, Links, Order, Row } from "../../../public/types";
import Body from "./Body";
import Head from "./Head";

interface Props {
  difficulty: Difficulty;
  headCells: string[];
  rows: Row[];
  links: Links;
  loading: boolean;
}

const Table: FC<Props> = ({ difficulty, headCells, rows, links, loading }) => {
  const [order, setOrder] = useState(Order.desc);
  const [orderBy, setOrderBy] = useState("Player");

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
