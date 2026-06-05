import type { NextApiHandler } from "next";

const getReportId = (report: string | string[] | undefined) => {
  if (typeof report === "string") return report.trim();
  if (Array.isArray(report)) return report[0]?.trim() ?? "";

  return "";
};

const getReportUrl = (report: string) =>
  `https://www.raidbots.com/simbot/report/${encodeURIComponent(
    report,
  )}/data.json`;

const Report: NextApiHandler = async (req, res) => {
  const report = getReportId(req.query.report);
  if (!report) {
    res.status(400).json({ error: "Missing report id" });
    return;
  }

  try {
    let page = await fetch(getReportUrl(report), {
      cache: "force-cache",
    });

    if (page.status !== 200) {
      page = await fetch(getReportUrl(report), {
        cache: "reload",
      });
    }

    if (page.status !== 200) {
      res.status(page.status).json({});
      return;
    }

    const json = await page.json();
    res.status(200).json(json);
  } catch {
    res.status(502).json({ error: "Unable to fetch Raidbots report" });
  }
};

export default Report;
