// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const Report = async (req, res) => {
  const report = req?.query?.report;
  if (!report) return res.status(404);

  const page = await fetch(
    "https://www.raidbots.com/simbot/report/" + report + "/data.json",
    {
      cache: "force-cache",
    }
  );

  if (!page.status === 200) return res.status(page.status);

  const json = await page.json();
  res.status(200).json(json);
};

export default Report;
