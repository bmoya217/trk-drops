import MuiTable from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import { FC, useState } from "react";
import { Order } from "../../../public/types";
import Body from "./Body";
import Head from "./Head";

const Table: FC = () => {
  const [order, setOrder] = useState(Order.desc);
  const [orderBy, setOrderBy] = useState("Player");

  const onSort = (column: string) => {
    const isDesc = orderBy === column && order === Order.desc;
    setOrder(isDesc ? Order.asc : Order.desc);
    setOrderBy(column);
  };

  return (
    <TableContainer>
      <MuiTable aria-labelledby="tableTitle" size={"small"}>
        <Head order={order} orderBy={orderBy} onSort={onSort} />

        <Body order={order} orderBy={orderBy} />
      </MuiTable>
    </TableContainer>
  );
};

export default Table;
