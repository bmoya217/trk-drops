import { Divider, LinearProgress, Paper } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Data, Difficulty, Grouping, Links, Team } from "../../public/types";
import {
  BOSSES,
  fetchReport,
  fetchReports,
  formatResults,
  validateReport,
} from "../../public/utils";
import Table from "./Table";
import Toolbar from "./Toolbar";

const Drops = () => {
  const [team, setTeam] = useState(Team.Royal);
  const [difficulty, setDifficulty] = useState(Difficulty.Mythic);
  const [grouping, setGrouping] = useState(Grouping.Boss);
  const [group, setGroup] = useState(BOSSES[0]);
  const [data, setData] = useState<Data>({ Boss: {}, Player: {} });
  const [links, setLinks] = useState<Links>({});
  const [loading, setLoading] = useState(true);

  const first = useRef(true);

  const addData = (newData: Data) => {
    setData((data) => {
      const Boss = BOSSES.reduce((prev, curr) => {
        const oldRows = data?.Boss?.[curr] ?? [];
        const newRows = newData?.Boss?.[curr] ?? [];

        return {
          ...prev,
          [curr]: [...oldRows, ...newRows],
        };
      }, {});

      const Player = {
        ...data.Player,
        ...newData.Player,
      };

      return { Boss, Player };
    });
  };

  const addLinks = (newLinks: Links) => {
    setLinks((links) => {
      return {
        ...links,
        ...newLinks,
      };
    });
  };

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }

    const loadReports = async () => {
      setLoading(true);
      setData({ Boss: {}, Player: {} });

      const reports = await fetchReports(team, difficulty);
      if (!reports?.length) return setLoading(false);

      const loadReport = async (url: string) => {
        const $ = await fetchReport(url);
        if (!validateReport($, difficulty)) return;
        const [data, links] = formatResults($);
        addData(data);
        addLinks(links);
      };
      await Promise.all(reports.map(loadReport)).catch(() => {});

      setLoading(false);
    };

    loadReports();
  }, [team, difficulty]);

  return (
    <Paper
      sx={{
        margin: "12px",
        padding: "8px",
        display: "flex",
        flexDirection: "column",
        borderRadius: 2,
      }}
    >
      <Toolbar
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

      {loading ? <LinearProgress /> : <Divider />}

      <Table
        grouping={grouping}
        group={group}
        data={data}
        links={links}
        loading={loading}
      />
    </Paper>
  );
};

export default Drops;
