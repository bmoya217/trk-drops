import { Api, Blind, Checkroom, Groups, TableView } from "@mui/icons-material";
import {
  ClickAwayListener,
  Breadcrumbs as MuiBreadcrumbs,
} from "@mui/material";
import { Dispatch, FC, SetStateAction, useContext, useState } from "react";
import {
  ByDifficulty,
  Difficulty,
  Grouping,
  Screen,
  Team,
  View,
} from "../../../public/types";
import { BOSSES } from "../../../public/utils";
import { ScreenContext } from "../../Context/ScreenContext";
import Select, { Open } from "./Select";

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
}

const Breadcrumbs: FC<Props> = ({
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
}) => {
  const [open, setOpen] = useState(Open.Closed);
  const { size } = useContext(ScreenContext);

  const groups =
    grouping === Grouping.Boss
      ? BOSSES
      : Object.keys(data?.[difficulty]?.Player ?? {}).sort();

  const showGroup = group && groups.length;
  const showColum =
    (view === View.Chart || size === Screen.Small) &&
    showGroup &&
    headCells.length > 1;

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

        {/* select group */}
        {showGroup ? (
          <Select
            open={open}
            setOpen={setOpen}
            icon={<Blind />}
            label={Open.Group}
            value={group}
            values={groups}
            setState={setGroup}
          />
        ) : null}

        {/* select column */}
        {showColum ? (
          <Select
            open={open}
            setOpen={setOpen}
            icon={<Checkroom />}
            label={Open.Column}
            value={column}
            values={headCells.slice(1)}
            setState={setColumn}
          />
        ) : null}
      </MuiBreadcrumbs>
    </ClickAwayListener>
  );
};

export default Breadcrumbs;
