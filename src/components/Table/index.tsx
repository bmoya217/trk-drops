import MuiTable from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import { FC, useEffect, useState } from "react";
import { Grouping, Order } from "../../lib/types";
import { useAppSelector } from "../../store/hooks";
import { dataSlice } from "../../store/slices/dataSlice";
import Body from "./Body";
import Head from "./Head";

const getDefaultSortColumn = (grouping: Grouping) =>
  grouping === Grouping.Player ? "DPS" : "Player";

const Table: FC = () => {
  const grouping = useAppSelector(dataSlice.selectors.selectGrouping);
  const armorTypes = useAppSelector(dataSlice.selectors.selectArmorTypes);
  const slots = useAppSelector(dataSlice.selectors.selectSlots);
  const [order, setOrder] = useState(Order.desc);
  const [orderBy, setOrderBy] = useState("Player");

  useEffect(() => {
    setOrder(Order.desc);
    setOrderBy(getDefaultSortColumn(grouping));
  }, [armorTypes, grouping, slots]);

  const onSort = (column: string) => {
    const isDesc = orderBy === column && order === Order.desc;
    setOrder(isDesc ? Order.asc : Order.desc);
    setOrderBy(column);
  };

  return (
    <TableContainer sx={{ flex: 1, minHeight: 0 }}>
      <MuiTable
        aria-labelledby="tableTitle"
        size={"small"}
        sx={{ minWidth: "100%" }}
      >
        <Head order={order} orderBy={orderBy} onSort={onSort} />

        <Body order={order} orderBy={orderBy} />
      </MuiTable>
    </TableContainer>
  );
};

export default Table;
