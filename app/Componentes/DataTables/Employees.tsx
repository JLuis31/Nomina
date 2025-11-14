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
  Checkbox,
  IconButton,
  Tooltip,
  FormControlLabel,
  Switch,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState, useMemo } from "react";

interface Employee {
  id: number;
  name: string;
  jobTitle: string;
  status: number;
}

const EmployeesTable = (props) => {
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof Employee>("name");
  const [selected, setSelected] = useState<number[]>([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const rows: Employee[] = [
    { id: 1, name: "John Doe", jobTitle: "Software Engineer", status: 1 },
    { id: 2, name: "Jane Smith", jobTitle: "Project Manager", status: 1 },
    { id: 3, name: "Carlos Pérez", jobTitle: "QA Tester", status: 0 },
    { id: 4, name: "Ana López", jobTitle: "UX Designer", status: 1 },
  ];

  // ==================== TABLA ====================
  type Order = "asc" | "desc";

  function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) return -1;
    if (b[orderBy] > a[orderBy]) return 1;
    return 0;
  }

  function getComparator<Key extends keyof Employee>(
    order: Order,
    orderBy: Key
  ): (
    a: { [key in Key]: number | string },
    b: { [key in Key]: number | string }
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

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: number[] = [];

    if (selectedIndex === -1) newSelected = newSelected.concat(selected, id);
    else if (selectedIndex === 0)
      newSelected = newSelected.concat(selected.slice(1));
    else if (selectedIndex === selected.length - 1)
      newSelected = newSelected.concat(selected.slice(0, -1));
    else if (selectedIndex > 0)
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );

    setSelected(newSelected);
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

  const visibleRows = useMemo(
    () =>
      [...rows]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage]
  );

  function handleDelete(id: number) {
    toast.success("Usuario borrado", { duration: 2000 });
    console.log("Deleted user with id:", id);
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
          ¿Seguro que quieres borrar el usuario?
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
      { duration: Infinity }
    );
  };

  return (
    <div>
      <Box sx={{ width: "100%", mt: 3 }}>
        <Paper sx={{ width: "100%", mb: 2 }}>
          <Toolbar
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
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      indeterminate={
                        selected.length > 0 && selected.length < rows.length
                      }
                      checked={
                        rows.length > 0 && selected.length === rows.length
                      }
                      onChange={handleSelectAllClick}
                    />
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "name"}
                      direction={orderBy === "name" ? order : "asc"}
                      onClick={() => handleRequestSort("name")}
                    >
                      Employee Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Job Title</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {visibleRows.map((row) => {
                  const isSelected = selected.includes(row.id);
                  return (
                    <TableRow
                      hover
                      key={row.id}
                      onClick={() => handleClick(row.id)}
                      selected={isSelected}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox color="primary" checked={isSelected} />
                      </TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.jobTitle}</TableCell>
                      <TableCell>
                        <span
                          style={{
                            color: row.status === 1 ? "green" : "gray",
                            fontWeight: "bold",
                            backgroundColor:
                              row.status === 1
                                ? "rgba(0, 128, 0, 0.1)"
                                : "rgba(128, 128, 128, 0.1)",
                            padding: "4px 8px",
                            borderRadius: "10px",
                          }}
                        >
                          {row.status === 1 ? "Active" : "Inactive"}
                        </span>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Edit">
                          <IconButton onClick={() => props.onActions(true)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton onClick={() => confirmDelete(row.id)}>
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
      </Box>
    </div>
  );
};

export default EmployeesTable;
