import { Box, Divider, List, ListItem, ListItemButton, ListItemText, Toolbar } from "@mui/material";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import { Logo, Power, Student } from "../assets";
import { t } from "i18next";
import theme from "../themes";
import ConfirmDialog from "./ConfirmDialog";
import { useState } from "react";

const Nav = () => {
  const navigate = useNavigate();
  const param = useLocation();
  const { setToken } = useStateContext();
  const [open, setOpen] = useState(false);

  const routes = [{ title: t("Students Data"), img: Student, path: "/" }];

  const Logout = () => {
    setOpen(true);
  };

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Toolbar sx={{ height: "72px" }}>
        <Box sx={{ cursor: "pointer" }} onClick={() => navigate("/")}>
          <img src={Logo} alt="logo" />
        </Box>
      </Toolbar>
      <Divider />
      <Box sx={{ display: "flex", flexDirection: "column", height: "90%" }}>
        <List
          sx={{
            display: "flex",
            flexDirection: "column",
            py: 2,
            height: "95%",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {routes.map((route, index) => (
            <ListItem
              key={index}
              disablePadding
              onClick={() => navigate(route.path)}
              sx={{
                bgcolor: param.pathname === route.path ? theme.palette.primary["200"] : "",
                transition: "0.3s",
                ":hover": {
                  bgcolor: theme.palette.primary["200"],
                },
              }}
            >
              <ListItemButton>
                <img src={route.img} alt={route.title} width={24} height={24} />
                <ListItemText primary={route.title} sx={{ color: "#FFF", textAlign: "center" }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <List>
          <ListItem
            disablePadding
            sx={{
              transition: "0.3s",
              ":hover": {
                bgcolor: theme.palette.primary["200"],
              },
            }}
          >
            <ListItemButton onClick={Logout}>
              <img src={Power} alt="power" width={24} height={24} />
              <ListItemText primary={t("Logout")} sx={{ color: "#FFF", textAlign: "center" }} />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
      <ConfirmDialog
        dialogVariant="primary"
        title={t("Sign out")}
        subTitle={t("Are you sure you would like to sign out of your account?")}
        confirmButtonText={t("Sign out")}
        open={open}
        close={() => setOpen(false)}
        onSubmit={() => setToken(null)}
      />
    </Box>
  );
};

export default Nav;
