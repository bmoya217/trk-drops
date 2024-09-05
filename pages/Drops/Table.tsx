import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import MuiTable from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { Data, Difficulty, Grouping, Order, Team } from "../../public/types";
import { BOSSES, getHeadCells } from "../../public/utils";
import EnhancedTableBody from "./Body";
import EnhancedTableHead from "./Head";
import EnhancedTableToolbar from "./Toolbar";

interface Props {
  team: Team;
  setTeam: Dispatch<SetStateAction<Team>>;
  difficulty: Difficulty;
  setDifficulty: Dispatch<SetStateAction<Difficulty>>;
  grouping: Grouping;
  setGrouping: Dispatch<SetStateAction<Grouping>>;
  data: Data;
  loading: boolean;
}

const Table: FC<Props> = ({
  team,
  setTeam,
  difficulty,
  setDifficulty,
  grouping,
  setGrouping,
  data,
}) => {
  const [group, setGroup] = useState(BOSSES[0]);
  const [order, setOrder] = useState(Order.asc);
  const [orderBy, setOrderBy] = useState("Player");

  const rows = data?.[grouping]?.[group] ?? [];
  const headCells = getHeadCells(rows, grouping);

  const handleRequestSort = (_: any, property: string) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? Order.desc : Order.asc);
    setOrderBy(property);
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flex: 1,
        padding: "15px",
        borderRadius: 15,
      }}
    >
      <Paper
        sx={{
          padding: "5px",
          margin: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <EnhancedTableToolbar
          team={team}
          setTeam={setTeam}
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          grouping={grouping}
          setGrouping={setGrouping}
          group={group}
          setGroup={setGroup}
          data={data}
        />
        <TableContainer>
          <MuiTable
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={"small"}
          >
            <EnhancedTableHead
              headCells={headCells}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <EnhancedTableBody
              headCells={headCells}
              rows={rows}
              order={order}
              orderBy={orderBy}
            />
          </MuiTable>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default Table;
