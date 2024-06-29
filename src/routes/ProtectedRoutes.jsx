import React from "react";
import { AppBar, Box, Divider, Drawer, IconButton, Toolbar, Typography } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import { useStateContext } from "../contexts/ContextProvider";
import { ChangeLanguage } from "../components";
import { useTranslation } from "react-i18next";

const ProtectedRoutes = (props) => {
  const { window } = props;
  const { token, user } = useStateContext();
  const navigate = useNavigate();

  const drawerWidth = 250;
  const container = window !== undefined ? () => window().document.body : undefined;

  const { i18n } = useTranslation();

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
  const [dir, setDir] = React.useState(i18n.dir());

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  React.useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token]);
  React.useEffect(() => {
    setDir(i18n.dir());
  }, [i18n.dir()]);

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        background: "#EEF5F9",
        "& .MuiPaper-root": { borderRadius: 0 },
      }}
    >
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          height: "72px",
          m: { sm: dir == "ltr" ? `0 0 ${drawerWidth}px 0` : `0 ${drawerWidth}px 0 0` },
          bgcolor: "#fff",
          borderLeft: "1px solid #E8E8E8",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="end"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              &&
            </IconButton>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography>{user}</Typography>
            <ChangeLanguage />
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              minHeight: "100vh",
            },
          }}
          anchor={dir == "ltr" ? "left" : "right"}
        >
          <Nav />
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              minHeight: "100vh",
            },
          }}
          open
          anchor={dir == "ltr" ? "left" : "right"}
        >
          <Nav />
        </Drawer>
        <Divider />
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          height: "92vh",
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default ProtectedRoutes;
