import {
  Api,
  Blind,
  DarkMode,
  Groups,
  HowToReg,
  LightMode,
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
  Team,
} from "../../../public/types";
import { BOSSES } from "../../../public/utils";
import { ThemeContext } from "../../Context/ThemeContext";
import Select, { Open } from "./Select";

interface Props {
  data: ByDifficulty;
  team: Team;
  setTeam: Dispatch<SetStateAction<Team>>;
  difficulty: Difficulty;
  setDifficulty: Dispatch<SetStateAction<Difficulty>>;
  grouping: Grouping;
  setGrouping: Dispatch<SetStateAction<Grouping>>;
  group: string;
  setGroup: Dispatch<SetStateAction<string>>;
  refetch: Function;
}

const Toolbar: FC<Props> = ({
  data,
  team,
  setTeam,
  difficulty,
  setDifficulty,
  grouping,
  setGrouping,
  group,
  setGroup,
  refetch,
}) => {
  const [open, setOpen] = useState(Open.Closed);

  const { theme, setTheme } = useContext(ThemeContext);

  const groups =
    grouping === Grouping.Boss
      ? BOSSES
      : Object.keys(data?.[difficulty]?.Player ?? {}).sort();
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
          icon={<HowToReg />}
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
        <Select
          open={open}
          setOpen={setOpen}
          icon={<Blind />}
          label={Open.Group}
          value={group}
          values={groups}
          setState={setGroup}
        />

        <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
          <Fab
            size="small"
            sx={{ m: 1 }}
            onClick={() =>
              setTheme?.((theme) => (theme === "light" ? "dark" : "light"))
            }
          >
            {theme?.palette?.mode === "light" ? <DarkMode /> : <LightMode />}
          </Fab>
        </Box>
      </MuiToolbar>
    </ClickAwayListener>
  );
};

export default Toolbar;
