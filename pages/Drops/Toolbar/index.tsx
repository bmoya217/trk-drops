import {
  Api,
  Blind,
  Groups,
  HowToReg,
  LightMode,
  DarkMode,
} from "@mui/icons-material";
import {
  Avatar,
  ClickAwayListener,
  Fab,
  Toolbar as MuiToolbar,
} from "@mui/material";
import { Dispatch, FC, SetStateAction, useContext, useState } from "react";
import { Data, Difficulty, Grouping, Team } from "../../../public/types";
import { BOSSES } from "../../../public/utils";
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
  data: Data;
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
  data,
}) => {
  const [open, setOpen] = useState(Open.Closed);

  const { theme, setTheme } = useContext(ThemeContext);

  const groups =
    grouping === Grouping.Boss
      ? BOSSES
      : Object.keys(data?.Player ?? {}).sort();
  return (
    <ClickAwayListener
      mouseEvent={open ? "onClick" : false}
      onClickAway={() => setOpen(Open.Closed)}
      disableReactTree
    >
      <MuiToolbar
        disableGutters
        sx={{
          backgroundImage:
            "https://wow.zamimg.com/modelviewer/live/webthumbs/npc/12/117772.webp",
        }}
      >
        {/* trk logo */}
        <Avatar
          src="https://pbs.twimg.com/profile_images/1531770683738316801/13tNv900_200x200.png"
          alt="Guild logo"
          sx={{ width: 56, height: 56 }}
        />

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
            console.log(value);
            const players = Object.keys(data.Player);
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

        <Fab
          size="small"
          sx={{ m: 1 }}
          onClick={() =>
            setTheme?.((theme) => (theme === "light" ? "dark" : "light"))
          }
        >
          {theme.palette.mode === "light" ? <DarkMode /> : <LightMode />}
        </Fab>
      </MuiToolbar>
    </ClickAwayListener>
  );
};

export default Toolbar;
