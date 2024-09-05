import { TableBody } from "@mui/material";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { CSSProperties, FC } from "react";
import type { Data, Grouping, Order } from "../../public/types";
import { getComparator, openReport } from "../../public/utils";

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
                const style: CSSProperties = {};
                if (col === orderBy) style.fontWeight = "bold";
                if (col === "Player") style.cursor = "pointer";

                return (
                  <TableCell
                    key={`enhanced-cell-${index}-${i}`}
                    component="th"
                    scope="row"
                    padding="none"
                    align={i ? "right" : "left"}
                    style={style}
                    onClick={
                      col === "Player"
                        ? openReport(row.id as string)
                        : undefined
                    }
                  >
                    {formatted}
                  </TableCell>
                );
              })}
            </TableRow>
          );
        })}
      {!rows.length && (
        <TableRow
          style={{
            height: 33,
          }}
        >
          <TableCell>No valid reports :)</TableCell>
          <TableCell colSpan={headCells.length} />
        </TableRow>
      )}
    </TableBody>
  );
};

export default EnhancedTableBody;
