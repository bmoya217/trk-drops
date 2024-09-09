import MuiTable from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import { FC, useContext, useState } from "react";
import { Difficulty, Links, Order, Row, Screen } from "../../../public/types";
import { ScreenContext } from "../../Context/ScreenContext";
import Body from "./Body";
import Head from "./Head";

interface Props {
  difficulty: Difficulty;
  column: string;
  headCells: string[];
  rows: Row[];
  links: Links;
  loading: boolean;
}

const Table: FC<Props> = ({
  difficulty,
  column,
  headCells,
  rows,
  links,
  loading,
}) => {
  const [order, setOrder] = useState(Order.desc);
  const [orderBy, setOrderBy] = useState("Player");
  const { size } = useContext(ScreenContext);

  const dynamicHead =
    size === Screen.Large ? headCells : [headCells[0], column];
  const dynamicRows =
    size === Screen.Large ? rows : rows.filter((row) => row[column]);

  const handleRequestSort = (_: any, property: string) => {
    const isDesc = orderBy === property && order === Order.desc;
    setOrder(isDesc ? Order.asc : Order.desc);
    setOrderBy(property);
  };

  return (
    <TableContainer>
      <MuiTable aria-labelledby="tableTitle" size={"small"}>
        <Head
          headCells={dynamicHead}
          links={links}
          order={order}
          orderBy={orderBy}
          onRequestSort={handleRequestSort}
        />

        <Body
          headCells={dynamicHead}
          rows={dynamicRows}
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
