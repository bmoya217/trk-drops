import { Typography } from "@mui/material";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import type { FC, MouseEventHandler } from "react";
import { Order } from "../../../public/types";

interface Props {
  headCells: string[];
  order: Order;
  orderBy: string;
  onRequestSort: (event: any, property: any) => void;
}

const Head: FC<Props> = ({ headCells = [], order, orderBy, onRequestSort }) => {
  const createSortHandler =
    (property: string): MouseEventHandler =>
    (event) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell, i) => (
          <TableCell
            key={`enhanced-head-${i}`}
            align={i ? "right" : "left"}
            sortDirection={orderBy === headCell ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell}
              direction={orderBy === headCell ? order : "asc"}
              onClick={createSortHandler(headCell)}
              style={orderBy === headCell ? { fontWeight: "bold" } : {}}
            >
              <Typography sx={{ textTransform: "capitalize" }}>
                {headCell}
              </Typography>
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

export default Head;
