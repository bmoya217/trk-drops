import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { CircularProgress } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { alpha } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { ITEMS_BY_BOSS } from "../../public/utils";
import Item from "./Item";

const EnhancedTableToolbar = ({
  loading,
  selected = [],
  boss,
  rows = [],
  loadReport,
  setBoss,
  setRows,
  setSelected,
}) => {
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(selected.length > 0 && {
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
        {selected.length > 0 ? (
          <Typography
            sx={{ flex: "1 1 100%" }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {selected.length} selected
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

        {selected.length > 0 ? (
          <Tooltip title="Delete">
            <IconButton
              onClick={() => {
                setRows(rows.filter((row) => !selected.includes(row.id)));
                setSelected([]);
              }}
            >
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
      <div style={{ display: "inline-flex" }}>
        {loading && <CircularProgress />}
        <Item loadReport={loadReport} />
      </div>
    </Toolbar>
  );
};

export default EnhancedTableToolbar;
