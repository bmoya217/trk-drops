import { Api, Groups, TableView } from "@mui/icons-material";
import {
  ClickAwayListener,
  Breadcrumbs as MuiBreadcrumbs,
} from "@mui/material";
import { FC, useContext, useState } from "react";
import { Difficulty, Grouping, Team } from "../../../../public/types";
import { BOSSES } from "../../../../public/utils";
import { DataContext } from "../../context/DataContext";
import Select, { Open } from "./Select";

const Breadcrumbs: FC = () => {
  const [open, setOpen] = useState(Open.Closed);
  const {
    team,
    setTeam,
    difficulty,
    setDifficulty,
    grouping,
    setGrouping,
    setGroup,
    data,
  } = useContext(DataContext);

  return (
    <ClickAwayListener
      mouseEvent={open ? "onClick" : false}
      onClickAway={() => setOpen(Open.Closed)}
      disableReactTree
    >
      <MuiBreadcrumbs
        sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}
      >
        {/* select team */}
        <Select
          open={open}
          setOpen={setOpen}
          icon={<Groups />}
          label={Open.Team}
          value={team}
          values={[Team.Royal, Team.Kingdom]}
          setState={setTeam}
        />

        {/* select difficulty */}
        <Select
          open={open}
          setOpen={setOpen}
          icon={<Api />}
          label={Open.Difficulty}
          value={difficulty}
          values={[Difficulty.Mythic, Difficulty.Heroic]}
          setState={setDifficulty}
        />

        {/* select grouping */}
        <Select
          open={open}
          setOpen={setOpen}
          icon={<TableView />}
          label={Open.Grouping}
          value={grouping}
          values={[Grouping.Boss, Grouping.Player]}
          setState={setGrouping}
          onChange={(value: Grouping) => {
            const players = Object.keys(data[difficulty].Player);
            if (value === Grouping.Boss) setGroup(BOSSES[0]);
            else setGroup(players.length ? players[0] : "");
          }}
        />
      </MuiBreadcrumbs>
    </ClickAwayListener>
  );
};

export default Breadcrumbs;
