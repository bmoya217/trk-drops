import MuiTable from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import { FC, useState } from "react";
import { Data, Grouping, Links, Order } from "../../../public/types";
import { getHeadCells } from "../../../public/utils";
import Body from "./Body";
import Head from "./Head";

interface Props {
  grouping: Grouping;
  group: string;
  data: Data;
  links: Links;
  loading: boolean;
}

const Table: FC<Props> = ({ grouping, group, data, links, loading }) => {
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
