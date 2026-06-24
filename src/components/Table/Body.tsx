import { TableBody, Typography } from "@mui/material";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { FC, Fragment } from "react";
import { type Order } from "../../lib/types";
import { openUrl } from "../../lib/utils";
import { useAppSelector } from "../../store/hooks";
import { selectTableBodyModel } from "../../store/viewSelectors";
import { useScreen } from "../../store/ScreenContext";
import ItemLabel from "../ItemLabel";
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
  const { isLargeScreen } = useScreen();
  const { columns, emptyColSpan, isPlayerView, rows, showEmpty } =
    useAppSelector((state) =>
      selectTableBodyModel(state, isLargeScreen, order, orderBy),
    );

  return (
    <TableBody>
      {rows.map(({ row, link }, index) => {
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
              {columns.map((col, i) => {
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
                      <ItemLabel
                        item={<CellText text={formatted} link={link} />}
                        slot={row.Slot}
                      />
                    ) : (
                      <CellText
                        text={formatted}
                        link={link}
                        color={
                          !i && !isPlayerView
                            ? (row.color as string)
                            : undefined
                        }
                      />
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          </Fragment>
        );
      })}

      {showEmpty && (
        <TableRow sx={{ justifyContent: "center" }}>
          <TableCell colSpan={emptyColSpan}>
            <Typography> No valid reports :)</Typography>
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
};

export default Body;
