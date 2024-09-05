import { CircularProgress } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Toolbar from "@mui/material/Toolbar";
import { BOSSES } from "../../public/utils";

const EnhancedTableToolbar = ({
  team,
  setTeam,
  difficulty,
  setDifficulty,
  grouping,
  setGrouping,
  group,
  setGroup,
  data,
  loading,
}) => {
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
      }}
      style={{
        display: "inline-flex",
        justifyContent: "space-between",
      }}
    >
      <div>
        {/* select team */}
        <FormControl size="small" style={{ width: "300px" }}>
          <InputLabel id="select-team">Team</InputLabel>
          <Select
            label="Team"
            value={team}
            onChange={(e) => setTeam(e.target.value)}
          >
            <MenuItem value={"Royal"}>Royal</MenuItem>
            <MenuItem value={"Kingdom"}>Kingdom</MenuItem>
          </Select>
        </FormControl>

        {/* select difficulty */}
        <FormControl size="small" style={{ width: "300px" }}>
          <InputLabel id="select-difficulty">Difficulty</InputLabel>
          <Select
            label="Difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <MenuItem value={"Mythic"}>Mythic</MenuItem>
            <MenuItem value={"Heroic"}>Heroic</MenuItem>
          </Select>
        </FormControl>

        {/* select grouping  */}
        <FormControl size="small" style={{ width: "300px" }}>
          <InputLabel id="select-grouping">Grouping</InputLabel>
          <Select
            label="Grouping"
            value={grouping}
            onChange={(e) => {
              setGrouping(e.target.value);
              if (e.target.value === "Boss") setGroup(BOSSES[0]);
              else setGroup("");
            }}
          >
            <MenuItem value={"Boss"}>Boss</MenuItem>
            <MenuItem value={"Player"}>Player</MenuItem>
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
              {Object.keys(data?.[grouping]).map((row, i) => {
                return (
                  <MenuItem key={`player-${i}`} value={row}>
                    {row}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        )}
      </div>
      <div style={{ display: "inline-flex" }}>
        {loading && <CircularProgress />}
      </div>
    </Toolbar>
  );
};

export default EnhancedTableToolbar;
