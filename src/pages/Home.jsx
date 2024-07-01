import { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import StudentTable from "./StudentTable";
import FilterBar from "./FilterBar";
import axios from "../api/axios";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { Plus } from "../assets";
import AddUpdateStudentDialog from "../components/AddUpdateStudentDialog";

function Home() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const getAllStudents = () => {
    axios
      .get("/Student/GetAll")
      .then((res) => {
        setFilteredStudents(res.data);
        setStudents(res.data);
        console.log(res.data);
        setLoading(false);
      })
      .catch((err) => {
        toast.error(err.response.data);
        setLoading(false);
      });
  };

  useEffect(() => {
    getAllStudents();
  }, []);
  const handleFilter = (filters) => {
    let filtered = students;
    if (filters.name) {
      filtered = filtered.filter(
        (student) =>
          student.firstName.toLowerCase().includes(filters.name.toLowerCase()) ||
          student.lastName.toLowerCase().includes(filters.name.toLowerCase())
      );
    }
    if (filters.date && filters.dateFilter) {
      if (filters.dateFilter === "equal") {
        filtered = filtered.filter(
          (student) => student.birthDate.substring(0, 10) === filters.date
        );
      } else if (filters.dateFilter === "greater") {
        filtered = filtered.filter(
          (student) => new Date(student.birthDate.substring(0, 10)) > new Date(filters.date)
        );
      } else if (filters.dateFilter === "less") {
        filtered = filtered.filter(
          (student) => new Date(student.birthDate.substring(0, 10)) < new Date(filters.date)
        );
      }
    }
    setFilteredStudents(filtered);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleUpdateStudents = () => {
    getAllStudents();
  };

  const handleSort = () => {
    const sorted = [...filteredStudents].sort((a, b) => {
      if (a.firstName < b.firstName) return sortOrder === "asc" ? -1 : 1;
      if (a.firstName > b.firstName) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    setFilteredStudents(sorted);
  };

  return (
    <Box
      sx={{
        // minHeight: "100%",
        background: "#fff",
        borderRadius: "11px",
        border: "1px solid #00000026",
        boxShadow: "1.5px 2.6px 10px 0px #7777771A",
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography sx={{ fontSize: { xs: "28px", md: "35px" }, fontWeight: 500, color: "#000" }}>
            {t("Students Data")}
          </Typography>
          <Button
            variant="contained"
            onClick={() => setOpen(true)}
            sx={{ display: "flex", gap: 1 }}
          >
            <Box component="span" sx={{ textWrap: "nowrap", display: { xs: "none", sm: "block" } }}>
              {t("Add Student")}
            </Box>
            <img src={Plus} alt="plus" width={20} height={20} />
          </Button>
        </Box>
        <FilterBar onFilter={handleFilter} />
        <Box
          sx={{
            height: "3px",
            background: "#9999995E",
            borderRadius: "22.56px 0px 0px 0px",
            my: 3,
          }}
        ></Box>
        <StudentTable
          students={filteredStudents}
          loading={loading}
          onSort={handleSort}
          sortOrder={sortOrder}
          onDelete={() => getAllStudents()}
        />

        <AddUpdateStudentDialog
          open={open}
          onClose={handleClose}
          update={handleUpdateStudents}
          initialValues={{
            id: "",
            firstName: "",
            lastName: "",
            birthDate: "",
            grade: { id: "" },
            gender: { id: "" },
            country: "",
            city: "",
            phone: "",
            remarks: "",
          }}
        />
      </Box>
    </Box>
  );
}

export default Home;
