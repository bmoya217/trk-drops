import { TableBody, Typography } from "@mui/material";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { FC, useContext } from "react";
import { Screen, type Order } from "../../../public/types";
import { getComparator, getLink, openUrl } from "../../../public/utils";
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

const Body: FC<Props> = ({ order, orderBy }) => {
  const { size } = useContext(ScreenContext);
  const difficulty = useAppSelector(dataSlice.selectors.selectDifficulty);
  const column = useAppSelector(dataSlice.selectors.selectColumn);
  const links = useAppSelector(dataSlice.selectors.selectLinks);
  const loading = useAppSelector(dataSlice.selectors.selectLoading);
  const headCells = useAppSelector(dataSlice.selectors.selectHeadCells);
  const rows = useAppSelector(dataSlice.selectors.selectRows);

  const dynamicHead =
    size === Screen.Large ? headCells : [headCells?.[0], column];
  const dynamicRows =
    size === Screen.Large ? rows : rows.filter((row) => row[column]);

  return (
    <TableBody>
      {dynamicRows
        ?.slice()
        .sort(getComparator(order, orderBy))
        .map((row, index) => {
          const link = getLink(row, difficulty, links);
          const onClick = () => link && openUrl(link);

          return (
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
                    align={i ? "right" : "left"}
                  >
                    <CellText text={formatted} link={!i ? link : undefined} />
                  </TableCell>
                );
              })}
            </TableRow>
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
