import {
  Autocomplete,
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
import { Country, State } from "country-state-city";
import { Formik } from "formik";
import * as Yup from "yup";
import React, { useEffect } from "react";
import { LoadingButton } from "@mui/lab";
import PropTypes from "prop-types";
import axios from "../api/axios";
import { t } from "i18next";
import { useTranslation } from "react-i18next";

const AddUpdateStudentDialog = (props) => {
  const { onClose, open, initialValues, update } = props;
  const { i18n } = useTranslation();

  const schema = Yup.object().shape({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    // birthDate: Yup.date().required("Birth date is required"),
    grade: Yup.string().required("Grade is required"),
    // country: Yup.string().required("Country is required"),
    // city: Yup.string().required("City is required"),
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

  // FOR COUNTRIES
  const [countries, setCountries] = React.useState([]);
  const [states, setStates] = React.useState([]);
  const [selectedCountry, setSelectedCountry] = React.useState(null);
  const [selectedState, setSelectedState] = React.useState(null);

  const handleCountryChange = (event, newValue) => {
    setSelectedCountry(newValue);
    if (newValue) {
      const countryStates = State.getStatesOfCountry(newValue.isoCode);
      setStates(countryStates);
    } else {
      setStates([]);
    }
    setSelectedState(null);
  };

  const handleStateChange = (event, newValue) => {
    setSelectedState(newValue);
  };

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
    const allCountries = Country.getAllCountries();
    setCountries(allCountries);
    if (initialValues.id) {
      const country = allCountries.filter((country) => country.name === initialValues.country)[0];
      const countryStates = State.getStatesOfCountry(country.isoCode);
      setSelectedState(countryStates.filter((state) => state.name === initialValues.city)[0]);
      setStates(countryStates);
      setSelectedCountry(country);
    }

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
      <DialogTitle
        sx={{
          maxWidth: "1000px",
          minWidth: "300px",
          fontSize: { xs: "26px", sm: "30px" },
          fontWeight: 600,
          color: "#212224",
        }}
      >
        {initialValues.id ? t("Modify Student Data") : t("Add Student")}
      </DialogTitle>
      <DialogContent sx={{ paddingBottom: "0.75rem" }}>
        {!loadingGrades && !loadingGenders ? (
          <Formik
            validationSchema={schema}
            initialValues={{
              ...initialValues,
              // country: initialValues.country,
              // city: initialValues.city,
              gender: initialValues.gender.id != "" ? initialValues.gender.id : gender,
              grade: initialValues.grade.id != "" ? initialValues.grade.id : grade,
              birthDate:
                initialValues.birthDate != ""
                  ? initialValues.birthDate.substring(0, 10)
                  : "2000-01-01",
            }}
            onSubmit={async (values) => {
              console.log({
                ...values,
                country: selectedCountry.name,
                city: selectedState.name,
              });
              setChangingSlide(true);
              if (initialValues.id) {
                axios
                  .put("/Student/Edit", {
                    ...values,
                    id: initialValues.id,
                    country: selectedCountry.name,
                    city: selectedState.name,
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
                  .post("/Student/Add", {
                    ...values,
                    country: selectedCountry.name,
                    city: selectedState.name,
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
              }
            }}
          >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
              <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
                <Grid
                  container
                  rowSpacing={1}
                  columnSpacing={2}
                  sx={{ "& label": { color: "#212224", fontSize: "18px" } }}
                >
                  <Grid item xs={12} sm={6}>
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
                  <Grid item xs={12} sm={6}>
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
                  <Grid item xs={12} sm={6}>
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
                  <Grid item xs={12} sm={6}>
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
                  <Grid item xs={12} sm={6}>
                    <InputLabel>Country</InputLabel>
                    <Autocomplete
                      id="country"
                      name="country"
                      fullWidth
                      sx={{ mt: 1 }}
                      options={countries}
                      getOptionLabel={(option) => option.name}
                      renderInput={(params) => (
                        <TextField
                          error={!selectedCountry && touched.country ? true : false}
                          {...params}
                          variant="outlined"
                        />
                      )}
                      value={selectedCountry}
                      onChange={handleCountryChange}
                      onBlur={handleBlur}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InputLabel>City</InputLabel>
                    <Autocomplete
                      id="city"
                      name="city"
                      fullWidth
                      sx={{ mt: 1 }}
                      options={states}
                      getOptionLabel={(option) => option.name}
                      renderInput={(params) => (
                        <TextField
                          error={!selectedState && touched.city ? true : false}
                          {...params}
                          variant="outlined"
                        />
                      )}
                      value={selectedState}
                      onChange={handleStateChange}
                      onBlur={handleBlur}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
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
                  <Grid item xs={12} sm={6}>
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
                    my: 2,
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
                    // onClick={() => console.log(values)}
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
