import { Avatar, IconButton } from "@mui/material";
import { FC } from "react";

interface Props {
  refetch: Function;
}

const Logo: FC<Props> = ({ refetch }) => {
  return (
    <IconButton size="small" sx={{ p: 0, m: 0 }} onClick={() => refetch()}>
      <Avatar src="/images/trk.png" alt="TRK" sx={{ width: 64, height: 64 }} />
    </IconButton>
  );
};

export default Logo;
