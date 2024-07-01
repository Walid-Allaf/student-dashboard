import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  TableSortLabel,
  CircularProgress,
  Box,
  Paper,
} from "@mui/material";
import theme from "../themes";
import { getColoredCircle, getGenderImg } from "../utils";
import PropTypes from "prop-types";
import { Delete, Edit } from "../assets";
import AddUpdateStudentDialog from "../components/AddUpdateStudentDialog";
import { t } from "i18next";
import { ConfirmDialog } from "../components";
import axios from "../api/axios";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

function StudentTable({ students, loading, onSort, sortOrder, onDelete }) {
  const { i18n } = useTranslation();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [studentId, setStudentId] = useState("");
  const [initialValues, setInitialValues] = useState({
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
  });

  const [lang, setLang] = useState(0);
  useEffect(() => {
    setLang(i18n.dir() == "ltr" ? 0 : 1);
  }, [i18n.dir()]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleUpdateStudents = () => {
    onDelete();
  };

  const deleteStudent = () => {
    axios
      .delete(`/Student/Remove?Id=${studentId}`)
      .then(() => {
        toast.success("Student deleted successfully");
        onDelete();
      })
      .catch((err) => {
        toast.error(err.response.data);
      });
  };

  return (
    <Paper sx={{ maxWidth: "100%" }}>
      <TableContainer>
        <Table>
          <TableHead sx={{ background: theme.palette.primary.main, borderRadius: "10px" }}>
            <TableRow>
              <TableCell>
                <TableSortLabel active direction={sortOrder} onClick={onSort}>
                  {t("First Name")}
                </TableSortLabel>
              </TableCell>
              <TableCell>{t("Last Name")}</TableCell>
              <TableCell>{t("Date of Birth")}</TableCell>
              <TableCell>{t("Educational Level")}</TableCell>
              <TableCell>{t("Gender")}</TableCell>
              <TableCell>{t("Country")}</TableCell>
              <TableCell>{t("City")}</TableCell>
              <TableCell>{t("Mobile Number")}</TableCell>
              <TableCell>{t("Notes")}</TableCell>
              <TableCell>{t("Actions")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <br />
            {loading ? (
              <TableRow>
                <TableCell colSpan={10} sx={{ textAlign: "center" }}>
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            ) : students.length > 0 ? (
              students
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((student, index) => (
                  <TableRow key={index}>
                    <TableCell>{student.firstName}</TableCell>
                    <TableCell>{student.lastName}</TableCell>
                    <TableCell>{student.birthDate.substring(0, 10)}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {getColoredCircle(student.grade.id)}
                        {
                          student.grade.translations.filter((item) => item.cultureCode == lang)[0]
                            .name
                        }
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {getGenderImg(
                          student.gender.translations.filter((item) => item.cultureCode == lang)[0]
                            .name
                        )}
                        {
                          student.gender.translations.filter((item) => item.cultureCode == lang)[0]
                            .name
                        }
                      </Box>
                    </TableCell>
                    <TableCell>{student.country}</TableCell>
                    <TableCell>{student.city}</TableCell>
                    <TableCell>{student.phone}</TableCell>
                    <TableCell>{student.remarks}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", flexWrap: "nowrap" }}>
                        <IconButton
                          onClick={() => {
                            setOpenDelete(true);
                            setStudentId(student.id);
                          }}
                        >
                          <img src={Delete} alt="delete" width={20} height={20} />
                        </IconButton>
                        <IconButton
                          onClick={() => {
                            setInitialValues(student);
                            setOpen(true);
                          }}
                        >
                          <img src={Edit} alt="edit" width={20} height={20} />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} textAlign="center">
                  {t("No Students")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={students.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        variant="outlined"
        shape="rounded"
      />

      <AddUpdateStudentDialog
        open={open}
        onClose={handleClose}
        update={handleUpdateStudents}
        initialValues={initialValues}
      />

      <ConfirmDialog
        dialogVariant="error"
        title={t("Are you sure ?")}
        subTitle={t("Are you sure you want to delete this student's information ?")}
        addtional={t(" This action cannot be undone.")}
        confirmButtonText={t("Delete")}
        open={openDelete}
        close={() => setOpenDelete(false)}
        onSubmit={deleteStudent}
      />
    </Paper>
  );
}
StudentTable.propTypes = {
  students: PropTypes.array,
  loading: PropTypes.bool,
  onSort: PropTypes.func,
  onDelete: PropTypes.func,
  sortOrder: PropTypes.number,
};
export default StudentTable;
