import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Formik } from "formik";
import * as Yup from "yup";
import React, { useEffect } from "react";
import { LoadingButton } from "@mui/lab";
import PropTypes from "prop-types";
import axios from "../api/axios";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import { CITIES, COUNTRIES } from "../constance";

const AddUpdateStudentDialog = (props) => {
  const { onClose, open, initialValues, update } = props;
  const { i18n } = useTranslation();

  const schema = Yup.object().shape({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    // birthDate: Yup.date().required("Birth date is required"),
    grade: Yup.string().required("Grade is required"),
    country: Yup.string().required("Country is required"),
    city: Yup.string().required("City is required"),
    phone: Yup.string().required(" ").matches(/^\d+$/, "Must be only digits"),
    gender: Yup.string().required("Gender is required"),
    remarks: Yup.string(),
  });

  const [changingSlide, setChangingSlide] = React.useState(false);
  const [grades, setGrades] = React.useState([]);
  const [genders, setGenders] = React.useState([]);
  const [gender, setGender] = React.useState("");
  const [grade, setGrade] = React.useState("");
  const [loadingGrades, setLoadingGrades] = React.useState(true);
  const [loadingGenders, setLoadingGenders] = React.useState(true);
  const [lang, setLang] = React.useState(0);

  const getGrades = () => {
    axios
      .get("/Settings/GetAllGrades")
      .then((res) => {
        setGrade(res.data[0].id);
        setGrades(res.data);
        setLoadingGrades(false);
        console.log(res.data);
      })
      .catch((err) => {
        setLoadingGrades(false);
        console.log(err);
      });
  };
  const getGenders = () => {
    axios
      .get("/Settings/GetAllGenders")
      .then((res) => {
        setGender(res.data[0].id);
        setGenders(res.data);
        setLoadingGenders(false);
        console.log(res.data);
      })
      .catch((err) => {
        setLoadingGenders(false);
        console.log(err);
      });
  };

  useEffect(() => {
    console.log(initialValues);
    if (open) {
      getGrades();
      getGenders();
    }
  }, [open]);

  useEffect(() => {
    setLang(i18n.dir() == "ltr" ? 0 : 1);
  }, [i18n.dir()]);

  return (
    <Dialog maxWidth="lg" open={open} onClose={() => onClose()}>
      <DialogTitle sx={{ minWidth: "1000px", fontSize: "30px", fontWeight: 600, color: "#212224" }}>
        {initialValues.id ? t("Modify Student Data") : t("Add Student")}
      </DialogTitle>
      <DialogContent sx={{ paddingBottom: "0.75rem" }}>
        {!loadingGrades && !loadingGenders ? (
          <Formik
            validationSchema={schema}
            initialValues={{
              ...initialValues,
              country: initialValues.country != "" ? initialValues.country : COUNTRIES[0],
              city: initialValues.city != "" ? initialValues.city : CITIES[0],
              gender: initialValues.gender.id != "" ? initialValues.gender.id : gender,
              grade: initialValues.grade.id != "" ? initialValues.grade.id : grade,
              birthDate:
                initialValues.birthDate != ""
                  ? initialValues.birthDate.substring(0, 10)
                  : "2000-01-01",
            }}
            onSubmit={async (values) => {
              console.log(values);
              setChangingSlide(true);
              if (initialValues.id) {
                axios
                  .put("/Student/Edit", {
                    ...values,
                    id: initialValues.id,
                  })
                  .then(() => {
                    update();
                    onClose();
                    setChangingSlide(false);
                  })
                  .catch((err) => {
                    console.log(err);
                    setChangingSlide(false);
                    onClose();
                  });
              } else {
                axios
                  .post("/Student/Add", values)
                  .then(() => {
                    update();
                    onClose();
                    setChangingSlide(false);
                  })
                  .catch((err) => {
                    console.log(err);
                    setChangingSlide(false);
                    onClose();
                  });
              }
            }}
          >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
              <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
                <Grid
                  container
                  spacing={2}
                  sx={{ "& label": { color: "#212224", fontSize: "18px" } }}
                >
                  <Grid item xs={6}>
                    <InputLabel required>{t("First Name")}</InputLabel>
                    <TextField
                      autoFocus
                      margin="dense"
                      id="firstName"
                      name="firstName"
                      type="text"
                      fullWidth
                      variant="outlined"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.firstName}
                      error={
                        errors.firstName && touched.firstName && errors.firstName ? true : false
                      }
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <InputLabel required>{t("Last Name")}</InputLabel>
                    <TextField
                      margin="dense"
                      id="lastName"
                      name="lastName"
                      type="text"
                      fullWidth
                      variant="outlined"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.lastName}
                      error={errors.lastName && touched.lastName && errors.lastName ? true : false}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <InputLabel required>{t("Date of Birth")}</InputLabel>
                    <TextField
                      fullWidth
                      id="birthDate"
                      name="birthDate"
                      type="date"
                      variant="outlined"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      sx={{ mt: 1 }}
                      value={values.birthDate}
                      error={
                        errors.birthDate && touched.birthDate && errors.birthDate ? true : false
                      }
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <InputLabel required>{t("Educational Level")}</InputLabel>
                    <Select
                      fullWidth
                      margin="dense"
                      id="grade"
                      name="grade"
                      value={values.grade}
                      sx={{ mt: 1 }}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      {loadingGrades ? (
                        <MenuItem>loading</MenuItem>
                      ) : (
                        grades.map((item) => {
                          const { id, translations } = item;
                          return (
                            <MenuItem key={id} value={id}>
                              {translations.filter((item) => item.cultureCode == lang)[0].name}
                            </MenuItem>
                          );
                        })
                      )}
                    </Select>
                  </Grid>
                  <Grid item xs={6}>
                    <InputLabel required>{t("Country")}</InputLabel>
                    <Select
                      fullWidth
                      id="country"
                      name="country"
                      value={values.country}
                      sx={{ mt: 1 }}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      {COUNTRIES.map((item) => (
                        <MenuItem key={item} value={item}>
                          {item}
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>
                  <Grid item xs={6}>
                    <InputLabel required>{t("City")}</InputLabel>
                    <Select
                      fullWidth
                      id="city"
                      name="city"
                      value={values.city || CITIES[0]}
                      sx={{ mt: 1 }}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      {CITIES.map((item) => (
                        <MenuItem key={item} value={item}>
                          {item}
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>
                  <Grid item xs={6}>
                    <InputLabel required>{t("Mobile")}</InputLabel>
                    <TextField
                      margin="dense"
                      id="phone"
                      name="phone"
                      type="text"
                      fullWidth
                      variant="outlined"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.phone}
                      error={errors.phone && touched.phone && errors.phone ? true : false}
                    />
                    <Typography color={"error"}>
                      {errors.phone && touched.phone && errors.phone}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <InputLabel required>{t("Gender")}</InputLabel>
                    <Select
                      fullWidth
                      id="gender"
                      name="gender"
                      value={values.gender}
                      sx={{ mt: 1 }}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      {loadingGenders ? (
                        <MenuItem>loading</MenuItem>
                      ) : (
                        genders.map((item) => {
                          const { id, translations } = item;
                          return (
                            <MenuItem key={id} value={id}>
                              {translations.filter((item) => item.cultureCode == lang)[0].name}
                            </MenuItem>
                          );
                        })
                      )}
                    </Select>
                  </Grid>
                  <Grid item xs={12}>
                    <InputLabel>{t("Notes")}</InputLabel>
                    <TextField
                      multiline
                      minRows={4}
                      margin="dense"
                      id="remarks"
                      name="remarks"
                      type="text"
                      fullWidth
                      variant="outlined"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.remarks}
                    />
                  </Grid>
                </Grid>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                    mt: 2,
                    "& button": {
                      flex: 1,
                    },
                  }}
                >
                  <LoadingButton
                    type="submit"
                    loading={changingSlide}
                    loadingPosition="center"
                    variant="contained"
                    onClick={() => console.log(values)}
                  >
                    {initialValues.id ? t("Update") : t("Add")}
                  </LoadingButton>
                  <Button variant="outlined" onClick={() => onClose()}>
                    {t("Cancel")}
                  </Button>
                </Box>
              </Box>
            )}
          </Formik>
        ) : (
          <Box sx={{ minHeight: 600, display: "grid", placeItems: "center" }}>
            <CircularProgress />
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

AddUpdateStudentDialog.propTypes = {
  onClose: PropTypes.func,
  update: PropTypes.func,
  open: PropTypes.bool,
  initialValues: PropTypes.object,
};

export default AddUpdateStudentDialog;
