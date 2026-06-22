import { Link, Typography } from "@mui/material";
import { FC } from "react";

interface Props {
  text?: string;
  link?: string;
  bold?: boolean;
  color?: string;
}

const CellText: FC<Props> = ({ text, link, bold, color }) => {
  const sx = {
    color,
    fontWeight: bold ? "bold" : "inherit",
  };

  if (link) {
    return (
      <Link
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        underline="none"
        color="inherit"
        sx={sx}
        onClick={(e) => e.preventDefault()}
      >
        {text}
      </Link>
    );
  }

  return <Typography sx={sx}>{text}</Typography>;
};

export default CellText;
