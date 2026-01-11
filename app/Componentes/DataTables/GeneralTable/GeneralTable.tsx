"use client";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
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
  Input,
  Toolbar,
  Button,
  TableSortLabel,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import toast from "react-hot-toast";
import UpdateTable from "../UpdateTable";
import { useUsersDetails } from "@/app/Context/UsersDetailsContext";

const GeneralTable = (props) => {
  const { setDefaultConceptsDetails } = useUsersDetails();
  const [selectedDeduction, setSelectedDeduction] = useState();
  const [showEditForm, setShowEditForm] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [dense, setDense] = useState(false);
  const [defaultConcepts, setDefaultConcepts] = useState({});
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<string>("Description");
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
          ¿You sure you want to delete this department?
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
    orderBy: Key
  ) {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  useEffect(() => {
    const fetchDefaultConcepts = async () => {
      try {
        const response = await axios.get(
          "/api/CatalogsDetails/DefaultConcepts"
        );
        const data = response.data;
        setDefaultConceptsDetails(data);
      } catch (error) {
        toast.error("Failed to load default concepts");
      }
    };

    fetchDefaultConcepts();
  }, [setDefaultConceptsDetails, defaultConcepts]);

  const dataToRender =
    [
      props.departmentDetails,
      props.employeeTypesDetails,
      props.jobPositionsDetails,
      props.payFrequencyDetails,
      [],
      props.statesDetails,
      props.cityDetails,
      props.defaultConceptsDetails,
    ][props.selectedCatalog.value - 1] || [];

  const filteredData = Array.isArray(dataToRender)
    ? dataToRender.filter((item: any) => {
        const searchText = filterText.toLowerCase();
        const description = (
          item.Description ||
          item.State ||
          item.City ||
          ""
        ).toLowerCase();
        const idConcept = (item.Id_Concept || "").toString().toLowerCase();
        const conceptType =
          item.Id_Concept_Type === "I"
            ? "income"
            : item.Id_Concept_Type === "D"
            ? "deduction"
            : "";

        return (
          description.includes(searchText) ||
          idConcept.includes(searchText) ||
          conceptType.includes(searchText)
        );
      })
    : [];

  const paginatedData = useMemo(() => {
    if (!Array.isArray(filteredData)) return [];
    return [...filteredData]
      .sort(getComparator(order, orderBy))
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filteredData, order, orderBy, page, rowsPerPage]);

  const handleSaveDefaultConceptsChanges = async () => {
    try {
      const response = await axios.put(`/api/CatalogsDetails/DefaultConcepts`, {
        defaultConcepts: defaultConcepts,
      });

      if (response.status === 200) {
        toast.success("Default concepts changes saved successfully");

        setDefaultConcepts({});
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error("Error saving default concepts changes");
      }
    }
  };

  return (
    <div>
      <Box sx={{ width: "100%", mt: 3 }}>
        <div className="buscador">
          <div className="filtro">
            <label className="labelfiltrarpor" htmlFor="">
              Filter by
            </label>
            <input
              type="text"
              placeholder="Filter by description..."
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
                Add new item
              </button>
            </div>
          )}
        </div>
        <Paper sx={{ width: "100%", mb: 2 }}>
          <Toolbar>
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
                : props.selectedCatalog.value === 8
                ? "Default Concepts"
                : ""}
            </Typography>
            {props.selectedCatalog.value === 8 && (
              <Button
                onClick={handleSaveDefaultConceptsChanges}
                style={{
                  display: Object.values(defaultConcepts).filter(
                    (c) => c.Per_Hour !== "" || c.Per_Amount !== ""
                  ).length
                    ? ""
                    : "none",
                }}
                variant="contained"
                color="primary"
              >
                <span style={{ whiteSpace: "nowrap" }}>Save Changes</span>
              </Button>
            )}
          </Toolbar>
          <TableContainer>
            <Table className="table" size={dense ? "small" : "medium"}>
              <TableHead>
                <TableRow>
                  {props.selectedCatalog.value === 8 && (
                    <TableCell style={{ color: "white" }} className="header">
                      <TableSortLabel
                        active={orderBy === "Id_Concept"}
                        direction={orderBy === "Id_Concept" ? order : "asc"}
                        onClick={() => handleRequestSort("Id_Concept")}
                        sx={{
                          color: "white",
                          "&.Mui-active": { color: "white" },
                          "& .MuiTableSortLabel-icon": {
                            color: "white !important",
                          },
                        }}
                      >
                        Id Concept
                      </TableSortLabel>
                    </TableCell>
                  )}
                  <TableCell style={{ color: "white" }} className="header">
                    <TableSortLabel
                      active={
                        orderBy === "Description" ||
                        orderBy === "State" ||
                        orderBy === "City"
                      }
                      direction={
                        orderBy === "Description" ||
                        orderBy === "State" ||
                        orderBy === "City"
                          ? order
                          : "asc"
                      }
                      onClick={() =>
                        handleRequestSort(
                          props.selectedCatalog.value === 6
                            ? "State"
                            : props.selectedCatalog.value === 7
                            ? "City"
                            : "Description"
                        )
                      }
                      sx={{
                        color: "white",
                        "&.Mui-active": { color: "white" },
                        "& .MuiTableSortLabel-icon": {
                          color: "white !important",
                        },
                      }}
                    >
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
                        : props.selectedCatalog.value === 8
                        ? "Concept Description"
                        : ""}
                    </TableSortLabel>
                  </TableCell>
                  {props.selectedCatalog.value === 8 && (
                    <TableCell style={{ color: "white" }} className="header">
                      <TableSortLabel
                        active={orderBy === "Id_Concept_Type"}
                        direction={
                          orderBy === "Id_Concept_Type" ? order : "asc"
                        }
                        onClick={() => handleRequestSort("Id_Concept_Type")}
                        sx={{
                          color: "white",
                          "&.Mui-active": { color: "white" },
                          "& .MuiTableSortLabel-icon": {
                            color: "white !important",
                          },
                        }}
                      >
                        Concept Type
                      </TableSortLabel>
                    </TableCell>
                  )}
                  {props.selectedCatalog.value === 8 && (
                    <TableCell style={{ color: "white" }} className="header">
                      <TableSortLabel
                        active={orderBy === "Id_PayFrequency"}
                        direction={
                          orderBy === "Id_PayFrequency" ? order : "asc"
                        }
                        onClick={() => handleRequestSort("Id_PayFrequency")}
                        sx={{
                          color: "white",
                          "&.Mui-active": { color: "white" },
                          "& .MuiTableSortLabel-icon": {
                            color: "white !important",
                          },
                        }}
                      >
                        Payment Frequency
                      </TableSortLabel>
                    </TableCell>
                  )}

                  {props.selectedCatalog.value === 8 && (
                    <TableCell
                      style={{ color: "white" }}
                      className="header"
                      align="center"
                    >
                      Per Hour
                    </TableCell>
                  )}

                  {props.selectedCatalog.value === 8 && (
                    <TableCell
                      style={{ color: "white" }}
                      className="header"
                      align="center"
                    >
                      Per Amount
                    </TableCell>
                  )}

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
                  paginatedData.map((dep: any) => (
                    <TableRow
                      key={
                        dep.Id_Default_Concept ||
                        dep.Id_Department ||
                        dep.Id_Employee_type ||
                        dep.Id_Job ||
                        dep.Id_PayFrequency ||
                        dep.Id_State ||
                        dep.Id_City
                      }
                      onClick={() => {
                        if (props.selectedCatalog.value !== 8) {
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
                        }
                      }}
                      style={
                        props.selectedCatalog.value === 8
                          ? {}
                          : { cursor: "pointer" }
                      }
                    >
                      {props.selectedCatalog.value === 8 && (
                        <TableCell>{dep.Id_Concept}</TableCell>
                      )}
                      <TableCell>
                        {dep.Description || dep.State || dep.City}
                      </TableCell>
                      {props.selectedCatalog.value === 8 && (
                        <TableCell>
                          {dep.Id_Concept_Type === "I" ? "Income" : "Deduction"}
                        </TableCell>
                      )}
                      {props.selectedCatalog.value === 8 && (
                        <TableCell>
                          {props.payFrequencyDetails.map((freq) =>
                            freq.Id_PayFrequency === dep.Id_PayFrequency
                              ? freq.Description
                              : ""
                          )}
                        </TableCell>
                      )}

                      {props.selectedCatalog.value === 8 && (
                        <TableCell align="center">
                          <Input
                            disabled={
                              (defaultConcepts[
                                `${dep.Id_Concept}-${dep.Id_PayFrequency}`
                              ]?.Per_Amount !== undefined &&
                                defaultConcepts[
                                  `${dep.Id_Concept}-${dep.Id_PayFrequency}`
                                ]?.Per_Amount !== "" &&
                                defaultConcepts[
                                  `${dep.Id_Concept}-${dep.Id_PayFrequency}`
                                ]?.Per_Amount !== 0 &&
                                defaultConcepts[
                                  `${dep.Id_Concept}-${dep.Id_PayFrequency}`
                                ]?.Per_Amount !== "0") ||
                              (dep.Per_Amount !== undefined &&
                                dep.Per_Amount !== "" &&
                                dep.Per_Amount !== 0 &&
                                dep.Per_Amount !== "0")
                                ? true
                                : false
                            }
                            value={
                              defaultConcepts[
                                `${dep.Id_Concept}-${dep.Id_PayFrequency}`
                              ]
                                ? defaultConcepts[
                                    `${dep.Id_Concept}-${dep.Id_PayFrequency}`
                                  ].Per_Hour
                                : dep.Per_Hour || ""
                            }
                            onChange={(e) =>
                              setDefaultConcepts({
                                ...defaultConcepts,
                                [`${dep.Id_Concept}-${dep.Id_PayFrequency}`]: {
                                  ...(defaultConcepts[
                                    `${dep.Id_Concept}-${dep.Id_PayFrequency}`
                                  ] || {}),
                                  Id_PayFrequency: dep.Id_PayFrequency,
                                  Per_Hour: e.target.value,
                                },
                              })
                            }
                            type="number"
                            disableUnderline
                            sx={{
                              textAlign: "center",
                              borderRadius: 2,
                              background: "#f5f5f5",
                              fontWeight: "bold",
                              width: 80,
                            }}
                          />
                        </TableCell>
                      )}

                      {props.selectedCatalog.value === 8 && (
                        <TableCell align="center">
                          <Input
                            disabled={
                              (defaultConcepts[
                                `${dep.Id_Concept}-${dep.Id_PayFrequency}`
                              ]?.Per_Hour !== undefined &&
                                defaultConcepts[
                                  `${dep.Id_Concept}-${dep.Id_PayFrequency}`
                                ]?.Per_Hour !== "" &&
                                defaultConcepts[
                                  `${dep.Id_Concept}-${dep.Id_PayFrequency}`
                                ]?.Per_Hour !== 0 &&
                                defaultConcepts[
                                  `${dep.Id_Concept}-${dep.Id_PayFrequency}`
                                ]?.Per_Hour !== "0") ||
                              (dep.Per_Hour !== undefined &&
                                dep.Per_Hour !== "" &&
                                dep.Per_Hour !== 0 &&
                                dep.Per_Hour !== "0")
                                ? true
                                : false
                            }
                            value={
                              defaultConcepts[
                                `${dep.Id_Concept}-${dep.Id_PayFrequency}`
                              ]
                                ? defaultConcepts[
                                    `${dep.Id_Concept}-${dep.Id_PayFrequency}`
                                  ].Per_Amount
                                : dep.Per_Amount || ""
                            }
                            onChange={(e) =>
                              setDefaultConcepts({
                                ...defaultConcepts,
                                [`${dep.Id_Concept}-${dep.Id_PayFrequency}`]: {
                                  ...(defaultConcepts[
                                    `${dep.Id_Concept}-${dep.Id_PayFrequency}`
                                  ] || {}),
                                  Id_PayFrequency: dep.Id_PayFrequency,
                                  Per_Amount: e.target.value,
                                },
                              })
                            }
                            type="number"
                            disableUnderline
                            sx={{
                              textAlign: "center",
                              borderRadius: 2,
                              background: "#f5f5f5",
                              fontWeight: "bold",
                              width: 80,
                            }}
                          />
                        </TableCell>
                      )}

                      <TableCell align="center">
                        <Tooltip title="Delete">
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              confirmDelete({
                                id:
                                  dep.Id_Default_Concept ||
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
                                    : props.selectedCatalog.value === 8
                                    ? "Default Concepts"
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

          {Array.isArray(filteredData) && filteredData.length > 0 && (
            <TablePagination
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
    </div>
  );
};

export default GeneralTable;
