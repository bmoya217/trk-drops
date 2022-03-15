import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { alpha } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { ITEMS_BY_BOSS } from "../utils";
import Item from "./Item";

const EnhancedTableToolbar = ({ numSelected, boss, setBoss, setRows }) => {
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
      style={{
        display: "inline-flex",
        justifyContent: "space-between",
      }}
    >
      <div>
        {numSelected > 0 ? (
          <Typography
            sx={{ flex: "1 1 100%" }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {numSelected} selected
          </Typography>
        ) : (
          <FormControl size="small" style={{ width: "300px" }}>
            <InputLabel id="demo-simple-select-label">Boss</InputLabel>
            <Select
              value={boss}
              label="Boss"
              onChange={(e) => setBoss(e.target.value)}
            >
              {Object.keys(ITEMS_BY_BOSS).map((boss, i) => {
                return (
                  <MenuItem key={i} value={boss}>
                    {boss}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        )}

        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Filter list">
            <IconButton>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        )}
      </div>
      <div>
        <Item addRow={(row) => setRows((rows) => [...rows, row])} />
      </div>
    </Toolbar>
  );
};

export default EnhancedTableToolbar;
