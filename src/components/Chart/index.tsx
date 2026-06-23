import { axisClasses, BarChart } from "@mui/x-charts";
import { FC } from "react";
import { getLink, openUrl } from "../../lib/utils";
import { useAppSelector } from "../../store/hooks";
import { useScreen } from "../../store/ScreenContext";
import { selectChartModel } from "../../store/viewSelectors";
import Bar, { Props as BarProps } from "./Bar";
import Legend, { Props as LegendProps } from "./Legend";

const formatter = Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const getChartSeries = (dataset: unknown[], column: string) => {
  if (!dataset.length) return [];

  return [
    {
      dataKey: column,
      valueFormatter: formatter.format,
    },
  ];
};

const Chart: FC = () => {
  const { width } = useScreen();
  const { column, dataset, difficulty, links, loading, yLabel } =
    useAppSelector(selectChartModel);

  return (
    <BarChart
      dataset={dataset}
      series={getChartSeries(dataset, column)}
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

          const value = row[column];

          return {
            inject: {
              label: `${row.Item ?? row.Player ?? ""}`,
              color: (row.color as string) ?? state.color,
              link: getLink(row, difficulty, links),
              isFaded: typeof value === "number" ? value < 0 : false,
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
