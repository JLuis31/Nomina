"use client";
import { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import toast from "react-hot-toast";
import UpdateTable from "./UpdateTable";

const GeneralTable = (props) => {
  const [selectedDeduction, setSelectedDeduction] = useState();
  const [showEditForm, setShowEditForm] = useState(false);
  const confirmDelete = ({ id, description }) => {
    toast(
      (t) => (
        <span
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          ¿Seguro que quieres borrar el departamento?
          <button
            style={{
              marginLeft: 8,
              backgroundColor: "#d32f2f",
              color: "white",
              border: "none",
              padding: "4px 8px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
            onClick={() => {
              props.handleDelete({ id, description });
              toast.dismiss((t as unknown as { id: string }).id);
            }}
          >
            Sí
          </button>
          <button
            style={{
              marginLeft: 8,
              cursor: "pointer",
              backgroundColor: "gray",
              color: "white",
              border: "none",
              padding: "4px 8px",
              borderRadius: "4px",
            }}
            onClick={() => toast.dismiss((t as unknown as { id: string }).id)}
          >
            No
          </button>
        </span>
      ),
      { duration: Infinity }
    );
  };

  const handleShowEditForm = () => {
    setShowEditForm(!showEditForm);
  };

  const dataToRender =
    [
      props.departmentDetails,
      props.employeeTypesDetails,
      props.jobPositionsDetails,
      props.payFrequencyDetails,
      [],
      props.statesDetails,
      props.cityDetails,
    ][props.selectedCatalog.value - 1] || [];

  return (
    <div>
      <Box sx={{ width: "100%", mt: 3 }}>
        <Paper sx={{ width: "100%", mb: 2 }}>
          <Typography sx={{ flex: "1 1 100%", p: 2 }} variant="h6">
            {props.selectedCatalog.value === 1
              ? "Departments"
              : props.selectedCatalog.value === 2
              ? "Employee Types"
              : props.selectedCatalog.value === 3
              ? "Job Positions"
              : props.selectedCatalog.value === 4
              ? "Payment Frequency"
              : props.selectedCatalog.value === 6
              ? "States"
              : props.selectedCatalog.value === 7
              ? "Cities"
              : ""}
          </Typography>
          <TableContainer>
            <Table className="table">
              <TableHead>
                <TableRow>
                  <TableCell style={{ color: "white" }} className="header">
                    {props.selectedCatalog.value === 1
                      ? "Department Name"
                      : props.selectedCatalog.value === 2
                      ? "Employee Type Name"
                      : props.selectedCatalog.value === 3
                      ? "Job Position Name"
                      : props.selectedCatalog.value === 4
                      ? "Payment Frequency Name"
                      : props.selectedCatalog.value === 6
                      ? "State Name"
                      : props.selectedCatalog.value === 7
                      ? "City Name"
                      : ""}
                  </TableCell>
                  <TableCell
                    style={{ color: "white" }}
                    className="header"
                    align="center"
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(dataToRender) && dataToRender.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} align="center">
                      No hay datos por mostrar
                    </TableCell>
                  </TableRow>
                ) : (
                  dataToRender.map((dep: any) => (
                    <TableRow
                      key={
                        dep.Id_Department ||
                        dep.Id_Employee_type ||
                        dep.Id_Job ||
                        dep.Id_PayFrequency ||
                        dep.Id_State ||
                        dep.Id_City
                      }
                      onClick={() => {
                        setSelectedDeduction({
                          Department:
                            props.selectedCatalog.value === 1
                              ? "Departments"
                              : props.selectedCatalog.value === 2
                              ? "Employee Types"
                              : props.selectedCatalog.value === 3
                              ? "Job Positions"
                              : props.selectedCatalog.value === 4
                              ? "Pay Frequency"
                              : props.selectedCatalog.value === 6
                              ? "States"
                              : props.selectedCatalog.value === 7
                              ? "Cities"
                              : "",
                          ...dep,
                        });
                        setShowEditForm(true);
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <TableCell>
                        {dep.Description || dep.State || dep.City}
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Delete">
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              confirmDelete({
                                id:
                                  dep.Id_Department ||
                                  dep.Id_Employee_type ||
                                  dep.Id_Job ||
                                  dep.Id_PayFrequency ||
                                  dep.Id_State ||
                                  dep.Id_City,
                                description:
                                  props.selectedCatalog.value === 1
                                    ? "Departments"
                                    : props.selectedCatalog.value === 2
                                    ? "Employee Types"
                                    : props.selectedCatalog.value === 3
                                    ? "Job Positions"
                                    : props.selectedCatalog.value === 4
                                    ? "Pay Frequency"
                                    : props.selectedCatalog.value === 6
                                    ? "States"
                                    : props.selectedCatalog.value === 7
                                    ? "Cities"
                                    : "",
                              });
                            }}
                          >
                            <DeleteIcon color="error" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
        {showEditForm && selectedDeduction && (
          <div className="overlay">
            <UpdateTable
              isOpen={handleShowEditForm}
              selectedDeduction={selectedDeduction}
            />
          </div>
        )}
      </Box>
    </div>
  );
};

export default GeneralTable;
