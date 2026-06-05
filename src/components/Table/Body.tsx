import { Box, TableBody, Typography } from "@mui/material";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { FC, Fragment } from "react";
import { Grouping, type Order } from "../../lib/types";
import {
  getComparator,
  filterRowsByArmorTypes,
  getHeadCells,
  getLink,
  openUrl,
} from "../../lib/utils";
import { useAppSelector } from "../../store/hooks";
import { useScreen } from "../../store/ScreenContext";
import { dataSlice } from "../../store/slices/dataSlice";
import CellText from "./CellText";
import { getVisibleTableColumns, getVisibleTableRows } from "./helpers";

const formatter = Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

interface Props {
  order: Order;
  orderBy: string;
}

const Body: FC<Props> = ({ order, orderBy }) => {
  const { isLargeScreen } = useScreen();
  const difficulty = useAppSelector(dataSlice.selectors.selectDifficulty);
  const grouping = useAppSelector(dataSlice.selectors.selectGrouping);
  const armorTypes = useAppSelector(dataSlice.selectors.selectArmorTypes);
  const column = useAppSelector(dataSlice.selectors.selectColumn);
  const slots = useAppSelector(dataSlice.selectors.selectSlots);
  const links = useAppSelector(dataSlice.selectors.selectLinks);
  const loading = useAppSelector(dataSlice.selectors.selectLoading);
  const headCells = useAppSelector(dataSlice.selectors.selectHeadCells);
  const rows = useAppSelector(dataSlice.selectors.selectRows);

  const isPlayerView = grouping === Grouping.Player;
  const bossRows = filterRowsByArmorTypes(rows, armorTypes);
  const armorHeadCells = getHeadCells(bossRows, grouping);
  const dynamicHead = getVisibleTableColumns({
    armorHeadCells,
    column,
    grouping,
    headCells,
    isLargeScreen,
  });
  const dynamicRows = getVisibleTableRows({
    bossRows,
    column,
    grouping,
    isLargeScreen,
    rows,
    slots,
  });
  const sortedRows = dynamicRows?.slice().sort((a, b) => {
    return getComparator(order, orderBy)(a, b);
  });

  return (
    <TableBody>
      {sortedRows.map((row, index) => {
        const link = getLink(row, difficulty, links);
        const onClick = () => link && openUrl(link);
        return (
          <Fragment key={`enhanced-row-group-${index}`}>
            <TableRow
              hover
              tabIndex={-1}
              key={`enhanced-row-${index}`}
              sx={link ? { cursor: "pointer" } : {}}
              onClick={onClick}
            >
              {dynamicHead.map((col, i) => {
                const value = row[col];
                const formatted =
                  typeof value === "number" ? formatter.format(value) : value;

                return (
                  <TableCell
                    key={`enhanced-cell-${index}-${i}`}
                    scope="row"
                    align={i ? "center" : "left"}
                  >
                    {!i && isPlayerView ? (
                      <Box>
                        <CellText
                          text={formatted}
                          link={!i ? link : undefined}
                        />
                        {!slots.length ? (
                          <Typography
                            color="text.secondary"
                            variant="caption"
                            sx={{ paddingLeft: "8px" }}
                          >
                            {row.Slot}
                          </Typography>
                        ) : null}
                      </Box>
                    ) : (
                      <CellText text={formatted} link={!i ? link : undefined} />
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          </Fragment>
        );
      })}

      {!dynamicRows.length && !loading && (
        <TableRow sx={{ justifyContent: "center" }}>
          <TableCell colSpan={headCells.length}>
            <Typography> No valid reports :)</Typography>
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
};

export default Body;
