// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { parse } from "csv-parse/sync";
import { NextApiHandler } from "next";
import {
  Records,
  Reports_Difficulty,
  Reports_Team,
  Team,
} from "../../public/types";

const URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRX0_D17phIeBDTY7lSEao2OmP_zZTefFzyB4Ro5LGNMoPIhfogHptfZ1RBGMhCMngN1cJq1H_8Pz6_/pub?gid=1538781371&single=true&output=csv";

const DIFFICULTY: Reports_Difficulty = {
  Mythic: [],
  Heroic: [],
  Dungeon: [],
};

const REPORTS: Reports_Team = {
  Royal: DIFFICULTY,
  Kingdom: DIFFICULTY,
};

const trimUrl = (value: string) =>
  value.substring(value.lastIndexOf("/") + 1).trim();

const Reports: NextApiHandler<Reports_Team> = async (_, res) => {
  // fetch data from google sheets
  const csv = await fetch(URL, { cache: "no-store" }).then((data) =>
    data.text()
  );

  // parse
  const records = parse(csv, {
    columns: true,
  }) as Records[];

  // format
  const reports = records.reduce((prev, record) => {
    const team = record.Team as Team | "";
    if (team === "") return prev;

    return {
      ...prev,
      [team]: {
        Mythic: [...prev[team]?.Mythic, trimUrl(record.Mythic)],
        Heroic: [...prev[team]?.Heroic, trimUrl(record.Heroic)],
        Dungeon: [...prev[team]?.Dungeon, trimUrl(record.Dungeon)],
      },
    };
  }, REPORTS);

  res.status(200).json(reports);
};

export default Reports;
