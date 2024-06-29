import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { InputLabel, OutlinedInput, Paper, Stack } from "@mui/material";
import { LoginBlueBg, LoginBg } from "../../assets";
import { useStateContext } from "../../contexts/ContextProvider";
import { useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import toast from "react-hot-toast";
import axios from "../../api/axios";

const Login = () => {
  const { setToken, setUser } = useStateContext();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const data = new FormData(event.currentTarget);
    axios
      .post("/User/SignIn", {
        userName: data.get("username"),
        password: data.get("password"),
      })
      .then((res) => {
        setLoading(false);
        setToken(res.data.token);
        setUser(res.data.userName);
        navigate("/");
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.response.data);
      });
  };

  return (
    <Box component="main" sx={{ width: "100%" }}>
      <CssBaseline />
      <Grid container component="main" wrap="nowrap" sx={{ height: "100vh" }}>
        <Grid
          item
          md={8}
          component={Paper}
          elevation={6}
          square
          sx={{ display: { xs: "none", md: "grid" } }}
        >
          <Box
            sx={{
              "& img": { width: "70%" },
              height: "100%",
              display: "grid",
              placeItems: "center",
            }}
          >
            <img src={LoginBg} alt="login-bg" />
          </Box>
        </Grid>

        <Grid
          item
          md={12}
          sx={{
            display: "grid",
            placeItems: "center",
            backgroundImage: `url(${LoginBlueBg})`,
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light" ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
            width: "100%",
          }}
        >
          <Box
            sx={{
              py: 4,
              px: { xs: 4, md: 6 },
              borderRadius: "10px",
              display: "flex",
              flexDirection: "column",
              bgcolor: "#FFF",
              width: { xs: "90%", md: "70%" },
            }}
          >
            <Typography
              sx={{ fontSize: { xs: "36px", md: "55px" }, fontWeight: 600, color: "#212224" }}
            >
              Login
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <Stack dir="column" spacing={2}>
                <InputLabel>Username</InputLabel>

                <OutlinedInput
                  required
                  fullWidth
                  id="username"
                  name="username"
                  autoComplete="username"
                />

                <InputLabel>Password</InputLabel>

                <OutlinedInput
                  required
                  fullWidth
                  name="password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />

                <InputLabel></InputLabel>

                <LoadingButton
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 10 }}
                  loading={loading}
                >
                  {loading ? "signin..." : "Sign in"}
                </LoadingButton>
              </Stack>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Login;
