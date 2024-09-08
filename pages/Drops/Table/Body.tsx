import { Link, TableBody, Typography } from "@mui/material";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { FC } from "react";
import type {
  Data,
  Difficulty,
  Grouping,
  Links,
  Order,
} from "../../../public/types";
import { getComparator, openUrl } from "../../../public/utils";

const formatter = Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

interface Props {
  headCells: string[];
  rows: Data[Grouping][string];
  difficulty: Difficulty;
  links: Links;
  order: Order;
  orderBy: string;
  loading: boolean;
}

const EnhancedTableBody: FC<Props> = ({
  headCells = [],
  rows = [],
  difficulty,
  links,
  order,
  orderBy,
  loading,
}) => {
  return (
    <TableBody>
      {rows
        ?.slice()
        .sort(getComparator(order, orderBy))
        .map((row, index) => {
          const link = row.Item ?? row.Player + "_" + difficulty;
          const url = links?.[link];
          const onClick = () => url && openUrl(url);

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
                    {!i ? (
                      <Link
                        href={url}
                        underline="none"
                        color="inherit"
                        sx={{ textTransform: "capitalize" }}
                        onClick={(e) => e.preventDefault()}
                      >
                        {formatted}
                      </Link>
                    ) : (
                      <Typography sx={{ textTransform: "capitalize" }}>
                        {formatted}
                      </Typography>
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          );
        })}

      {!rows.length && !loading && (
        <TableRow sx={{ justifyContent: "center" }}>
          <TableCell colSpan={headCells.length}>
            <Typography> No valid reports :)</Typography>
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
};

export default EnhancedTableBody;
