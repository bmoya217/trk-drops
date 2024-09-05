import { Link, TableBody, Typography } from "@mui/material";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { FC } from "react";
import type { Data, Grouping, Order } from "../../public/types";
import { getComparator } from "../../public/utils";

const formatter = Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

interface Props {
  headCells: string[];
  rows: Data[Grouping][string];
  order: Order;
  orderBy: string;
}

const EnhancedTableBody: FC<Props> = ({
  headCells = [],
  rows = [],
  order,
  orderBy,
}) => {
  return (
    <TableBody>
      {rows
        ?.slice()
        .sort(getComparator(order, orderBy))
        .map((row, index) => {
          return (
            <TableRow hover tabIndex={-1} key={`enhanced-row-${index}`}>
              {headCells.map((col, i) => {
                const value = row[col];
                const formatted =
                  typeof value === "number" ? formatter.format(value) : value;
                const link = col === "Player" || col === "name";

                return (
                  <TableCell
                    key={`enhanced-cell-${index}-${i}`}
                    scope="row"
                    align={i ? "right" : "left"}
                  >
                    {link && (
                      <Link
                        href={row.href as string}
                        target="_blank"
                        rel="noreferrer"
                        underline="none"
                        color="inherit"
                      >
                        {formatted}
                      </Link>
                    )}
                    {!link && <Typography>{formatted}</Typography>}
                  </TableCell>
                );
              })}
            </TableRow>
          );
        })}
      {!rows.length && (
        <TableRow>
          <TableCell colSpan={headCells.length}>No valid reports :)</TableCell>
        </TableRow>
      )}
    </TableBody>
  );
};

export default EnhancedTableBody;
