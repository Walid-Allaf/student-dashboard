import { Box } from "@mui/material";
import { Female, Male } from "../assets";

export const getGenderImg = (gender) => {
  if (gender == "Male" || gender == "ذكر") {
    return (
      <Box component="div">
        <img src={Male} alt="male" width={13} height={20} />
      </Box>
    );
  } else {
    return (
      <Box>
        <img src={Female} alt="female" width={13} height={20} />
      </Box>
    );
  }
};
export const getColoredCircle = (id) => {
  const color = id.substring(0, 6);
  return (
    <Box
      component="div"
      sx={{ width: "10px", height: "10px", background: `#${color}`, borderRadius: "50%" }}
    ></Box>
  );
};
