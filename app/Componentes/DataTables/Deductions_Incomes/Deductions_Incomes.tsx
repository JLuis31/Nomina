"use client";
import { useState, useEffect, useMemo } from "react";
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
  TablePagination,
  FormControlLabel,
  Switch,
  TableSortLabel,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import toast from "react-hot-toast";
import "../Update_Table/UpdateTable.scss";
import UpdateTable from "../Update_Table/UpdateTable";
import { useUsersDetails } from "@/app/Context/UsersDetailsContext";

const DeduccionesTable = (props) => {
  const { defaultConceptsDetails } = useUsersDetails();

  const [selectedDeduction, setSelectedDeduction] = useState();
  const [showEditForm, setShowEditForm] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [dense, setDense] = useState(false);
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<string>("Id_Concept");
  const [filterText, setFilterText] = useState("");

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
          ¿You sure you want to delete this concept?
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
      { duration: Infinity },
    );
  };

  const handleShowEditForm = () => {
    setShowEditForm(!showEditForm);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) return -1;
    if (b[orderBy] > a[orderBy]) return 1;
    return 0;
  }

  function getComparator<Key extends keyof any>(
    order: "asc" | "desc",
    orderBy: Key,
  ) {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  const filteredData = Array.isArray(props.deduccionesDetails)
    ? props.deduccionesDetails.filter((item: any) => {
        const searchText = filterText.toLowerCase();
        const description = (item.Description || "").toLowerCase();
        const idConcept = (item.Id_Concept || "").toString().toLowerCase();
        const conceptType =
          item.Id_Concept_Type === "I"
            ? "income"
            : item.Id_Concept_Type === "D"
              ? "deduction"
              : "";
        const incomeTax = item.Income_Tax === false ? "no" : "yes";
        const socialSec = item.Social_Sec === false ? "no" : "yes";

        return (
          description.includes(searchText) ||
          idConcept.includes(searchText) ||
          conceptType.includes(searchText) ||
          incomeTax.includes(searchText) ||
          socialSec.includes(searchText)
        );
      })
    : [];

  const paginatedData = useMemo(() => {
    if (!Array.isArray(filteredData)) return [];
    return [...filteredData]
      .sort(getComparator(order, orderBy))
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filteredData, order, orderBy, page, rowsPerPage]);

  return (
    <Box sx={{ width: "100%", mt: 3 }}>
      <div className="buscador">
        <div className="filtro">
          <label className="labelfiltrarpor" htmlFor="">
            Filter by
          </label>
          <input
            type="text"
            placeholder="Filter by concept, type or description..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>
        {props.onAddItem && (
          <div className="botonesfiltro">
            <button
              onClick={props.onAddItem}
              className="addPayrollPeriods"
              style={{
                backgroundColor: "#345d8a",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "500",
                fontSize: "14px",
                transition: "all 0.3s ease",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#2a4a6e";
                e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "#345d8a";
                e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Add new item
            </button>
          </div>
        )}
      </div>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <Typography sx={{ flex: "1 1 100%", p: 2 }} variant="h6">
          Concepts
        </Typography>
        <TableContainer>
          <Table className="table" size={dense ? "small" : "medium"}>
            <TableHead>
              <TableRow>
                <TableCell
                  align="center"
                  style={{ color: "white" }}
                  className="header"
                >
                  <TableSortLabel
                    active={orderBy === "Id_Concept"}
                    direction={orderBy === "Id_Concept" ? order : "asc"}
                    onClick={() => handleRequestSort("Id_Concept")}
                    sx={{
                      color: "white",
                      "&:hover": { color: "white" },
                      "&.Mui-active": { color: "white" },
                      "& .MuiTableSortLabel-icon": {
                        color: "white !important",
                      },
                    }}
                  >
                    Id Concept
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  align="center"
                  style={{ color: "white" }}
                  className="header"
                >
                  <TableSortLabel
                    active={orderBy === "Description"}
                    direction={orderBy === "Description" ? order : "asc"}
                    onClick={() => handleRequestSort("Description")}
                    sx={{
                      color: "white",
                      "&:hover": { color: "white" },
                      "&.Mui-active": { color: "white" },
                      "& .MuiTableSortLabel-icon": {
                        color: "white !important",
                      },
                    }}
                  >
                    Concepts Description
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  style={{ color: "white" }}
                  className="header"
                  align="center"
                >
                  <TableSortLabel
                    active={orderBy === "Id_Concept_Type"}
                    direction={orderBy === "Id_Concept_Type" ? order : "asc"}
                    onClick={() => handleRequestSort("Id_Concept_Type")}
                    sx={{
                      color: "white",
                      "&:hover": { color: "white" },
                      "&.Mui-active": { color: "white" },
                      "& .MuiTableSortLabel-icon": {
                        color: "white !important",
                      },
                    }}
                  >
                    Concept Type
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  style={{ color: "white" }}
                  className="header"
                  align="center"
                >
                  <TableSortLabel
                    active={orderBy === "Income_Tax"}
                    direction={orderBy === "Income_Tax" ? order : "asc"}
                    onClick={() => handleRequestSort("Income_Tax")}
                    sx={{
                      color: "white",
                      "&:hover": { color: "white" },
                      "&.Mui-active": { color: "white" },
                      "& .MuiTableSortLabel-icon": {
                        color: "white !important",
                      },
                    }}
                  >
                    Income Tax
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  style={{ color: "white" }}
                  className="header"
                  align="center"
                >
                  <TableSortLabel
                    active={orderBy === "Social_Sec"}
                    direction={orderBy === "Social_Sec" ? order : "asc"}
                    onClick={() => handleRequestSort("Social_Sec")}
                    sx={{
                      color: "white",
                      "&:hover": { color: "white" },
                      "&.Mui-active": { color: "white" },
                      "& .MuiTableSortLabel-icon": {
                        color: "white !important",
                      },
                    }}
                  >
                    Social Security
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  style={{ color: "white" }}
                  className="header"
                  align="center"
                >
                  Is Default Concept
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
              {Array.isArray(filteredData) && filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No data available
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData
                  .filter((dep) => dep && dep.Id_Concept !== undefined)
                  .map((dep: any) => (
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
                      <TableCell align="center">{dep.Id_Concept}</TableCell>
                      <TableCell align="center">{dep.Description}</TableCell>
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
                        {" "}
                        {defaultConceptsDetails.some(
                          (dc) => dc.Id_Concept === dep.Id_Concept,
                        )
                          ? "Yes"
                          : "No"}
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

        {Array.isArray(filteredData) && filteredData.length > 0 && (
          <TablePagination
            id="deductions-table-pagination"
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </Paper>

      <FormControlLabel
        control={
          <Switch
            checked={dense}
            onChange={(e) => setDense(e.target.checked)}
          />
        }
        label="Compact view"
      />
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
