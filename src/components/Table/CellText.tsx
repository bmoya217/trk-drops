import { Link, Typography } from "@mui/material";
import { FC } from "react";

interface Props {
  text?: string;
  link?: string;
  bold?: boolean;
}

const CellText: FC<Props> = ({ text, link, bold }) => {
  const sx = {
    fontWeight: bold ? "bold" : "inherit",
    textTransform: "capitalize",
  };

  if (link) {
    return (
      <Link
        href={link}
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
