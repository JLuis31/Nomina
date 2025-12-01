"use client";
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

const CitiesTable = (props) => {
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
          ¿Seguro que quieres borrar la ciudad?
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

  return (
    <Box sx={{ width: "100%", mt: 3 }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <Typography sx={{ flex: "1 1 100%", p: 2 }} variant="h6">
          Cities
        </Typography>
        <TableContainer>
          <Table className="table">
            <TableHead>
              <TableRow>
                <TableCell style={{ color: "white" }} className="header">
                  Cities Description
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
              {Array.isArray(props.cityDetails) &&
              props.cityDetails.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} align="center">
                    No hay datos por mostrar
                  </TableCell>
                </TableRow>
              ) : (
                props.cityDetails.map((dep: any) => (
                  <TableRow key={dep.Id_City}>
                    <TableCell>{dep.City}</TableCell>

                    <TableCell align="center">
                      <Tooltip title="Delete">
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            confirmDelete({
                              id: dep.Id_City,
                              description: "Cities",
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
    </Box>
  );
};

export default CitiesTable;
