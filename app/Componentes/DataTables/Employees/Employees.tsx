import { toast } from "react-hot-toast";
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
  IconButton,
  Tooltip,
  FormControlLabel,
  Switch,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import { useState, useMemo, useEffect } from "react";
import axios from "axios";
import { useUsersDetails } from "@/app/Context/UsersDetailsContext";
interface Employee {
  id: number;
  name: string;
  jobTitle: string;
  status: number;
  salary: number;
}

const EmployeesTable = (props) => {
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof Employee>("name");
  const [selected, setSelected] = useState<number[]>([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setEmployees] = useState<Employee[]>([]);
  const [actualizarTabla, setActualizarTabla] = useState(false);
  const [findEmployee, setFindEmployee] = useState({
    Address: "",
    Email: "",
    First_Surname: "",
    Id_Department: "",
    Id_Employee: "",
    Id_Employee_type: "",
    Id_Job: "",
    Name: "",
    Phone_Nmber: "",
    Salary: "",
    Second_Surname: "",
    Start_Date: "",
    Status: "",
    Id_PayFrequency: "",
    BankAccountNumber: "",
  });
  const { jobPositionsDetails, valorMoneda, valorUSDToMXN } = useUsersDetails();

  useEffect(() => {
    if (props.filtroActivo) {
      const empleadosFiltrados = props.filtro.map((employee) => ({
        id: employee.Id_Employee,
        name: employee.Name,
        jobTitle:
          jobPositionsDetails.find((j) => j.Id_Job === employee.Id_Job)
            ?.Description || "Sin puesto",
        status: Number(employee.Status),
        salary: Number(String(employee.Salary).replace(/[^0-9.]/g, "")),
      }));
      if (JSON.stringify(rows) !== JSON.stringify(empleadosFiltrados)) {
        setEmployees(empleadosFiltrados);
        setPage(0);
      } else {
        toast("No changes in the search results", {
          duration: 2000,
          style: { background: "#f0c544", color: "#222" },
        });
      }
    }
  }, [props.filtroActivo, props.filtro, jobPositionsDetails]);

  useEffect(() => {
    if (jobPositionsDetails.length === 0) return;

    const EmployeesData = async function () {
      try {
        const response = await axios.get("/api/Employees/EmployeesAddition");

        const empleados = response.data.map((employee) => ({
          id: employee.Id_Employee,
          name: employee.Name,
          jobTitle:
            jobPositionsDetails.find((j) => j.Id_Job === employee.Id_Job)
              ?.Description || "Sin puesto",
          status: Number(employee.Status),
          salary: Number(String(employee.Salary).replace(/[^0-9.]/g, "")),
        }));
        setEmployees(empleados);
        setActualizarTabla(false);
        setPage(0);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 404) {
            setEmployees([]);
            setPage(0);
            if (!props.justAddedEmployee) {
              toast("No employees found", { duration: 2000 });
            }
          } else {
            toast.error("Error fetching employees data", { duration: 2000 });
          }
          return;
        }
      }
    };
    EmployeesData();
  }, [props.refreshTable, jobPositionsDetails]);

  type Order = "asc" | "desc";

  function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) return -1;
    if (b[orderBy] > a[orderBy]) return 1;
    return 0;
  }

  function getComparator<Key extends keyof Employee>(
    order: Order,
    orderBy: Key,
  ): (
    a: { [key in Key]: number | string },
    b: { [key in Key]: number | string },
  ) => number {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  const handleRequestSort = (property: keyof Employee) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleClick = async (employee: Employee) => {
    try {
      const response = await axios.get(`/api/Employees/SpecificEmployee`, {
        params: { idEmployee: employee.id },
      });
      setFindEmployee({ ...response.data });
      props.selectedEmployee(response.data);
      props.onActions(true);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error("Error fetching employee details", { duration: 2000 });
        return;
      }
    }

    setSelected([employee.id]);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredRows = rows.filter(
    (row) =>
      row.name.toLowerCase().includes(props.filterText?.toLowerCase() || "") ||
      row.jobTitle
        .toLowerCase()
        .includes(props.filterText?.toLowerCase() || "") ||
      (row.status === 1 ? "active" : "inactive").includes(
        props.filterText?.toLowerCase() || "",
      ),
  );

  const visibleRows = useMemo(() => {
    return [...filteredRows]
      .sort(getComparator(order, orderBy))
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [order, orderBy, page, rowsPerPage, filteredRows]);

  async function handleDelete(id: number) {
    try {
      const response = await axios.delete(`/api/Employees/EmployeesAddition`, {
        params: { idEmployee: id },
      });
      if (response.status === 200) {
        toast.success(
          response.data.message || "Employee deleted successfully",
          { duration: 2000 },
        );
        props.onUpdate();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error || "Error deleting employee", {
          duration: 2000,
        });
        return;
      }
    }
  }

  const confirmDelete = (id: number) => {
    toast(
      (t) => (
        <span
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          ¿You sure you want to delete this employee?
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
              handleDelete(id);
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

  const valorMoedaLocalStorage = localStorage.getItem("valorMoneda");

  return (
    <div>
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
                Employees
              </Typography>
            )}
          </Toolbar>

          <TableContainer>
            <Table size={dense ? "small" : "medium"}>
              <TableHead>
                <TableRow>
                  <TableCell align="center">
                    <TableSortLabel
                      active={orderBy === "name"}
                      direction={orderBy === "name" ? order : "asc"}
                      onClick={() => handleRequestSort("name")}
                    >
                      Employee Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="center">Job Title</TableCell>
                  <TableCell align="center">
                    <TableSortLabel
                      active={orderBy === "name"}
                      direction={orderBy === "name" ? order : "asc"}
                      onClick={() => handleRequestSort("name")}
                    >
                      Salary
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {visibleRows.map((row, idx) => {
                  const isSelected = selected.includes(row.id);
                  return (
                    <TableRow
                      hover
                      key={row.id ?? idx}
                      onClick={() => {
                        handleClick(row);
                      }}
                      selected={isSelected}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell align="center">{row.name}</TableCell>

                      <TableCell align="center">{row.jobTitle}</TableCell>
                      <TableCell align="center">
                        {valorMoedaLocalStorage === "USD"
                          ? new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "USD",
                            }).format(row.salary)
                          : new Intl.NumberFormat("es-MX", {
                              style: "currency",
                              currency: "MXN",
                            }).format(row.salary * valorUSDToMXN)}
                      </TableCell>

                      <TableCell align="center">
                        <span
                          style={{
                            color:
                              row.status === 1
                                ? "green"
                                : row.status === 2
                                  ? "gray"
                                  : row.status === 3
                                    ? "#e95b5bff"
                                    : "#f0c544ff",
                            fontWeight: "bold",
                            backgroundColor:
                              row.status === 1
                                ? "rgba(0, 128, 0, 0.1)"
                                : row.status === 2
                                  ? "rgba(128, 128, 128, 0.1)"
                                  : row.status === 3
                                    ? "rgba(233, 91, 91, 0.1)"
                                    : "rgba(240, 197, 68, 0.1)",
                            padding: "4px 8px",
                            borderRadius: "10px",
                          }}
                        >
                          {row.status === 1 ? "Active" : "Inactive"}
                        </span>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Delete">
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              confirmDelete(row.id);
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
            id="deductions-table-pagination"
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredRows.length}
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
      </Box>
    </div>
  );
};

export default EmployeesTable;
