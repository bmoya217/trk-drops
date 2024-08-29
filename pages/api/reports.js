// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { parse } from "csv-parse/sync";

const MYTHIC =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRX0_D17phIeBDTY7lSEao2OmP_zZTefFzyB4Ro5LGNMoPIhfogHptfZ1RBGMhCMngN1cJq1H_8Pz6_/pub?gid=1538781371&single=true&output=csv";

const HEROIC =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRX0_D17phIeBDTY7lSEao2OmP_zZTefFzyB4Ro5LGNMoPIhfogHptfZ1RBGMhCMngN1cJq1H_8Pz6_/pub?gid=1293324523&single=true&output=csv";
const URL = "Sim URL (5 minute patchwerk)";
const TEAM = "Raid Team";

const byTeam = (team) => (report) => report[TEAM] === team;
const toUrl = (report) => report[URL] && report[URL];

const Reports = async (req, res) => {
  const team = req?.query?.team === "Royal" ? "Royal" : "Kingdom";
  const url = req?.query?.difficulty === "Mythic" ? MYTHIC : HEROIC;

  // fetch data from google sheets
  const csv = await fetch(url).then((data) => data.text());

  // parse
  const records = parse(csv, {
    columns: true,
  });

  // filter sims and get url column data
  const urls = records?.filter(byTeam(team))?.map(toUrl);

  // trim urls to only report name
  const reports = urls.map((url) => {
    return url.substring(url.lastIndexOf("/") + 1).trim();
  });

  res.status(200).json(reports);
};

export default Reports;
