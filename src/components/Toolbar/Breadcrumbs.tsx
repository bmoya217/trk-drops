import { Api, Groups, TableView } from "@mui/icons-material";
import {
  ClickAwayListener,
  Breadcrumbs as MuiBreadcrumbs,
} from "@mui/material";
import { FC, useState } from "react";
import { Difficulty, Grouping, Team } from "../../../public/types";
import { BOSSES } from "../../../public/utils";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { dataSlice } from "../../store/slices/dataSlice";
import Select, { Open } from "./Select";

const Breadcrumbs: FC = () => {
  const [open, setOpen] = useState(Open.Closed);
  const team = useAppSelector(dataSlice.selectors.selectTeam);
  const difficulty = useAppSelector(dataSlice.selectors.selectDifficulty);
  const grouping = useAppSelector(dataSlice.selectors.selectGrouping);
  const data = useAppSelector(dataSlice.selectors.selectData);
  const dispatch = useAppDispatch();

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
          setState={(team: Team) => dispatch(dataSlice.actions.setTeam(team))}
        />

        {/* select difficulty */}
        <Select
          open={open}
          setOpen={setOpen}
          icon={<Api />}
          label={Open.Difficulty}
          value={difficulty}
          values={[Difficulty.Mythic, Difficulty.Heroic]}
          setState={(difficulty: Difficulty) =>
            dispatch(dataSlice.actions.setDifficulty(difficulty))
          }
        />

        {/* select grouping */}
        <Select
          open={open}
          setOpen={setOpen}
          icon={<TableView />}
          label={Open.Grouping}
          value={grouping}
          values={[Grouping.Boss, Grouping.Player]}
          setState={(grouping: Grouping) =>
            dispatch(dataSlice.actions.setGrouping(grouping))
          }
          onChange={(value: Grouping) => {
            const players = Object.keys(data[difficulty].Player);
            if (value === Grouping.Boss)
              dispatch(dataSlice.actions.setGroup(BOSSES[0]));
            else
              dispatch(
                dataSlice.actions.setGroup(players.length ? players[0] : "")
              );
          }}
        />
      </MuiBreadcrumbs>
    </ClickAwayListener>
  );
};

export default Breadcrumbs;
