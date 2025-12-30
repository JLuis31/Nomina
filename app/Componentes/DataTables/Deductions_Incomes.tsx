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
import "../DataTables/TablesScss.scss";
import UpdateTable from "./UpdateTable";

const DeduccionesTable = (props) => {
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
          ¿Seguro que quieres borrar el concepto?
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
  return (
    <Box sx={{ width: "100%", mt: 3 }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <Typography sx={{ flex: "1 1 100%", p: 2 }} variant="h6">
          Concepts
        </Typography>
        <TableContainer>
          <Table className="table">
            <TableHead>
              <TableRow>
                <TableCell style={{ color: "white" }} className="header">
                  Id Concept
                </TableCell>
                <TableCell style={{ color: "white" }} className="header">
                  Concepts Description
                </TableCell>
                <TableCell
                  style={{ color: "white" }}
                  className="header"
                  align="center"
                >
                  Concept Type
                </TableCell>
                <TableCell
                  style={{ color: "white" }}
                  className="header"
                  align="center"
                >
                  Income Tax
                </TableCell>
                <TableCell
                  style={{ color: "white" }}
                  className="header"
                  align="center"
                >
                  Social Security
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
              {Array.isArray(props.deduccionesDetails) &&
              props.deduccionesDetails.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} align="center">
                    No hay datos por mostrar
                  </TableCell>
                </TableRow>
              ) : (
                props.deduccionesDetails.map((dep: any) => (
                  <TableRow
                    key={dep.Id_Concept}
                    onClick={() => {
                      setSelectedDeduction({
                        Id_Concept: dep.Id_Concept,
                        Department: "Deductions",
                        ...dep,
                      });
                      setShowEditForm(true);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <TableCell>{dep.Id_Concept}</TableCell>
                    <TableCell>{dep.Description}</TableCell>
                    <TableCell align="center">
                      {dep.Id_Concept_Type === "I" ? "Income" : "Deduction"}
                    </TableCell>
                    <TableCell align="center">
                      {dep.Income_Tax === false ? "No" : "Yes"}
                    </TableCell>
                    <TableCell align="center">
                      {dep.Social_Sec === false ? "No" : "Yes"}
                    </TableCell>

                    <TableCell align="center">
                      <Tooltip title="Delete">
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            confirmDelete({
                              id: dep.Id_Concept,
                              description: "Deductions",
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
  );
};

export default DeduccionesTable;
