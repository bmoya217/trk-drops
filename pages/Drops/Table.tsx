import MuiTable from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import { FC, useState } from "react";
import { Data, Grouping, Order } from "../../public/types";
import { getHeadCells } from "../../public/utils";
import EnhancedTableBody from "./Body";
import EnhancedTableHead from "./Head";

interface Props {
  grouping: Grouping;
  group: string;
  data: Data;
  loading: boolean;
}

const Table: FC<Props> = ({ grouping, group, data }) => {
  const [order, setOrder] = useState(Order.asc);
  const [orderBy, setOrderBy] = useState("Player");

  const rows = data?.[grouping]?.[group] ?? [];
  const headCells = getHeadCells(rows, grouping);

  const handleRequestSort = (_: any, property: string) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? Order.desc : Order.asc);
    setOrderBy(property);
  };

  return (
    <TableContainer>
      <MuiTable
        sx={{ minWidth: 750 }}
        aria-labelledby="tableTitle"
        size={"small"}
      >
        <EnhancedTableHead
          headCells={headCells}
          order={order}
          orderBy={orderBy}
          onRequestSort={handleRequestSort}
        />
        <EnhancedTableBody
          headCells={headCells}
          rows={rows}
          order={order}
          orderBy={orderBy}
        />
      </MuiTable>
    </TableContainer>
  );
};

export default Table;
