import { Link, Typography } from "@mui/material";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import type { FC, MouseEventHandler } from "react";
import { Links, Order } from "../../../public/types";

interface Props {
  headCells: string[];
  links: Links;
  order: Order;
  orderBy: string;
  onRequestSort: (event: any, property: any) => void;
}

const Head: FC<Props> = ({
  headCells = [],
  links,
  order,
  orderBy,
  onRequestSort,
}) => {
  const createSortHandler =
    (property: string): MouseEventHandler =>
    (event) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell, i) => {
          const link = links?.[headCell];
          const sorting = orderBy === headCell;
          const sx = {
            fontWeight: sorting ? "bold" : "inherit",
            textTransform: "capitalize",
          };

          return (
            <TableCell
              key={`enhanced-head-${i}`}
              align={i ? "right" : "left"}
              sortDirection={orderBy === headCell ? order : false}
            >
              <TableSortLabel
                active={sorting}
                direction={sorting ? order : "desc"}
                onClick={createSortHandler(headCell)}
              >
                {link ? (
                  <Link
                    href={link}
                    underline="none"
                    color="inherit"
                    sx={sx}
                    onClick={(e) => e.preventDefault()}
                  >
                    {headCell}
                  </Link>
                ) : (
                  <Typography sx={sx}>{headCell}</Typography>
                )}
              </TableSortLabel>
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
};

export default Head;
