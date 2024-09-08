import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import type { FC, MouseEventHandler } from "react";
import { Links, Order } from "../../../public/types";
import CellText from "../../Components/CellText";

interface Props {
  headCells: string[];
  links: Links;
  order: Order;
  orderBy: string;
  onRequestSort: (event: any, property: any) => void;
}

const Head: FC<Props> = ({
  headCells = [],
  links,
  order,
  orderBy,
  onRequestSort,
}) => {
  const createSortHandler =
    (property: string): MouseEventHandler =>
    (event) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell, i) => {
          const link = links?.[headCell];
          const sorting = orderBy === headCell;

          return (
            <TableCell
              key={`enhanced-head-${i}`}
              align={i ? "right" : "left"}
              sortDirection={orderBy === headCell ? order : false}
            >
              <TableSortLabel
                active={sorting}
                direction={sorting ? order : "desc"}
                onClick={createSortHandler(headCell)}
              >
                <CellText text={headCell} link={link} bold={sorting} />
              </TableSortLabel>
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
};

export default Head;
