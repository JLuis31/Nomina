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
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import toast from "react-hot-toast";
import UpdateTable from "../Update_Table/UpdateTable";
import { useUsersDetails } from "@/app/Context/UsersDetailsContext";

const GeneralTable = (props) => {
  const { setDefaultConceptsDetails, umaValues } = useUsersDetails();
  const [selectedDeduction, setSelectedDeduction] = useState();
  const [showEditForm, setShowEditForm] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [dense, setDense] = useState(false);
  const [defaultConcepts, setDefaultConcepts] = useState({});
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<string>("Description");
  const [filterText, setFilterText] = useState("");
  const [showFrequencyModal, setShowFrequencyModal] = useState(false);
  const [selectedConceptForFrequency, setSelectedConceptForFrequency] =
    useState<{
      conceptId: string;
      conceptDescription: string;
    } | null>(null);
  const [selectedNewFrequency, setSelectedNewFrequency] = useState("");

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

  useEffect(() => {
    const fetchDefaultConcepts = async () => {
      try {
        const response = await axios.get(
          "/api/CatalogsDetails/DefaultConcepts",
        );
        const data = response.data;
        setDefaultConceptsDetails(data);
      } catch (error) {
        toast.error("Failed to load default concepts");
      }
    };

    fetchDefaultConcepts();
  }, [setDefaultConceptsDetails]);

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
      props.umaValues,
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
        toast.success(response.data.message || "Changes saved successfully");

        const refreshResponse = await axios.get(
          "/api/CatalogsDetails/DefaultConcepts",
        );
        setDefaultConceptsDetails(refreshResponse.data);

        setDefaultConcepts({});
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.error ||
            "Error saving default concepts changes",
          { duration: 2000 },
        );
      }
    }
  };

  useEffect(() => {
    if (Object.keys(defaultConcepts).length === 0) return;

    const hasOnlyFrequencyChanges = Object.values(defaultConcepts).every(
      (c: any) =>
        c.Id_PayFrequency !== undefined &&
        c.Per_Hour === undefined &&
        c.Per_Amount === undefined,
    );

    if (!hasOnlyFrequencyChanges) return;

    const combinedKeys = Object.keys(defaultConcepts).join(", ");
    const values = Object.values(defaultConcepts);
    const dataToSend = { values, combinedKeys };

    const UpdatePayFrequencyDefaults = async () => {
      try {
        const response = await axios.put(
          `/api/CatalogsDetails/DefaultConcepts/PaymentFrequency`,
          {
            data: dataToSend,
          },
        );
        if (response.status === 200) {
          toast.success("Pay frequency updated successfully");

          const refreshResponse = await axios.get(
            "/api/CatalogsDetails/DefaultConcepts",
          );
          setDefaultConceptsDetails(refreshResponse.data);

          setDefaultConcepts({});
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(
            error.response?.data?.error || "Error updating pay frequency",
          );
        }
      }
    };

    UpdatePayFrequencyDefaults();
  }, [defaultConcepts, setDefaultConceptsDetails]);

  const handleAddFrequency = (
    conceptId: string,
    conceptDescription: string,
  ) => {
    const usedFrequencies = props.defaultConceptsDetails
      .filter((item: any) => item.Id_Concept === conceptId)
      .map((item: any) => item.Id_PayFrequency);

    const availableFrequencies = props.payFrequencyDetails.filter(
      (freq: any) => !usedFrequencies.includes(freq.Id_PayFrequency),
    );

    if (availableFrequencies.length === 0) {
      toast.error(
        "All payment frequencies are already configured for this concept",
      );
      return;
    }

    setSelectedConceptForFrequency({ conceptId, conceptDescription });
    setShowFrequencyModal(true);
  };

  const handleConfirmAddFrequency = async () => {
    if (!selectedConceptForFrequency || !selectedNewFrequency) {
      toast.error("Please select a payment frequency");
      return;
    }

    try {
      const response = await axios.post(
        "/api/CatalogsDetails/DefaultConcepts",
        {
          Id_Concept: selectedConceptForFrequency.conceptId,
          Id_Concept_Type: props.defaultConceptsDetails.find(
            (item: any) =>
              item.Id_Concept === selectedConceptForFrequency.conceptId,
          )?.Id_Concept_Type,
          Description: selectedConceptForFrequency.conceptDescription,
          Id_PayFrequency: selectedNewFrequency,
          Per_Hour: 0,
          Per_Amount: 0,
        },
      );

      if (response.status === 201 || response.status === 200) {
        const frequencyName = props.payFrequencyDetails.find(
          (f: any) => f.Id_PayFrequency === Number(selectedNewFrequency),
        )?.Description;

        toast.success(
          `New ${frequencyName} configuration added to ${selectedConceptForFrequency.conceptDescription}`,
        );

        const refreshResponse = await axios.get(
          "/api/CatalogsDetails/DefaultConcepts",
        );
        setDefaultConceptsDetails(refreshResponse.data);

        setDefaultConcepts({});

        setShowFrequencyModal(false);
        setSelectedConceptForFrequency(null);
        setSelectedNewFrequency("");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error("Error adding new frequency configuration");
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
          {props.onAddItem &&
            props.selectedCatalog.value !== 8 &&
            props.selectedCatalog.value !== 9 && (
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
                    e.currentTarget.style.boxShadow =
                      "0 2px 4px rgba(0,0,0,0.1)";
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
                            : props.selectedCatalog.value === 9
                              ? "UMA Values"
                              : ""}
            </Typography>
            {props.selectedCatalog.value === 8 && (
              <Button
                onClick={handleSaveDefaultConceptsChanges}
                style={{
                  display: Object.values(defaultConcepts).filter(
                    (c: any) =>
                      (c.Per_Hour !== undefined &&
                        c.Per_Hour !== "" &&
                        c.Per_Hour !== null) ||
                      (c.Per_Amount !== undefined &&
                        c.Per_Amount !== "" &&
                        c.Per_Amount !== null),
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
                  {props.selectedCatalog.value !== 9 && (
                    <TableCell
                      align="center"
                      style={{ color: "white" }}
                      className="header"
                    >
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
                                : "Description",
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
                  )}
                  {props.selectedCatalog.value === 8 && (
                    <TableCell
                      align="center"
                      style={{ color: "white" }}
                      className="header"
                    >
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
                    <TableCell
                      align="center"
                      style={{ color: "white" }}
                      className="header"
                    >
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

                  {props.selectedCatalog.value === 9 && (
                    <TableCell
                      style={{ color: "white" }}
                      className="header"
                      align="center"
                    >
                      Year
                    </TableCell>
                  )}

                  {props.selectedCatalog.value === 9 && (
                    <TableCell
                      style={{ color: "white" }}
                      className="header"
                      align="center"
                    >
                      Value
                    </TableCell>
                  )}

                  {props.selectedCatalog.value === 9 && (
                    <TableCell
                      style={{ color: "white" }}
                      className="header"
                      align="center"
                    >
                      Status
                    </TableCell>
                  )}
                  <TableCell
                    style={{ color: "white", minWidth: "120px" }}
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
                      No data available
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
                        dep.Id_City ||
                        dep.Id_UMA
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
                                          : props.selectedCatalog.value === 9
                                            ? "UMA Values"
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
                        <TableCell align="center">{dep.Id_Concept}</TableCell>
                      )}
                      <TableCell align="center">
                        {dep.Description ||
                          dep.State ||
                          dep.City ||
                          dep.UMA_Year}
                      </TableCell>
                      {props.selectedCatalog.value === 8 && (
                        <TableCell align="center">
                          {dep.Id_Concept_Type === "I" ? "Income" : "Deduction"}
                        </TableCell>
                      )}
                      {props.selectedCatalog.value === 8 && (
                        <TableCell align="center">
                          <Tooltip
                            title={
                              Object.values(defaultConcepts).some(
                                (c: any) =>
                                  c.Per_Hour !== undefined ||
                                  c.Per_Amount !== undefined,
                              )
                                ? "Please save pending input changes before modifying frequency"
                                : ""
                            }
                          >
                            <Select
                              value={
                                defaultConcepts[
                                  `${dep.Id_Concept}-${dep.Id_PayFrequency}`
                                ]?.Id_PayFrequency || dep.Id_PayFrequency
                              }
                              disabled={Object.values(defaultConcepts).some(
                                (c: any) =>
                                  c.Per_Hour !== undefined ||
                                  c.Per_Amount !== undefined,
                              )}
                              onChange={(e) =>
                                setDefaultConcepts({
                                  ...defaultConcepts,
                                  [`${dep.Id_Concept}-${dep.Id_PayFrequency}`]:
                                    {
                                      ...(defaultConcepts[
                                        `${dep.Id_Concept}-${dep.Id_PayFrequency}`
                                      ] || {}),
                                      Id_PayFrequency: e.target.value,
                                      Id_Default_Concept:
                                        dep.Id_Default_Concept,
                                    },
                                })
                              }
                              size="small"
                              sx={{
                                minWidth: 120,
                                backgroundColor: "#f5f5f5",
                              }}
                            >
                              {props.payFrequencyDetails.map((freq: any) => (
                                <MenuItem
                                  key={freq.Id_PayFrequency}
                                  value={freq.Id_PayFrequency}
                                >
                                  {freq.Description}
                                </MenuItem>
                              ))}
                            </Select>
                          </Tooltip>
                        </TableCell>
                      )}

                      {props.selectedCatalog.value === 8 && (
                        <TableCell align="center">
                          <Input
                            inputProps={{
                              min: 0,
                            }}
                            disabled={(() => {
                              const conceptKey = `${dep.Id_Concept}-${dep.Id_PayFrequency}`;
                              const perAmount =
                                defaultConcepts[conceptKey]?.Per_Amount !==
                                undefined
                                  ? defaultConcepts[conceptKey].Per_Amount
                                  : dep.Per_Amount;
                              return (
                                perAmount !== undefined &&
                                perAmount !== "" &&
                                perAmount !== 0 &&
                                perAmount !== "0"
                              );
                            })()}
                            value={(() => {
                              const concept =
                                defaultConcepts[
                                  `${dep.Id_Concept}-${dep.Id_PayFrequency}`
                                ];
                              if (concept && concept.Per_Hour !== undefined) {
                                return String(concept.Per_Hour);
                              }
                              return String(dep.Per_Hour || "");
                            })()}
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
                              cursor: (() => {
                                const conceptKey = `${dep.Id_Concept}-${dep.Id_PayFrequency}`;
                                const perAmount =
                                  defaultConcepts[conceptKey]?.Per_Amount !==
                                  undefined
                                    ? defaultConcepts[conceptKey].Per_Amount
                                    : dep.Per_Amount;
                                return perAmount !== undefined &&
                                  perAmount !== "" &&
                                  perAmount !== 0 &&
                                  perAmount !== "0"
                                  ? "not-allowed"
                                  : "text";
                              })(),
                            }}
                          />
                        </TableCell>
                      )}

                      {props.selectedCatalog.value === 8 && (
                        <TableCell align="center">
                          <Input
                            inputProps={{
                              min: 0,
                            }}
                            disabled={(() => {
                              const conceptKey = `${dep.Id_Concept}-${dep.Id_PayFrequency}`;
                              const perHour =
                                defaultConcepts[conceptKey]?.Per_Hour !==
                                undefined
                                  ? defaultConcepts[conceptKey].Per_Hour
                                  : dep.Per_Hour;
                              return (
                                perHour !== undefined &&
                                perHour !== "" &&
                                perHour !== 0 &&
                                perHour !== "0"
                              );
                            })()}
                            value={(() => {
                              const concept =
                                defaultConcepts[
                                  `${dep.Id_Concept}-${dep.Id_PayFrequency}`
                                ];
                              if (concept && concept.Per_Amount !== undefined) {
                                return String(concept.Per_Amount);
                              }
                              return String(dep.Per_Amount || "");
                            })()}
                            onChange={(e) => {
                              setDefaultConcepts({
                                ...defaultConcepts,
                                [`${dep.Id_Concept}-${dep.Id_PayFrequency}`]: {
                                  ...(defaultConcepts[
                                    `${dep.Id_Concept}-${dep.Id_PayFrequency}`
                                  ] || {}),
                                  Id_PayFrequency: dep.Id_PayFrequency,
                                  Per_Amount: e.target.value,
                                },
                              });
                            }}
                            type="number"
                            disableUnderline
                            sx={{
                              textAlign: "center",
                              borderRadius: 2,
                              background: "#f5f5f5",
                              fontWeight: "bold",
                              width: 80,
                              cursor: (() => {
                                const conceptKey = `${dep.Id_Concept}-${dep.Id_PayFrequency}`;
                                const perHour =
                                  defaultConcepts[conceptKey]?.Per_Hour !==
                                  undefined
                                    ? defaultConcepts[conceptKey].Per_Hour
                                    : dep.Per_Hour;
                                return perHour !== undefined &&
                                  perHour !== "" &&
                                  perHour !== 0 &&
                                  perHour !== "0"
                                  ? "not-allowed"
                                  : "text";
                              })(),
                            }}
                          />
                        </TableCell>
                      )}

                      {props.selectedCatalog.value === 9 && (
                        <TableCell align="center">{dep.UMA_Values}</TableCell>
                      )}
                      {props.selectedCatalog.value === 9 && (
                        <TableCell align="center">
                          {dep.Is_Active === true ? "Active" : "Inactive"}
                        </TableCell>
                      )}

                      <TableCell align="center">
                        {props.selectedCatalog.value === 8 && (
                          <Tooltip title="Add Frequency">
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddFrequency(
                                  dep.Id_Concept,
                                  dep.Description,
                                );
                              }}
                              size="small"
                              sx={{
                                color: "#345d8a",
                                "&:hover": {
                                  backgroundColor: "rgba(52, 93, 138, 0.1)",
                                },
                              }}
                            >
                              <AddIcon />
                            </IconButton>
                          </Tooltip>
                        )}

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
                                  dep.Id_City ||
                                  dep.Id_UMA,

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
                                              : props.selectedCatalog.value ===
                                                  8
                                                ? "Default Concepts"
                                                : props.selectedCatalog
                                                      .value === 9
                                                  ? "UMA Values"
                                                  : "",
                              });
                            }}
                            size="small"
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

        <Dialog
          open={showFrequencyModal}
          onClose={() => {
            setShowFrequencyModal(false);
            setSelectedConceptForFrequency(null);
            setSelectedNewFrequency("");
          }}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            Select Payment Frequency
            {selectedConceptForFrequency && (
              <Typography variant="body2" color="text.secondary">
                Adding new frequency for:{" "}
                {selectedConceptForFrequency.conceptDescription} (
                {selectedConceptForFrequency.conceptId})
              </Typography>
            )}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Payment Frequency</InputLabel>
                <Select
                  value={selectedNewFrequency}
                  label="Payment Frequency"
                  onChange={(e) => setSelectedNewFrequency(e.target.value)}
                >
                  {selectedConceptForFrequency &&
                    props.payFrequencyDetails
                      .filter(
                        (freq: any) =>
                          !props.defaultConceptsDetails.some(
                            (dc: any) =>
                              dc.Id_Concept ===
                                selectedConceptForFrequency.conceptId &&
                              dc.Id_PayFrequency === freq.Id_PayFrequency,
                          ),
                      )
                      .map((freq: any) => (
                        <MenuItem
                          key={freq.Id_PayFrequency}
                          value={freq.Id_PayFrequency}
                        >
                          {freq.Description}
                        </MenuItem>
                      ))}
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setShowFrequencyModal(false);
                setSelectedConceptForFrequency(null);
                setSelectedNewFrequency("");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmAddFrequency}
              variant="contained"
              color="primary"
              disabled={!selectedNewFrequency}
            >
              Add Frequency
            </Button>
          </DialogActions>
        </Dialog>

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
