import { TableBody, Typography } from "@mui/material";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { FC, useContext } from "react";
import { Screen, type Order } from "../../../../public/types";
import { getComparator, getLink, openUrl } from "../../../../public/utils";
import { DataContext } from "../../context/DataContext";
import { ScreenContext } from "../../context/ScreenContext";
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
  const {
    difficulty,
    grouping,
    group,
    column,
    data,
    headCells,
    links,
    loading,
  } = useContext(DataContext);

  const rows = data[difficulty][grouping][group] ?? [];
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
              {headCells.map((col, i) => {
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
