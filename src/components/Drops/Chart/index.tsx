import { axisClasses, BarChart } from "@mui/x-charts";
import { FC, useContext } from "react";
import { Order } from "../../../../public/types";
import { getComparator, getLink, openUrl } from "../../../../public/utils";
import { DataContext } from "../../context/DataContext";
import { ScreenContext } from "../../context/ScreenContext";
import Bar, { Props as BarProps } from "./Bar";
import Legend, { Props as LegendProps } from "./Legend";

const formatter = Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const Chart: FC = () => {
  const { width } = useContext(ScreenContext);
  const { difficulty, column, rows, links, loading } = useContext(DataContext);

  const dataset = rows
    .sort(getComparator(Order.desc, column))
    .filter((row) => ((row[column] as number) ?? 0) > 0);
  const yLabel = dataset?.[0]?.Player ? "Player" : "Item";

  return (
    <BarChart
      dataset={dataset}
      series={
        dataset.length
          ? [
              {
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
          valueFormatter: formatter.format,
          hideTooltip: true,
        },
      ]}
      width={width - 48}
      layout="horizontal"
      // tooltip={{ trigger: "none" }}
      slots={{ legend: Legend, bar: Bar }}
      slotProps={{
        legend: {
          inject: {
            label: column,
            link: links?.[column + "_" + difficulty],
          },
        } as Partial<LegendProps>,
        bar: (state) => {
          if (!state) return {};
          const row = dataset?.[state.dataIndex];
          if (!row) return {};

          return {
            inject: {
              label: `${row.Item ?? row.Player ?? ""}`,
              color: (row.color as string) ?? state.color,
              link: getLink(row, difficulty, links),
            },
          } as Partial<BarProps>;
        },
      }}
      onItemClick={(e, item) => {
        e.preventDefault();
        if (!item) return;
        const row = dataset[item.dataIndex];
        if (!row) return;

        const link = getLink(row, difficulty, links);
        if (link) openUrl(link);
      }}
      sx={{
        [`.${axisClasses.left} .${axisClasses.tickLabel}`]: {
          display: "none",
        },
      }}
      loading={loading}
    />
  );
};

export default Chart;
