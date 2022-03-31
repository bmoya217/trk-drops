// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { parse } from "csv-parse/sync";

const Reports = async (_, res) => {
  const csv = await fetch(
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQXT_6X16TmfCokS3MfgraZrRYaT8PAw3NIlzhuk5kYD4_d_iwzEqumFchal6eMPQALm-IQ_GvFjrJ-/pub?gid=2061234533&single=true&output=csv"
  ).then((data) => data.text());

  const records = parse(csv, {
    columns: true,
  });

  const reports = records.map((report) => report.URL && report.URL);

  res.status(200).json(reports);
};

export default Reports;
