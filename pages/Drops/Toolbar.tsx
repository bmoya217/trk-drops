import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Toolbar from "@mui/material/Toolbar";
import { Dispatch, FC, SetStateAction } from "react";
import { Data, Difficulty, Grouping, Team } from "../../public/types";
import { BOSSES } from "../../public/utils";

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

const EnhancedTableToolbar: FC<Props> = ({
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
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
      }}
    >
      {/* select team */}
      <FormControl size="small" style={{ width: "300px", paddingRight: 8 }}>
        <InputLabel id="select-team">Team</InputLabel>
        <Select
          label="Team"
          value={team}
          onChange={(e) => setTeam(e.target.value as Team)}
        >
          <MenuItem value={Team.Royal}>Royal</MenuItem>
          <MenuItem value={Team.Kingdom}>Kingdom</MenuItem>
        </Select>
      </FormControl>

      {/* select difficulty */}
      <FormControl size="small" style={{ width: "300px", paddingRight: 8 }}>
        <InputLabel id="select-difficulty">Difficulty</InputLabel>
        <Select
          label="Difficulty"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value as Difficulty)}
        >
          <MenuItem value={Difficulty.Mythic}>Mythic</MenuItem>
          <MenuItem value={Difficulty.Heroic}>Heroic</MenuItem>
        </Select>
      </FormControl>

      {/* select grouping  */}
      <FormControl size="small" style={{ width: "300px", paddingRight: 8 }}>
        <InputLabel id="select-grouping">Grouping</InputLabel>
        <Select
          label="Grouping"
          value={grouping}
          onChange={(e) => {
            const players = Object.keys(data.Player);
            setGrouping(e.target.value as Grouping);
            if (e.target.value === "Boss") setGroup(BOSSES[0]);
            else setGroup(players.length ? players[0] : "");
          }}
        >
          <MenuItem value={Grouping.Boss}>Boss</MenuItem>
          <MenuItem value={Grouping.Player}>Player</MenuItem>
        </Select>
      </FormControl>

      {/* select boss  */}
      {grouping === "Boss" && (
        <FormControl size="small" style={{ width: "300px" }}>
          <InputLabel id="select-boss">Boss</InputLabel>
          <Select
            label="Boss"
            value={group}
            onChange={(e) => setGroup(e.target.value)}
          >
            {BOSSES.map((boss, i) => {
              return (
                <MenuItem key={`boss-${i}`} value={boss}>
                  {boss}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      )}

      {/* select player  */}
      {grouping === "Player" && (
        <FormControl size="small" style={{ width: "300px" }}>
          <InputLabel id="select-player">Player</InputLabel>
          <Select
            label="Player"
            value={group}
            onChange={(e) => setGroup(e.target.value)}
          >
            {Object.keys(data?.[grouping])
              .sort()
              .map((row, i) => {
                return (
                  <MenuItem key={`player-${i}`} value={row}>
                    {row}
                  </MenuItem>
                );
              })}
          </Select>
        </FormControl>
      )}
    </Toolbar>
  );
};

export default EnhancedTableToolbar;
