import { useState } from "react";
import {
  Box,
  TextField,
  MenuItem,
  FormControl,
  Select,
  Typography,
  InputAdornment,
} from "@mui/material";
import PropTypes from "prop-types";
import { Filter, Search } from "../assets";
import { t } from "i18next";

function FilterBar({ onFilter }) {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [dateFilter, setDateFilter] = useState("equal");
  const [foucsed, setFoucsed] = useState(false);

  const handleFilter = () => {
    onFilter({ name, date, dateFilter });
  };

  return (
    <Box
      display="flex"
      flexDirection={{ xs: "column", md: "row" }}
      alignItems={{ xs: "flex-start", md: "center" }}
      gap={2}
      minHeight={49}
      mb={2}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <img src={Filter} alt="filter-by" width={24} height={24} />
        <Typography color="primary.main" sx={{ textWrap: "nowrap" }}>
          {t("Filter By")}
        </Typography>
      </Box>
      <TextField
        placeholder={t("Search by first name, last name")}
        variant="outlined"
        size="small"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          onFilter({ name: e.target.value, date, dateFilter });
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <img src={Search} alt="search" />
            </InputAdornment>
          ),
        }}
      />

      <Box display="flex" alignItems="center">
        <FormControl
          onClick={() => {
            let elements = document.querySelectorAll(".MuiFormControl-root");

            elements.forEach((el) => {
              let hasChildren = !!el.querySelector(".Mui-focused");
              setFoucsed(hasChildren);
            });
          }}
          variant="outlined"
          size="small"
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            borderRadius: "10px",
            overflow: "hidden",
            ":hover": { border: "1px solid #555" },
            border: foucsed ? "1px solid #1F7BF4" : "1px solid #00000038",
          }}
        >
          <Select
            sx={{ "& .MuiOutlinedInput-notchedOutline": { border: "none", outline: "none" } }}
            value={dateFilter}
            onChange={(e) => {
              setDateFilter(e.target.value);
              onFilter({ name, date, dateFilter: e.target.value });
            }}
          >
            <MenuItem value="equal">{t("Equal to")}</MenuItem>
            <MenuItem value="greater">{t("Greater than")}</MenuItem>
            <MenuItem value="less">{t("Less than")}</MenuItem>
          </Select>
          <Box sx={{ width: "1px", height: "30px", background: "#77747438" }}></Box>
          <TextField
            type="date"
            variant="outlined"
            size="small"
            InputLabelProps={{
              shrink: true,
            }}
            value={date}
            sx={{ "& .MuiOutlinedInput-notchedOutline": { border: "none", outline: "none" } }}
            onChange={(e) => {
              setDate(e.target.value);
              onFilter({ name, date: e.target.value, dateFilter });
            }}
          />
        </FormControl>
      </Box>
    </Box>
  );
}

FilterBar.propTypes = {
  onFilter: PropTypes.func,
};

export default FilterBar;
