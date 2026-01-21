"use client";

import "../UserSettings/UserSettings.scss";
import NavDesktop from "../NavDesktop/NavDesktop";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
} from "@mui/material";
import {
  Person,
  Email,
  Business,
  Logout,
  Language,
  Palette,
  AttachMoney,
} from "@mui/icons-material";
import { useUsersDetails } from "@/app/Context/UsersDetailsContext";

const UserSettings = () => {
  const { empleadosDetails, departmentDetails } = useUsersDetails();
  const router = useRouter();
  const session = useSession();
  const userName =
    typeof window !== "undefined" ? localStorage.getItem("userName") : "";
  const userDepartment = empleadosDetails.find(
    (emp) => emp.Id_Employee === session.data?.user?.id
  )?.Id_Department;
  const valorMoneda =
    typeof window !== "undefined" ? localStorage.getItem("valorMoneda") : "USD";

  const handleLogOut = async () => {
    await signOut({ redirect: false });
    router.push("/Login");
    localStorage.clear();
  };

  return (
    <div>
      <NavDesktop />
      <div className="User-Settings-Container">
        <h2 style={{ marginTop: "2rem" }}>User Settings</h2>
        <label htmlFor="">Manage your account and preferences</label>
        <hr />

        <Box
          sx={{
            display: "flex",
            gap: 3,
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          <Card
            sx={{
              flex: "1 1 calc(25% - 18px)",
              minWidth: "250px",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 6,
              },
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Avatar
                  src={session.data?.user?.image || undefined}
                  sx={{
                    width: 70,
                    height: 70,
                    bgcolor: "#1976d2",
                    fontSize: 28,
                    mb: 2,
                  }}
                >
                  {!session.data?.user?.image &&
                    (userName?.charAt(0)?.toUpperCase() || "U")}
                </Avatar>
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  textAlign="center"
                >
                  {userName || "User"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Active Account
                </Typography>
              </Box>

              <Divider sx={{ my: 1.5 }} />

              <List dense sx={{ py: 0 }}>
                <ListItem sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Person sx={{ color: "#1976d2", fontSize: 20 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Username"
                    secondary={userName || "Not set"}
                    primaryTypographyProps={{ fontSize: "0.75rem" }}
                    secondaryTypographyProps={{ fontSize: "0.7rem" }}
                  />
                </ListItem>
                <ListItem sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Email sx={{ color: "#1976d2", fontSize: 20 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Email"
                    secondary={session.data?.user?.email || "Not available"}
                    primaryTypographyProps={{ fontSize: "0.75rem" }}
                    secondaryTypographyProps={{ fontSize: "0.7rem" }}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          <Card
            sx={{
              flex: "1 1 calc(25% - 18px)",
              minWidth: "250px",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 6,
              },
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Palette sx={{ fontSize: 50, color: "#9c27b0", mb: 2 }} />
                <Typography variant="subtitle1" fontWeight="bold">
                  Preferences
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Application settings
                </Typography>
              </Box>

              <Divider sx={{ my: 1.5 }} />

              <List dense sx={{ py: 0 }}>
                <ListItem sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <AttachMoney sx={{ color: "#ed6c02", fontSize: 20 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Currency"
                    secondary={valorMoneda || "USD"}
                    primaryTypographyProps={{ fontSize: "0.75rem" }}
                    secondaryTypographyProps={{ fontSize: "0.7rem" }}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          <Card
            sx={{
              flex: "1 1 calc(25% - 18px)",
              minWidth: "250px",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 6,
              },
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Business sx={{ fontSize: 50, color: "#2e7d32", mb: 2 }} />
                <Typography variant="subtitle1" fontWeight="bold">
                  Session Info
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Current session
                </Typography>
              </Box>

              <Divider sx={{ my: 1.5 }} />

              <List dense sx={{ py: 0 }}>
                <ListItem sx={{ py: 0.5 }}>
                  <ListItemText
                    primary="Session Status"
                    secondary={
                      session.status === "authenticated" ? "Active" : "Inactive"
                    }
                    primaryTypographyProps={{
                      fontSize: "0.75rem",
                      fontWeight: "bold",
                    }}
                    secondaryTypographyProps={{ fontSize: "0.7rem" }}
                  />
                </ListItem>
                <ListItem sx={{ py: 0.5 }}>
                  <ListItemText
                    primary="Last Login"
                    secondary={new Date().toLocaleDateString()}
                    primaryTypographyProps={{
                      fontSize: "0.75rem",
                      fontWeight: "bold",
                    }}
                    secondaryTypographyProps={{ fontSize: "0.7rem" }}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          <Card
            sx={{
              flex: "1 1 calc(25% - 18px)",
              minWidth: "250px",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 6,
              },
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Logout sx={{ fontSize: 50, color: "#d32f2f", mb: 2 }} />
                <Typography variant="subtitle1" fontWeight="bold">
                  Account Actions
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Session management
                </Typography>
              </Box>

              <Divider sx={{ my: 1.5 }} />

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                  mt: 2,
                }}
              >
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  startIcon={<Logout />}
                  onClick={handleLogOut}
                  fullWidth
                  sx={{
                    "&:hover": {
                      bgcolor: "#c62828",
                    },
                  }}
                >
                  Logout
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </div>
    </div>
  );
};

export default UserSettings;
