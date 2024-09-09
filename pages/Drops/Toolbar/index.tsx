import { Box, Toolbar as MuiToolbar } from "@mui/material";
import { Dispatch, FC, SetStateAction } from "react";
import {
  ByDifficulty,
  Difficulty,
  Grouping,
  Team,
  View,
} from "../../../public/types";
import Breadcrumbs from "./Breadcrumbs";
import Logo from "./Logo";
import Theme from "./Theme";

interface Props {
  team: Team;
  setTeam: Dispatch<SetStateAction<Team>>;
  difficulty: Difficulty;
  setDifficulty: Dispatch<SetStateAction<Difficulty>>;
  grouping: Grouping;
  setGrouping: Dispatch<SetStateAction<Grouping>>;
  group: string;
  setGroup: Dispatch<SetStateAction<string>>;
  column: string;
  setColumn: Dispatch<SetStateAction<string>>;
  view: View;
  setView: Dispatch<SetStateAction<View>>;
  data: ByDifficulty;
  headCells: string[];
  refetch: Function;
}

const Toolbar: FC<Props> = ({
  team,
  setTeam,
  difficulty,
  setDifficulty,
  grouping,
  setGrouping,
  group,
  setGroup,
  column,
  setColumn,
  view,
  setView,
  data,
  headCells,
  refetch,
}) => {
  return (
    <MuiToolbar
      disableGutters
      variant="regular"
      sx={{ display: "flex", justifyContent: "space-between" }}
    >
      <Box sx={{ display: "flex", flexDirection: "row" }}>
        <Logo refetch={refetch} />

        <Breadcrumbs
          team={team}
          setTeam={setTeam}
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          grouping={grouping}
          setGrouping={setGrouping}
          group={group}
          setGroup={setGroup}
          column={column}
          setColumn={setColumn}
          view={view}
          setView={setView}
          data={data}
          headCells={headCells}
        />
      </Box>

      <Theme view={view} setView={setView} />
    </MuiToolbar>
  );
};

export default Toolbar;
