import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1F7BF4",
      light: "#1F7BF4ee",
      200: "#F0F7FB",
      contrastText: "#fff",
    },
    error: {
      main: "#F34235",
      light: "#F34235ee",
      contrastText: "#fff",
    },
  },
  typography: {
    allVariants: {
      color: "#666666",
    },
  },
  components: {
    // Inputs
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "& input": {
            color: "#000",
            background: "#F5F5F5",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            // border: "1px solid #00000038",
            borderRadius: "10px",
            overflow: "hidden",
          },
          "& .MuiSelect-select": {
            padding: "12.5px 14px",
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          background: "#F5F5F5",
          outlineWidth: "1px",
          "& input": {
            padding: "12.5px 14px",
          },
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          "& input": {
            padding: "3.5px 4px 3.5px 5px !important",
          },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: "#E2E2E2",
          borderRadius: "10px",
        },
      },
    },
    MuiTableSortLabel: {
      styleOverrides: {
        root: {
          "&:hover": {
            color: "#FFF",
          },
          "&.Mui-active": {
            "&&": {
              color: "#FFF",
              "& *": {
                color: "#FFF",
              },
            },
          },
        },
        icon: {
          color: "#FFF",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "capitalize",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "11px",
          boxShadow: "none",
        },
      },
    },
  },
});

export default theme;
