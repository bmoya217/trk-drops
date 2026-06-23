import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import { type FC } from "react";
import { Order } from "../../lib/types";
import { useAppSelector } from "../../store/hooks";
import { selectTableHeadModel } from "../../store/viewSelectors";
import { useScreen } from "../../store/ScreenContext";
import CellText from "./CellText";

interface Props {
  order: Order;
  orderBy: string;
  onSort: (column: string) => void;
}

const Head: FC<Props> = ({ order, orderBy, onSort }) => {
  const { isLargeScreen } = useScreen();
  const columns = useAppSelector((state) =>
    selectTableHeadModel(state, isLargeScreen),
  );

  return (
    <TableHead>
      <TableRow>
        {columns.map(({ name, link }, i) => {
          const sorting = orderBy === name;
          const align = i ? "center" : "left";

          return (
            <TableCell
              key={`enhanced-head-${i}`}
              align={align}
              sortDirection={orderBy === name ? order : false}
            >
              <TableSortLabel
                active={sorting}
                direction={sorting ? order : "desc"}
                onClick={() => onSort(name)}
                sx={{
                  justifyContent: i ? "center" : "flex-start",
                  width: "100%",
                }}
              >
                <CellText text={name} link={link} bold={sorting} />
              </TableSortLabel>
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
};

export default Head;
