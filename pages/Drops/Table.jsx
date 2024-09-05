import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import MuiTable from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import { BOSSES, getHeadCells } from "../../public/utils";
import EnhancedTableToolbar from "./Toolbar";
import { useState } from "react";
import EnhancedTableHead from "./Head";
import EnhancedTableBody from "./Body";

const Table = ({
  team,
  setTeam,
  difficulty,
  setDifficulty,
  grouping,
  setGrouping,
  data,
  loading,
}) => {
  const [group, setGroup] = useState(BOSSES[0]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("Player");

  const rows = data?.[grouping]?.[group] ?? [];
  const headCells = getHeadCells(rows, grouping);

  const handleRequestSort = (_, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
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
              grouping={grouping}
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
