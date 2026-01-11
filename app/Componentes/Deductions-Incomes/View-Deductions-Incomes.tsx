"use client";

import NavDesktop from "../NavDesktop/NavDesktop";
import {
  alpha,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Typography,
  Paper,
  Checkbox,
  IconButton,
  Tooltip,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { useState, useMemo, useEffect } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-hot-toast";
import axios from "axios";
import "./View-Deductions-Incomes.scss";
import UpdateDeductionIncome from "./Update-Deduction-Income/Upadate-Deduction-Income";
import CapturaDeducciones from "./Add-Deduction-Income/CapturaDeducciones";

const ViewDeductions = () => {
  type AllMovements = {
    Id_Movement: string;
    FullName: string;
    Description: string;
    Id_Concept_Type: string;
    Total_Amount: string;
    Last_Time_Update: string;
    Deduction: string;
  };
  const [selected, setSelected] = useState<number[]>([]);
  const [rows, setAllMovements] = useState<AllMovements[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<keyof AllMovements>("Id_Movement");

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [refreshTable, setRefreshTable] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [showAdditionModal, setShowAdditionModal] = useState(false);

  const OpenModalAddition = (isOpen: boolean) => {
    setShowAdditionModal(isOpen);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowUpdateModal(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const fetchCalendars = async () => {
      try {
        const response = await axios.get(
          "/api/EmployeesMovements/AllMovements"
        );
        setAllMovements(response.data);
        console.log("Fetched Movements:", response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error("Error fetching movements", { duration: 2000 });
          return;
        }
      }
    };
    fetchCalendars();
  }, [refreshTable]);

  const handleRequestSort = (property: keyof AllMovements) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  async function handleDelete(Id_Movement: number) {
    try {
      const response = await axios.delete(
        `/api/EmployeesMovements/AllMovements`,
        {
          params: { Id_Movement },
        }
      );
      if (response.status === 200) {
        toast.success(response.data.message, { duration: 2000 });
        setRefreshTable((prev) => !prev);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error("Error deleting period", { duration: 2000 });
        return;
      }
    }
  }

  const confirmDelete = (Id_Movement: number) => {
    toast(
      (t) => (
        <span
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          ¿You sure you want to delete this movement?
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
              handleDelete(Id_Movement);
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

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) return -1;
    if (b[orderBy] > a[orderBy]) return 1;
    return 0;
  }

  function getComparator<Key extends keyof any>(
    order: "asc" | "desc",
    orderBy: Key
  ) {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  function getConceptTypeName(type: string) {
    if (type === "I") return "Income";
    if (type === "D") return "Deduction";
    return type;
  }

  const filteredRows = rows.filter(
    (row) =>
      String(row.Deduction).includes(filterText) ||
      row.Description.toLowerCase().includes(filterText.toLowerCase()) ||
      row.FullName.toLowerCase().includes(filterText.toLowerCase()) ||
      getConceptTypeName(row.Id_Concept_Type)
        .toLowerCase()
        .includes(filterText.toLowerCase())
  );

  const visibleRows = useMemo(() => {
    return [...filteredRows]
      .sort(getComparator(order, orderBy))
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [order, orderBy, page, rowsPerPage, filteredRows, getComparator]);

  const handleClick = async (id) => {
    setSelected([id]);
  };

  const OpenModal = (isOpen: boolean) => {
    setShowUpdateModal(isOpen);
  };

  return (
    <div>
      <NavDesktop />
      <div className="View-Deductions-Incomes-container">
        {" "}
        <h2>View Deductions or Incomes</h2>
        <label style={{ opacity: ".4" }} htmlFor="">
          All configured deductions or incomes are listed below
        </label>
        <div>
          <hr />
          <div className="buscador">
            <div className="filtro">
              <label
                style={{ marginBottom: ".5rem" }}
                className="labelfiltrarpor"
                htmlFor=""
              >
                Filter by
              </label>
              <input
                type="text"
                placeholder="Filter by description, concept type, or name "
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
              />
            </div>
            <div className="botonesfiltro">
              <button
                onClick={() => OpenModalAddition(true)}
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
                  e.currentTarget.style.boxShadow =
                    "0 4px 8px rgba(0,0,0,0.15)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "#345d8a";
                  e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {" "}
                Add Deduction or Income
              </button>
            </div>
          </div>
          <Box sx={{ width: "100%", mt: 3 }}>
            <Paper sx={{ width: "100%", mb: 2 }}>
              <Toolbar
                style={{ backgroundColor: "#345d8a", color: "white" }}
                sx={{
                  pl: { sm: 2 },
                  pr: { xs: 1, sm: 1 },
                  bgcolor:
                    selected.length > 0
                      ? (theme) => alpha(theme.palette.primary.main, 0.1)
                      : "inherit",
                }}
              >
                {selected.length > 0 ? (
                  <Typography
                    sx={{ flex: "1 1 100%" }}
                    color="inherit"
                    variant="subtitle1"
                  >
                    {selected.length} selected
                  </Typography>
                ) : (
                  <Typography sx={{ flex: "1 1 100%" }} variant="h6">
                    All Deductions or Incomes
                  </Typography>
                )}
              </Toolbar>

              <TableContainer>
                <Table size={dense ? "small" : "medium"}>
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox"></TableCell>
                      <TableCell>Id</TableCell>

                      <TableCell>
                        {" "}
                        <TableSortLabel
                          active={orderBy === "FullName"}
                          direction={orderBy === "FullName" ? order : "asc"}
                          onClick={() => handleRequestSort("FullName")}
                        >
                          {" "}
                          Name
                        </TableSortLabel>
                      </TableCell>

                      <TableCell>
                        {" "}
                        <TableSortLabel
                          active={orderBy === "Description"}
                          direction={orderBy === "Description" ? order : "asc"}
                          onClick={() => handleRequestSort("Description")}
                        >
                          Description
                        </TableSortLabel>
                      </TableCell>

                      <TableCell>
                        <TableSortLabel
                          active={orderBy === "Id_Concept_Type"}
                          direction={
                            orderBy === "Id_Concept_Type" ? order : "asc"
                          }
                          onClick={() => handleRequestSort("Id_Concept_Type")}
                        >
                          Concept Type
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={orderBy === "Total_Amount"}
                          direction={orderBy === "Total_Amount" ? order : "asc"}
                          onClick={() => handleRequestSort("Total_Amount")}
                        >
                          Total Amount
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={orderBy === "Deduction"}
                          direction={orderBy === "Deduction" ? order : "asc"}
                          onClick={() => handleRequestSort("Deduction")}
                        >
                          Balance
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        {" "}
                        <TableSortLabel
                          active={orderBy === "Last_Time_Update"}
                          direction={
                            orderBy === "Last_Time_Update" ? order : "asc"
                          }
                          onClick={() => handleRequestSort("Last_Time_Update")}
                        >
                          Creation Date
                        </TableSortLabel>
                      </TableCell>

                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {visibleRows.map((row, idx) => {
                      const isSelected = selected.includes(
                        Number(row.Id_Movement)
                      );
                      return (
                        <TableRow
                          hover
                          key={row.Id_Movement ?? idx}
                          onClick={() => {
                            handleClick(row);
                            OpenModal(true);
                          }}
                          selected={isSelected}
                          sx={{ cursor: "pointer" }}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              color="primary"
                              checked={isSelected}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelected(
                                  isSelected ? [] : [Number(row.Id_Movement)]
                                );
                              }}
                            />{" "}
                          </TableCell>
                          <TableCell>{row.Id_Movement}</TableCell>

                          <TableCell>{row.FullName}</TableCell>
                          <TableCell>{row.Description}</TableCell>
                          <TableCell>
                            {getConceptTypeName(row.Id_Concept_Type)}
                          </TableCell>

                          <TableCell>{row.Total_Amount}</TableCell>
                          <TableCell>{row.Deduction}</TableCell>

                          <TableCell>
                            {row.Last_Time_Update
                              ? (() => {
                                  const [y, m, d] =
                                    row.Last_Time_Update.split("T")[0].split(
                                      "-"
                                    );
                                  return `${d}/${m}/${y}`;
                                })()
                              : ""}
                          </TableCell>

                          <TableCell align="center">
                            <Tooltip title="Delete">
                              <IconButton
                                onClick={(e) => {
                                  e.stopPropagation();
                                  confirmDelete(Number(row.Id_Movement));
                                }}
                              >
                                <DeleteIcon color="error" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
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
            {showUpdateModal && (
              <div className="overlay">
                <UpdateDeductionIncome
                  modalOpen={OpenModal}
                  dataRow={selected}
                  setRefreshTable={() => setRefreshTable((prev) => !prev)}
                />
              </div>
            )}
          </Box>
          {showAdditionModal && (
            <div className="overlay">
              <CapturaDeducciones
                modalOpen={OpenModalAddition}
                setRefreshTable={() => setRefreshTable((prev) => !prev)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewDeductions;
