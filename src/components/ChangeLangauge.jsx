import { useTranslation } from "react-i18next";
// import { NavLink } from "react-router-dom";
// import { LANGUAGES } from "../constance";
import { MenuItem, Select } from "@mui/material";
import { t } from "i18next";

// const isActive = ({ isActive }) => `link ${isActive ? "active" : ""}`;

export const ChangeLanguage = () => {
  const { i18n } = useTranslation();

  const onChangeLang = (e) => {
    const lang_code = e.target.value;
    i18n.changeLanguage(lang_code);
    console.log(i18n.dir());
    console.log(i18n.language);
  };

  return (
    <Select size="small" defaultValue={i18n.language} onChange={onChangeLang}>
      <MenuItem value={"ar"}>{t("Arabic")}</MenuItem>
      <MenuItem value={"en"}>{t("English")}</MenuItem>
    </Select>
  );
};
