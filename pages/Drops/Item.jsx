import { AddLink } from "@mui/icons-material";
import React, { useState } from "react";
import { EMPTY_ROW, TIER_BY_BOSS } from "../utils";
import TextField from "@mui/material/TextField";

const fetchReport = async (report) => {
  if (!report) return;

  const page = await fetch("api/report?report=" + report, {}).catch((e) => {});
  if (page?.status !== 200) return null;

  return page.json();
};

const selectPlayer = ($) => $?.sim?.players?.[0]?.name ?? "undefined";
const selectResults = ($) => $?.sim?.profilesets?.results ?? [];
const selectCurrent = ($) => $?.sim?.statistics?.raid_dps?.mean ?? 0;
const selectReportName = ($) => $?.simbot?.publicTitle ?? "";
const selectDroptimizerItems = ($) =>
  $?.simbot?.meta?.rawFormData?.droptimizerItems ?? [];

const getItemName = (item) => {
  if (TIER_BY_BOSS.Lihuvim.includes(item)) return "Hand Tier";
  if (TIER_BY_BOSS.Halondrus.includes(item)) return "Leg Tier";
  if (TIER_BY_BOSS.Anduin.includes(item)) return "Helm Tier";
  if (TIER_BY_BOSS.Rygelon.includes(item)) return "Chest Tier";
  if (TIER_BY_BOSS.Lords.includes(item)) return "Shoulder Tier";
  return item;
};

const formatResults = ($) => {
  const results = selectResults($);
  const items = selectDroptimizerItems($);
  const current = selectCurrent($);

  return results?.reduce((prev, curr) => {
    const item = items?.find((item) => item.id === curr.name);

    // rings/trinkets that have better variation already
    if ((prev[item.item.name] ?? 0) > curr.mean) return prev;

    return {
      ...prev,
      [getItemName(item.item.name)]: Math.floor(curr.mean - current),
    };
  }, {});
};

const Item = ({ addRow }) => {
  const [report, setReport] = useState("");
  const [loading, setLoading] = useState(false);

  const loadReport = async () => {
    setLoading(true);

    const $ = await fetchReport(report);

    addRow({
      ...EMPTY_ROW,
      Player: selectPlayer($),
      ...formatResults($),
    });

    setLoading(false);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <div style={{ display: "inline-flex", flex: 1 }}>
        <TextField
          value={report}
          onChange={(e) => setReport(e.target.value)}
          background={"grey"}
          size="small"
        />
      </div>

      <div>
        <div>
          <button disabled={loading} onClick={loadReport}>
            <AddLink />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Item;
