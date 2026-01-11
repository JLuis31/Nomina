"use client";

import { useRouter } from "next/navigation";
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
import UpdateCalendar from "./UpdateCalendar/UpdateCalendar";
import "./CalendarSettings.scss";
import PayrollAdditions from "./AddCalendar/PayrollAdditions";
import { useUsersDetails } from "@/app/Context/UsersDetailsContext";

const Settings = () => {
  type PayrollRow = {
    Id_Payroll: number;
    Id_PayFrequency: number | string;
    Year: number;
    Month: number;
    Period_Start: string;
    Period_End: string;
    Description: string;
    Status: string;
    Id_Period: number;
  };
  const { payFrequencyDetails } = useUsersDetails();
  const [selected, setSelected] = useState<number[]>([]);
  console.log("Selected Rows:", selected);
  const [rows, setCalendars] = useState<PayrollRow[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<keyof PayrollRow>("Year");
  const months = {
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December",
  };
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showAddPayrollModal, setShowAddPayrollModal] = useState(false);
  const [refreshTable, setRefreshTable] = useState(false);
  const [filterText, setFilterText] = useState("");

  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowUpdateModal(false);
        setShowAddPayrollModal(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const fetchCalendars = async () => {
      try {
        const response = await axios.get("/api/Calendars");
        setCalendars(response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error("Error fetching calendars", { duration: 2000 });
          return;
        }
      }
    };
    fetchCalendars();
  }, [refreshTable]);

  const handleRequestSort = (property: keyof PayrollRow) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  async function handleDelete(
    id_Period: number,
    Id_PayFrequency: number,
    Year: number
  ) {
    try {
      const response = await axios.delete(`/api/Calendars`, {
        params: { id_Period, Id_PayFrequency, Year },
      });
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

  const confirmDelete = (
    id_Period: number,
    Id_PayFrequency: number,
    Year: number
  ) => {
    toast(
      (t) => (
        <span
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          ¿You sure you want to delete this Calendar?
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
              handleDelete(id_Period, Id_PayFrequency, Year);
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

  const filteredRows = rows.filter(
    (row) =>
      String(row.Year).includes(filterText) ||
      months[row.Month]?.toLowerCase().includes(filterText.toLowerCase()) ||
      row.Status.toLowerCase().includes(filterText.toLowerCase())
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

  const OpenModalAddition = (isOpen: boolean) => {
    setShowAddPayrollModal(isOpen);
  };

  return (
    <div>
      <NavDesktop />
      <div className="settings-container">
        {" "}
        <h2>Payroll Calendar Configuration</h2>
        <label htmlFor="">
          Manage years, payroll periods and schedule statuses
        </label>
        <div>
          <hr />
          <div className="buscador">
            <div className="filtro">
              <label className="labelfiltrarpor" htmlFor="">
                Filter by
              </label>
              <input
                type="text"
                placeholder="Filter by year, month or status"
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
                Add Payroll Periods
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
                    Payroll Periods
                  </Typography>
                )}
              </Toolbar>

              <TableContainer>
                <Table size={dense ? "small" : "medium"}>
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox"></TableCell>
                      <TableCell>
                        {" "}
                        <TableSortLabel
                          active={orderBy === "Id_Period"}
                          direction={orderBy === "Id_Period" ? order : "asc"}
                          onClick={() => handleRequestSort("Id_Period")}
                        >
                          {" "}
                          Id Period
                        </TableSortLabel>
                      </TableCell>

                      <TableCell>
                        {" "}
                        <TableSortLabel
                          active={orderBy === "Id_PayFrequency"}
                          direction={
                            orderBy === "Id_PayFrequency" ? order : "asc"
                          }
                          onClick={() => handleRequestSort("Id_PayFrequency")}
                        >
                          Payment Frequency
                        </TableSortLabel>
                      </TableCell>

                      <TableCell>
                        <TableSortLabel
                          active={orderBy === "Year"}
                          direction={orderBy === "Year" ? order : "asc"}
                          onClick={() => handleRequestSort("Year")}
                        >
                          Year
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={orderBy === "Month"}
                          direction={orderBy === "Month" ? order : "asc"}
                          onClick={() => handleRequestSort("Month")}
                        >
                          Month
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={orderBy === "Period_Start"}
                          direction={orderBy === "Period_Start" ? order : "asc"}
                          onClick={() => handleRequestSort("Period_Start")}
                        >
                          Start Date
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        {" "}
                        <TableSortLabel
                          active={orderBy === "Period_Start"}
                          direction={orderBy === "Period_End" ? order : "asc"}
                          onClick={() => handleRequestSort("Period_End")}
                        >
                          End Date
                        </TableSortLabel>
                      </TableCell>

                      <TableCell>Status</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {visibleRows.map((row, idx) => {
                      const isSelected = selected.includes(row.Id_Payroll);
                      return (
                        <TableRow
                          hover
                          key={row.Id_Payroll ?? idx}
                          onClick={() => {
                            if (row.Status === "Closed") return;
                            handleClick(row);
                            OpenModal(true);
                          }}
                          selected={isSelected}
                          className={
                            row.Status === "Closed" ? "row-disabled" : ""
                          }
                          sx={{
                            cursor:
                              row.Status === "Closed"
                                ? "not-allowed"
                                : "pointer",
                          }}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              color="primary"
                              checked={isSelected}
                              disabled={row.Status === "Closed"}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelected(isSelected ? [] : [row.Id_Payroll]);
                              }}
                            />{" "}
                          </TableCell>
                          <TableCell>{row.Id_Period}</TableCell>
                          <TableCell>
                            {payFrequencyDetails.find(
                              (item) =>
                                item.Id_PayFrequency === row.Id_PayFrequency
                            )?.Description || row.Id_PayFrequency}
                          </TableCell>
                          <TableCell>{row.Year}</TableCell>

                          <TableCell>{months[row.Month]}</TableCell>
                          <TableCell>
                            {row.Period_Start
                              ? (() => {
                                  const [y, m, d] =
                                    row.Period_Start.split("T")[0].split("-");
                                  return `${d}/${m}/${y}`;
                                })()
                              : ""}
                          </TableCell>

                          <TableCell>
                            {row.Period_End
                              ? (() => {
                                  const [y, m, d] =
                                    row.Period_End.split("T")[0].split("-");
                                  return `${d}/${m}/${y}`;
                                })()
                              : ""}
                          </TableCell>
                          <TableCell
                            className={
                              row.Status === "Open" ? "open" : "closed"
                            }
                          >
                            {row.Status}
                          </TableCell>

                          <TableCell align="center">
                            <Tooltip title="Delete">
                              <IconButton
                                disabled={row.Status === "Closed"}
                                className={
                                  row.Status === "Closed"
                                    ? "disabled-button"
                                    : ""
                                }
                                onClick={(e) => {
                                  e.stopPropagation();
                                  confirmDelete(
                                    row.Id_Period,
                                    row.Id_PayFrequency,
                                    row.Year
                                  );
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

              {rows.length > 0 && (
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={rows.length}
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
            {showUpdateModal && (
              <div className="overlay">
                <UpdateCalendar
                  modalOpen={OpenModal}
                  dataRow={selected}
                  setRefreshTable={() => setRefreshTable((prev) => !prev)}
                />
              </div>
            )}
            {showAddPayrollModal && (
              <div className="overlay">
                <PayrollAdditions
                  modalOpen={OpenModalAddition}
                  refreshTable={() => setRefreshTable((prev) => !prev)}
                  calendarDetails={rows}
                />
              </div>
            )}
          </Box>
        </div>
      </div>
    </div>
  );
};

export default Settings;
