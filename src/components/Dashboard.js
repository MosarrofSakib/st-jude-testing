import * as React from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import "../css/Dashboard.css";
// material UI
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
import HealingIcon from "@mui/icons-material/Healing";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PrintIcon from "@mui/icons-material/Print";
import AddIcon from "@mui/icons-material/Add";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { ListItemButton } from "@mui/material";
import { ContentPasteOffSharp } from "@mui/icons-material";

//components
import Patients from "./Patients";
import Treatments from "./Treatments";
import Appointments from "./Appointments";
import ProcessPayments from "./ProcessPayments";
import Sales from "./Sales";
import GenerateLetter from "./GenerateLetter";
import CreateSecretaryAccount from "./CreateSecretaryAccount";
import ViewPatient from "./ViewPatient";

// redux
import { useSelector, useDispatch } from "react-redux";
import { selectUser, setUserLogoutState } from "../features/userSlice";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),

    height: "100vh",
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

const Dashboard = (props) => {
  let Navigate = useNavigate();
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    localStorage.setItem("token", "");
    dispatch(
      setUserLogoutState({
        token: null,
        user: null,
      })
    );
    Navigate("/login");
    window.location.reload(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open} className="dashboard__appBar">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon className="dashboard__menuIcon" />
          </IconButton>

          <Typography
            className="dashboard__appbarText"
            variant="h6"
            noWrap
            component="div"
          >
            <Link to="/" className="dashboard__link">
              St Jude Dental Clinic Management System
            </Link>
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader className="dashboard__drawerHeader">
          <div className="dashboard__info">
            <p>{user?.email}</p> <br />
            <small>{user?.is_superuser ? "Admin" : "Secretary"}</small>
          </div>

          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon className="dashboard__icons" />
            ) : (
              <ChevronRightIcon className="dashboard__icons" />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider className="dashboard__divider" />
        <List className="dashboard__list">
          <Link to="/patients" className="dashboard__links">
            <ListItem disablePadding className="dashboard__listItem">
              <ListItemButton>
                <ListItemIcon>
                  <PeopleIcon className="dashboard__icons" />
                </ListItemIcon>
                <ListItemText primary="Patients" onClick={handleDrawerClose} />
              </ListItemButton>
            </ListItem>
          </Link>
          <Link to="/appointments" className="dashboard__links">
            <ListItem disablePadding className="dashboard__listItem">
              <ListItemButton>
                <ListItemIcon>
                  <AssignmentIcon className="dashboard__icons" />
                </ListItemIcon>
                <ListItemText
                  primary="Appointments"
                  onClick={handleDrawerClose}
                />
              </ListItemButton>
            </ListItem>
          </Link>
          <Link to="/treatments" className="dashboard__links">
            <ListItem disablePadding className="dashboard__listItem">
              <ListItemButton>
                <ListItemIcon>
                  <HealingIcon className="dashboard__icons" />
                </ListItemIcon>
                <ListItemText
                  primary="Treatments"
                  onClick={handleDrawerClose}
                />
              </ListItemButton>
            </ListItem>
          </Link>
          <Link to="/process-payments" className="dashboard__links">
            <ListItem disablePadding className="dashboard__listItem">
              <ListItemButton>
                <ListItemIcon>
                  <CreditCardIcon className="dashboard__icons" />
                </ListItemIcon>
                <ListItemText
                  primary="Process Payments"
                  onClick={handleDrawerClose}
                />
              </ListItemButton>
            </ListItem>
          </Link>
          {user?.is_superuser ? (
            <Link to="/sales" className="dashboard__links">
              <ListItem disablePadding className="dashboard__listItem">
                <ListItemButton>
                  <ListItemIcon>
                    <AttachMoneyIcon className="dashboard__icons" />
                  </ListItemIcon>
                  <ListItemText primary="Sales" onClick={handleDrawerClose} />
                </ListItemButton>
              </ListItem>
            </Link>
          ) : (
            ""
          )}

          <Link to="/generate-letter" className="dashboard__links">
            <ListItem disablePadding className="dashboard__listItem">
              <ListItemButton>
                <ListItemIcon>
                  <PrintIcon className="dashboard__icons" />
                </ListItemIcon>
                <ListItemText
                  primary="Generate Letter"
                  onClick={handleDrawerClose}
                />
              </ListItemButton>
            </ListItem>
          </Link>
          {user?.is_superuser ? (
            <Link to="/create-secretary-account" className="dashboard__links">
              <ListItem disablePadding className="dashboard__listItem">
                <ListItemButton>
                  <ListItemIcon>
                    <AddIcon className="dashboard__icons" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Create Secretary Account"
                    onClick={handleDrawerClose}
                  />
                </ListItemButton>
              </ListItem>
            </Link>
          ) : (
            ""
          )}

          <ListItem disablePadding className="dashboard__logoutButton">
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon>
                <ExitToAppIcon className="dashboard__icons" />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <Routes>
          <Route path="/" element={<Patients />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/treatments" element={<Treatments />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/process-payments" element={<ProcessPayments />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/generate-letter" element={<GenerateLetter />} />
          <Route
            path="/create-secretary-account"
            element={<CreateSecretaryAccount />}
          />
          <Route path="/view-patient/:patientId" element={<ViewPatient />} />
        </Routes>
      </Main>
    </Box>
  );
};

export default Dashboard;
