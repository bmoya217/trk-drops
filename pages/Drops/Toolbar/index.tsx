import {
  Api,
  Blind,
  Checkroom,
  DarkMode,
  Groups,
  LightMode,
  TableView,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  ClickAwayListener,
  Fab,
  IconButton,
  Toolbar as MuiToolbar,
} from "@mui/material";
import { Dispatch, FC, SetStateAction, useContext, useState } from "react";
import {
  ByDifficulty,
  Difficulty,
  Grouping,
  Screen,
  Team,
} from "../../../public/types";
import { BOSSES } from "../../../public/utils";
import { ScreenContext } from "../../Context/ScreenContext";
import { ThemeContext } from "../../Context/ThemeContext";
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
  data,
  headCells,
  refetch,
}) => {
  const [open, setOpen] = useState(Open.Closed);
  const { size } = useContext(ScreenContext);
  const { theme, setTheme } = useContext(ThemeContext);

  const groups =
    grouping === Grouping.Boss
      ? BOSSES
      : Object.keys(data?.[difficulty]?.Player ?? {}).sort();

  const showGroup = groups.length;
  const showColum = size === Screen.Small && showGroup && headCells.length > 1;

  return (
    <ClickAwayListener
      mouseEvent={open ? "onClick" : false}
      onClickAway={() => setOpen(Open.Closed)}
      disableReactTree
    >
      <MuiToolbar disableGutters variant="regular">
        {/* trk logo */}
        <IconButton size="small" sx={{ p: 0, m: 0 }} onClick={() => refetch()}>
          <Avatar
            src="/images/trk.png"
            alt="TRK"
            sx={{ width: 64, height: 64 }}
          />
        </IconButton>

        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexWrap: "wrap",
          }}
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
        </Box>

        <Fab
          size="small"
          sx={{ m: 1 }}
          onClick={() =>
            setTheme?.((theme) => (theme === "light" ? "dark" : "light"))
          }
        >
          {theme?.palette?.mode === "light" ? <DarkMode /> : <LightMode />}
        </Fab>
      </MuiToolbar>
    </ClickAwayListener>
  );
};

export default Toolbar;
