import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { getComparator } from "../../public/utils";

const formatter = Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const EnhancedTableBody = ({ headCells = [], rows = [], order, orderBy }) => {
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
                const formatted = formatter.format(value);

                return (
                  <TableCell
                    key={`enhanced-cell-${index}-${i}`}
                    component="th"
                    scope="row"
                    padding="none"
                    align={i ? "right" : "left"}
                  >
                    {isNaN(value) ? value : formatted}
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
          <TableCell>Enter Reports!</TableCell>
          <TableCell colSpan={headCells.length} />
        </TableRow>
      )}
    </TableBody>
  );
};

export default EnhancedTableBody;
