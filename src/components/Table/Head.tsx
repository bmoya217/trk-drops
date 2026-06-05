import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import { type FC } from "react";
import { Grouping, Order, type Difficulty, type Links } from "../../lib/types";
import { filterRowsByArmorTypes, getHeadCells } from "../../lib/utils";
import { useAppSelector } from "../../store/hooks";
import { useScreen } from "../../store/ScreenContext";
import { dataSlice } from "../../store/slices/dataSlice";
import CellText from "./CellText";
import { getVisibleTableColumns } from "./helpers";

interface Props {
  order: Order;
  orderBy: string;
  onSort: (column: string) => void;
}

const getHeadCellLink = ({
  difficulty,
  grouping,
  headCell,
  links,
}: {
  difficulty: Difficulty;
  grouping: Grouping;
  headCell: string;
  links: Links;
}) => {
  if (grouping === Grouping.Player) return undefined;

  return links?.[`${headCell}_${difficulty}`];
};

const Head: FC<Props> = ({ order, orderBy, onSort }) => {
  const { isLargeScreen } = useScreen();
  const difficulty = useAppSelector(dataSlice.selectors.selectDifficulty);
  const grouping = useAppSelector(dataSlice.selectors.selectGrouping);
  const armorTypes = useAppSelector(dataSlice.selectors.selectArmorTypes);
  const column = useAppSelector(dataSlice.selectors.selectColumn);
  const links = useAppSelector(dataSlice.selectors.selectLinks);
  const headCells = useAppSelector(dataSlice.selectors.selectHeadCells);
  const rows = useAppSelector(dataSlice.selectors.selectRows);
  const armorHeadCells = getHeadCells(
    filterRowsByArmorTypes(rows, armorTypes),
    grouping,
  );

  const dynamicHead = getVisibleTableColumns({
    armorHeadCells,
    column,
    grouping,
    headCells,
    isLargeScreen,
  });

  return (
    <TableHead>
      <TableRow>
        {dynamicHead.map((headCell, i) => {
          const link = getHeadCellLink({
            difficulty,
            grouping,
            headCell,
            links,
          });
          const sorting = orderBy === headCell;
          const align = i ? "center" : "left";

          return (
            <TableCell
              key={`enhanced-head-${i}`}
              align={align}
              sortDirection={orderBy === headCell ? order : false}
            >
              <TableSortLabel
                active={sorting}
                direction={sorting ? order : "desc"}
                onClick={() => onSort(headCell)}
                sx={{
                  justifyContent: i ? "center" : "flex-start",
                  width: "100%",
                }}
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
