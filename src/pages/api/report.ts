import type { NextApiHandler } from "next";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const Report: NextApiHandler = async (req, res) => {
  const report = req?.query?.report;
  if (!report) {
    res.status(404);
    return;
  }

  let page = await fetch(
    "https://www.raidbots.com/simbot/report/" + report + "/data.json",
    {
      cache: "force-cache",
    }
  );

  if (!(page.status === 200)) {
    page = await fetch(
      "https://www.raidbots.com/simbot/report/" + report + "/data.json",
      {
        cache: "reload",
      }
    );
  }

  if (!(page.status === 200)) {
    res.status(page.status).json({});
    return;
  }

  const json = await page.json();
  res.status(200).json(json);
};

export default Report;
