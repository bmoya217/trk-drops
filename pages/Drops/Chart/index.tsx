import { axisClasses, BarChart, barLabelClasses } from "@mui/x-charts";
import { FC, useContext } from "react";
import { Difficulty, Links, Order, Row } from "../../../public/types";
import { getComparator, openUrl } from "../../../public/utils";
import { ScreenContext } from "../../Context/ScreenContext";
import Tooltip from "./Tooltip";

const formatter = Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

interface Props {
  difficulty: Difficulty;
  column: string;
  rows: Row[];
  links: Links;
  loading: boolean;
}

const Chart: FC<Props> = ({ difficulty, column, rows, links, loading }) => {
  //   const [link, setLink] = useState<string>(undefined);
  const { width } = useContext(ScreenContext);

  const dataset =
    rows
      ?.sort(getComparator(Order.desc, column))
      ?.filter((row) => row[column]) ?? [];
  const yLabel = rows?.[0]?.Player ? "Player" : "Item";

  return (
    // <Link
    //   href={link}
    //   onClick={(e) => e.preventDefault()}
    //   sx={{ cursor: "inherit" }}
    // >
    <BarChart
      dataset={dataset}
      series={
        dataset.length
          ? [
              {
                label: column + " dps",
                dataKey: column,
                valueFormatter: formatter.format,
              },
            ]
          : []
      }
      yAxis={[
        {
          dataKey: yLabel,
          scaleType: "band",
          tickPlacement: "middle",
          disableTicks: true,
          label: yLabel,
        },
      ]}
      xAxis={[
        {
          label: "∆ dps",
          tickNumber: 10,
          hideTooltip: true,
        },
      ]}
      sx={{
        [`.${axisClasses.left} .${axisClasses.tickLabel}`]: {
          display: "none",
        },
        [`.${barLabelClasses.root}`]: {
          textTransform: "capitalize",
        },
      }}
      width={width - 48}
      layout="horizontal"
      tooltip={{ trigger: "none" }}
      slotProps={{
        legend: { hidden: true },
        bar: (state) => {
          if (!state) return {};
          const row = dataset?.[state.dataIndex];
          if (!row) return {};

          const value = row[column] as number;
          if (value < 0) state.color = "#b41423";

          const color = row.color as string;
          state.color = color ? color : state.color;

          return {};
        },
        axisContent: {
          // @ts-ignore
          onChange: (dataIndex: number) => {
            const row = dataset?.[dataIndex];
            if (!row) return {};

            const name = row.Item ?? row.Player + "_" + difficulty;
            const link = links?.[name];

            //   setLink(link);
          },
        },
      }}
      slots={{ axisContent: Tooltip }}
      barLabel={(item, _) => {
        if (!item) return;
        const row = dataset[item.dataIndex];
        if (!row) return "";

        return `${row.Item ?? row.Player ?? ""}`;
      }}
      onItemClick={(e, item) => {
        e.preventDefault();
        if (!item) return;
        const row = dataset[item.dataIndex];
        if (!row) return;

        const name = row.Item ?? row.Player + "_" + difficulty;
        const link = links?.[name];
        if (link) openUrl(link);
      }}
      loading={loading}
    />
    // </Link>
  );
};

export default Chart;
