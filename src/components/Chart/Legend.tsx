import { Link } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { LegendRendererProps, useDrawingArea } from "@mui/x-charts";
import { FC } from "react";

export interface Props extends LegendRendererProps {
  inject: {
    label: string;
    link: string;
  };
}

const Legend: FC<Props> = ({ inject }) => {
  const drawingArea = useDrawingArea();
  const theme = useTheme();

  return (
    <g transform={`translate(${drawingArea.left} ${drawingArea.top - 12})`}>
      <text fill={theme.palette.text.primary}>
        <Link
          href={inject?.link}
          target="_blank"
          rel="noreferrer"
          underline="none"
          color="inherit"
          fontWeight="bold"
          textTransform="capitalize"
          onClick={(e) => !inject?.link && e.preventDefault()}
        >
          {inject?.label}
        </Link>
      </text>
    </g>
  );
};

export default Legend;
