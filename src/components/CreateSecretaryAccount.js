import React, { useEffect, useState } from "react";
import "../css/CreateSecretaryAccount.css";
import {
  Button,
  FormControl,
  Grid,
  Input,
  InputLabel,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import Select from "react-select";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
// axios
import axios from "../axios";
// sweet alert
import swal from "sweetalert";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

function CreateSecretaryAccount() {
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const [accounts, setAccounts] = useState([]);
  const [secAccounts, setSecAccounts] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pattern, setPattern] = useState(
    new RegExp(
      /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
    )
  );
  const [changeToAdmin, setChangeToAdmin] = useState("");
  //data of user to become admin
  const [dataEmail, setDataEmail] = useState("");
  const [dataFirstName, setDataFirstName] = useState("");
  const [dataLastName, setDataLastName] = useState("");
  const [dataPassword, setDataPassword] = useState("");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };
  // useEffects
  useEffect(() => {
    // get all users
    axios
      .get("/auth/users/", {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setAccounts(res.data);
      });
    //get all secretary accounts
    axios
      .get("/auth/user-email-and-password", {
        Headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setSecAccounts(res.data);
      });
  }, []);

  // filter accounts
  const filterAccounts = () => {
    return accounts.filter((account) => {
      return account.is_secretary === true;
    });
  };
  //filter secretary accounts
  const filterAccounts2 = () => {
    return secAccounts.filter((account) => {
      return account.is_secretary === true;
    });
  };
  console.log("sec accounts: ", secAccounts);
  //sign up
  const handleSignup = (e) => {
    e.preventDefault();

    if (password.length < 8 || confirmPassword < 8) {
      swal("Error", "Password must atleast 8 characters");
    } else if (
      firstName === "" ||
      middleName === "" ||
      lastName === "" ||
      email === "" ||
      password === "" ||
      confirmPassword === ""
    ) {
      swal("Error", "Fill all the fields");
    } else if (password !== confirmPassword) {
      swal("Error", "Password Does Not Match");
    } else if (!pattern.test(email)) {
      swal("Error", "Invalid Email");
    } else {
      axios
        .post("/auth/register", {
          first_name: firstName,
          last_name: lastName,
          middle_name: middleName,
          email: email,
          password: password,
          re_password: confirmPassword,
          is_secretary: true,
        })
        .then((res) => {
          axios
            .post(
              `/auth/user-email-and-password/`,
              { email: email, password: password, is_secretary: true },
              {
                Headers: {
                  Authorization: `Token ${localStorage.getItem("token")}`,
                },
              }
            )
            .then((res) => {
              console.log("Adding to UserAccountEmailAndPassword Success");
            })
            .catch((error) =>
              console.log("error in adding to useraccount email and password")
            );
          swal("Success", ` Sign Up Successfull`, "success").then(
            setTimeout(() => {
              window.location.reload(false);
            }, 600)
          );
        })
        .catch((err) => {
          console.log(err);
          swal("Error", "Email Already Exist");
        });
    }
  };
  const deleteSecretary = (id) => {
    axios
      .delete(`/auth/users/${id}/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        swal("Success", ` Deleted `, "success").then(
          setTimeout(() => {
            window.location.reload(false);
          }, 1000)
        );
      });
  };

  const handleDeleteDetails = (id) => {
    axios
      .delete(`/auth/user-email-and-password/${id}/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        swal("Success", ` Deleted `, "success").then(
          setTimeout(() => {
            window.location.reload(false);
          }, 1000)
        );
      });
  };

  let secretaryAccountsOptions = filterAccounts()?.map((acc) => ({
    value: acc.id,
    label: acc.email,
  }));

  const setToAdmin = (id) => {
    if (id) {
      axios
        .get(`/auth/users/${id}/`, {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          setDataEmail(res.data.email);
          setDataFirstName(res.data.first_name);
          setDataLastName(res.data.last_name);
          setDataPassword(res.data.password);
          axios
            .put(
              `/auth/users/${id}/`,
              {
                is_secretary: false,
                is_superuser: true,
                email: dataEmail,
                first_name: dataFirstName,
                last_name: dataLastName,
                password: dataPassword,
              },
              {
                headers: {
                  Authorization: `Token ${localStorage.getItem("token")}`,
                },
              }
            )
            .then((res) => {
              swal("Success", `Change to Admin Successful`, "success").then(
                setTimeout(() => {
                  window.location.reload(false);
                }, 1300)
              );
            })
            .catch((error) => {
              console.log("error in set it to admin: ", error);
            });
        });
    }
  };
  return (
    <>
      <Grid container spacing={4}>
        <Grid item md={6} xs={12} lg={6} sm={12}>
          <h1>Create Account for Secretary</h1>
          <FormControl className="createSecretaryAccount__info">
            <TextField
              id="outlined-basic"
              variant="outlined"
              label="First Name"
              type="text"
              onChange={(e) => setFirstName(e.target.value)}
              value={firstName}
              required
            />
          </FormControl>
          <FormControl className="createSecretaryAccount__info">
            <TextField
              id="outlined-basic"
              variant="outlined"
              label="Middle Name"
              type="text"
              onChange={(e) => setMiddleName(e.target.value)}
              value={middleName}
              required
            />
          </FormControl>
          <FormControl className="createSecretaryAccount__info">
            <TextField
              id="outlined-basic"
              variant="outlined"
              label="Last Name"
              type="text"
              onChange={(e) => setLastName(e.target.value)}
              value={lastName}
              required
            />
          </FormControl>
          <FormControl className="createSecretaryAccount__info">
            <TextField
              id="outlined-basic"
              variant="outlined"
              label="Email Address"
              type="text"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
          </FormControl>
          <FormControl className="createSecretaryAccount__info">
            <TextField
              id="outlined-basic"
              variant="outlined"
              label="Password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
          </FormControl>
          <FormControl className="createSecretaryAccount__info">
            <TextField
              id="outlined-basic"
              variant="outlined"
              label="Confirm Password"
              type="password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
              required
            />
          </FormControl>
          <Button
            onClick={handleSignup}
            variant="contained"
            className="createSecretaryAccount__createButton"
          >
            Create
          </Button>
        </Grid>
        {/* Tabs */}
        <Grid item md={6} xs={12} lg={6} sm={12}>
          <FormControl className="createSecretaryAccount__info">
            <Select
              label="Select Patients"
              options={secretaryAccountsOptions}
              onChange={(e) => setChangeToAdmin(e.value)}
            />
          </FormControl>
          <Button
            onClick={() => setToAdmin(changeToAdmin)}
            color="success"
            variant="contained"
            className="createSecretaryAccount__setAdminButton"
          >
            Set to Admin
          </Button>{" "}
          <Box sx={{ bgcolor: "background.paper", width: 500 }} className="box">
            <AppBar position="static">
              <Tabs
                className="createSecretaryAccount__table"
                value={value}
                onChange={handleChange}
                indicatorColor="secondary"
                textColor="inherit"
                variant="fullWidth"
                aria-label="full width tabs example"
              >
                <Tab label="Accounts" {...a11yProps(0)} />
                <Tab label="Details" {...a11yProps(1)} />
              </Tabs>
            </AppBar>
            <SwipeableViews
              axis={theme.direction === "rtl" ? "x-reverse" : "x"}
              index={value}
              onChangeIndex={handleChangeIndex}
            >
              <TabPanel value={value} index={0} dir={theme.direction}>
                <TableContainer component={Paper}>
                  <Table
                    className="createSecretaryAccount__table"
                    sx={{ minWidth: "100%" }}
                  >
                    <TableHead className="viewPatient__tableHead">
                      <TableRow>
                        <TableCell className="viewPatient__tableCell">
                          Name
                        </TableCell>
                        <TableCell
                          align="center"
                          className="viewPatient__tableCell"
                        >
                          Email
                        </TableCell>

                        <TableCell
                          align="center"
                          className="viewPatient__tableCell"
                        >
                          Action
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filterAccounts().map((val) => (
                        <>
                          <TableRow
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell align="center">
                              {val.first_name} {val.last_name}
                            </TableCell>
                            <TableCell align="center">{val.email}</TableCell>

                            <TableCell align="center">
                              <Button
                                variant="contained"
                                color="warning"
                                className="createSecretaryAccount__button"
                                onClick={() => deleteSecretary(val.id)}
                              >
                                Delete
                              </Button>
                            </TableCell>
                          </TableRow>
                        </>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </TabPanel>
              <TabPanel value={value} index={1} dir={theme.direction}>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: "100%" }}>
                    <TableHead className="viewPatient__tableHead">
                      <TableRow>
                        <TableCell className="viewPatient__tableCell">
                          Email
                        </TableCell>
                        <TableCell
                          align="center"
                          className="viewPatient__tableCell"
                        >
                          Password
                        </TableCell>

                        <TableCell
                          align="center"
                          className="viewPatient__tableCell"
                        >
                          Action
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filterAccounts2().map((val) => (
                        <>
                          <TableRow
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                            key={val.id}
                          >
                            <TableCell align="center">{val.email}</TableCell>
                            <TableCell align="center">{val.password}</TableCell>

                            <TableCell align="center">
                              <Button
                                variant="contained"
                                color="warning"
                                className="createSecretaryAccount__button"
                                onClick={() => handleDeleteDetails(val.id)}
                              >
                                Delete
                              </Button>
                            </TableCell>
                          </TableRow>
                        </>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </TabPanel>
            </SwipeableViews>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}

export default CreateSecretaryAccount;
