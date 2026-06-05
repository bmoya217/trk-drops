import { Box, TableBody, Typography } from "@mui/material";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { FC, Fragment, useContext } from "react";
import { Grouping, type Order, Screen, type Row } from "../../../public/types";
import {
  getComparator,
  filterRowsByArmorTypes,
  getHeadCells,
  getLink,
  openUrl,
} from "../../../public/utils";
import { useAppSelector } from "../../store/hooks";
import { ScreenContext } from "../../store/ScreenContext";
import { dataSlice } from "../../store/slices/dataSlice";
import CellText from "./CellText";

const formatter = Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

interface Props {
  order: Order;
  orderBy: string;
}

const getSlot = (row: Row) =>
  Object.keys(row).find(
    (key) => key !== "Item" && key !== "color" && key !== "classId",
  ) ?? "";

const getPlayerTableRows = (rows: Row[]) =>
  rows.map((row): Row => {
    const slot = getSlot(row);

    return {
      ...row,
      Slot: slot,
      DPS: row[slot],
    };
  });

const Body: FC<Props> = ({ order, orderBy }) => {
  const { size } = useContext(ScreenContext);
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
  const dynamicHead = isPlayerView
    ? ["Item", "DPS"]
    : size === Screen.Large
      ? armorHeadCells
      : [headCells?.[0], column];
  const dynamicRows = isPlayerView
    ? getPlayerTableRows(rows).filter(
        (row) => !slots.length || slots.includes(`${row.Slot}`),
      )
    : size === Screen.Large
      ? bossRows
      : rows.filter((row) => row[column]);
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
