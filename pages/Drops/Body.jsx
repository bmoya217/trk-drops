import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { getComparator, openReport } from "../../public/utils";

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
                const style = {};
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
                    onClick={col === "Player" ? openReport(row.id) : undefined}
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
          <TableCell>No valid reports :)</TableCell>
          <TableCell colSpan={headCells.length} />
        </TableRow>
      )}
    </TableBody>
  );
};

export default EnhancedTableBody;
