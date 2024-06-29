import { Box, Button, Dialog, DialogActions, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { Info, Logout } from "../assets";
import theme from "../themes";

const ConfirmDialog = (props) => {
  const { title, subTitle, addtional, dialogVariant, onSubmit, confirmButtonText, close, open } =
    props;
  return (
    <Dialog open={open} onClose={close}>
      <Box
        sx={{
          maxWidth: "483px",
          minWidth: "483px",
          height: "147px",
          display: "grid",
          placeItems: "center",
          borderRadius: "11px",
          background:
            dialogVariant == "error" ? theme.palette.error.main : theme.palette.primary.main,
        }}
      >
        <img
          src={dialogVariant == "error" ? Info : Logout}
          alt="dialog-img"
          width={66}
          height={66}
        />
      </Box>
      <Box sx={{ "& *": { textAlign: "center" } }}>
        <Typography
          color={dialogVariant}
          className="roboto"
          sx={{ fontSize: "20px", fontWeight: 700, p: 2, mt: 1 }}
        >
          {title}
        </Typography>

        <Typography className="roboto" sx={{ maxWidth: "483px", px: 4, fontSize: "14px" }}>
          {subTitle}
        </Typography>
        <Typography
          className="roboto"
          color={dialogVariant}
          sx={{ maxWidth: "483px", px: 4, mb: 2, fontSize: "14px" }}
        >
          {addtional}
        </Typography>

        <DialogActions
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            mb: 6,
            mx: "27px",
            "& button": { flex: 1 },
          }}
        >
          <Button
            color={dialogVariant}
            variant="contained"
            onClick={() => {
              if (onSubmit) {
                onSubmit();
              }
              close();
            }}
          >
            {confirmButtonText}
          </Button>
          <Button color={dialogVariant} variant="outlined" onClick={close}>
            Cancel
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

ConfirmDialog.propTypes = {
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string.isRequired,
  addtional: PropTypes.string,
  dialogVariant: PropTypes.string.isRequired,
  confirmButtonText: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default ConfirmDialog;
