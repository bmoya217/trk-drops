import { SxProps } from "@mui/material";
import {
  axisClasses,
  BarChart,
  barLabelClasses,
  ChartsXAxisProps,
  ChartsYAxisProps,
} from "@mui/x-charts";
import { FC, useContext } from "react";
import { Difficulty, Links, Order, Row } from "../../../public/types";
import { getComparator, openUrl } from "../../../public/utils";
import { ScreenContext } from "../../Context/ScreenContext";

const formatter = Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const formatLabel = (row: Row): Row => ({
  ...row,
  dataKey: row.Player ?? row.Item, //(row.Item as string)?.split(" ")[0],
});

interface Props {
  difficulty: Difficulty;
  column: string;
  rows: Row[];
  links: Links;
  loading: boolean;
}

const xAxis: ChartsXAxisProps = {
  label: "dps gain",
  tickNumber: 10,
};

const yAxis: ChartsYAxisProps & { dataKey: string; scaleType: "band" } = {
  dataKey: "dataKey",
  scaleType: "band",
  labelStyle: { color: "red", display: "none!" },
  tickPlacement: "middle",
  disableTicks: true,
};

const sx: SxProps = {
  [`.${axisClasses.left} .${axisClasses.tickLabel}`]: {
    display: "none",
  },
  [`.${barLabelClasses.root}`]: {
    textTransform: "capitalize",
  },
};

const Chart: FC<Props> = ({ difficulty, column, rows, links, loading }) => {
  const { width } = useContext(ScreenContext);

  const dataset =
    rows
      ?.sort(getComparator(Order.desc, column))
      ?.filter((row) => row[column])
      ?.map(formatLabel) ?? [];
  const series = dataset.length
    ? [
        {
          label: column + " dps",
          dataKey: column,
          valueFormatter: formatter.format,
        },
      ]
    : [];

  return (
    <BarChart
      dataset={dataset}
      series={series}
      yAxis={[{ ...yAxis }]}
      xAxis={[{ ...xAxis }]}
      sx={sx}
      width={width - 48}
      layout="horizontal"
      tooltip={{ trigger: "none" }}
      slotProps={{
        legend: { hidden: true },
        bar: (state) => {
          if (!state) return;

          const row = dataset?.[state.dataIndex];
          const color = row?.color as string;
          state.color = color ? color : state.color;

          return {};
        },
        // barLabel: (state) => {
        //   if (!state) return;

        //   const row = dataset?.[state.dataIndex];
        //   const link = row?.Item ?? row?.Player + "_" + difficulty;
        //   const url = links?.[link];

        //   return {
        //     children: [
        //       <Link
        //         href={url}
        //         underline="none"
        //         color="inherit"
        //         sx={sx}
        //         onClick={(e) => e.preventDefault()}
        //       />,
        //     ],
        //   };
        // },
      }}
      slots={
        {
          // barLabel: (props) => {
          //   const row = dataset[props.dataIndex];
          //   const name = row.Item ?? row.Player;
          //   const linkName = row.Item ?? row.Player + "_" + difficulty;
          //   const link = links?.[linkName];
          //   if (!link) {
          //     return (
          //       <Typography sx={{ textTransform: "capitalize" }}>
          //         {name}
          //       </Typography>
          //     );
          //   }
          //   return (
          //     // @ts-ignore
          //     <Link
          //       href={link}
          //       underline="none"
          //       color="inherit"
          //       onClick={(e) => e.preventDefault()}
          //       {...props}
          //     >
          //       {name}
          //     </Link>
          //   );
          // },
        }
      }
      barLabel={(item) => {
        const row = dataset[item.dataIndex];
        const name = row.Item ?? row.Player;
        return name as string;
      }}
      onItemClick={(e, item) => {
        e.preventDefault();
        const row = dataset[item.dataIndex];
        const name = row.Item ?? row.Player + "_" + difficulty;
        const link = links?.[name];
        if (link) openUrl(link);
      }}
      loading={loading}
    />
  );
};

export default Chart;
