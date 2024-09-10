import { BarElement, BarElementProps } from "@mui/x-charts/BarChart";
import { animated, to } from "@react-spring/web";
import { FC, Fragment } from "react";

export interface Props extends BarElementProps {
  style: any;
  ownerState: any;
  inject: {
    label: string;
    color: string;
    link: string;
  };
}

const Bar: FC<Props> = ({ inject, ...props }) => {
  return (
    <Fragment>
      <BarElement
        {...props}
        id={`${props.id}`}
        dataIndex={props.ownerState?.dataIndex}
        fill={inject?.color ?? props.ownerState?.color}
      />
      <animated.text
        style={{
          x: to([props.style?.x, props.style?.width], (x) => x + 12),
          y: to(
            [props.style?.y, props.style?.height],
            (y, h) => y + (h + 12) / 2
          ),
          textAnchor: "start",
          textAlign: "center",
          textTransform: "capitalize",
          fontWeight: "bold",
          fill: "black",
          textShadow:
            "1px 1px 0 #FFF, -1px 1px 0 #FFF, -1px -1px 0 #FFF, 1px -1px 0 #FFF",
        }}
      >
        <a
          href={inject?.link}
          target="_blank"
          rel="noreferrer"
          style={{
            textDecoration: "none",
            fontWeight: "bold",
            textTransform: "capitalize",
          }}
          onClick={(e) => !inject?.link && e.preventDefault()}
        >
          {inject?.label}
        </a>
      </animated.text>
    </Fragment>
  );
};

export default Bar;
