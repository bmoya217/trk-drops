import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import { useContext, type FC } from "react";
import { Order, Screen } from "../../../../public/types";
import { DataContext } from "../../context/DataContext";
import { ScreenContext } from "../../context/ScreenContext";
import CellText from "./CellText";

interface Props {
  order: Order;
  orderBy: string;
  onSort: (column: string) => void;
}

const Head: FC<Props> = ({ order, orderBy, onSort }) => {
  const { size } = useContext(ScreenContext);
  const { difficulty, column, headCells, links } = useContext(DataContext);

  const dynamicHead =
    size === Screen.Large ? headCells : [headCells?.[0], column];

  return (
    <TableHead>
      <TableRow>
        {dynamicHead.map((headCell, i) => {
          const link = links?.[headCell + "_" + difficulty];
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
                onClick={() => onSort(headCell)}
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
