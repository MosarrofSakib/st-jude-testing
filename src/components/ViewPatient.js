import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
// css
import "../css/ViewPatient.css";
// react router dom
import { useParams } from "react-router-dom";
// axios
import axios from "../axios";
// redux
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
// sweet alert
import swal from "sweetalert";
// material UI
import {
  AppBar,
  Box,
  Button,
  FormControl,
  Grid,
  Tab,
  Tabs,
  Modal,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import SwipeableViews from "react-swipeable-views/lib/SwipeableViews";

import { useTheme } from "@mui/material/styles";
import { ContentPasteOffSharp } from "@mui/icons-material";

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
// style for modal
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

// style for modal breakdown
const style2 = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function ViewPatient() {
  let { patientId } = useParams();
  const todaysDate = new Date();
  const user = useSelector(selectUser);
  // patients info
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [address, setAddress] = useState("");
  const [telephone, setTelephone] = useState("");
  const [age, setAge] = useState("");
  const [occupation, setOccupation] = useState("");
  const [status, setStatus] = useState("");
  const [complaint, setComplaint] = useState("");
  const [transactions, setTransactions] = useState([]);

  const [balance, setBalance] = useState(0);
  const [balanceId, setBalanceId] = useState(null);
  const [checkNumber, setCheckNumber] = useState("");
  const [amount, setAmount] = useState(0);
  const [datePaid, setDatePaid] = useState("");
  const [breakdowns, setBreakdowns] = useState([]);
  const [breakdowns1, setBreakdowns1] = useState(null);
  const [breakdowns2, setBreakdowns2] = useState([]);
  const [filterBreakdowns, setFilterBreakdowns] = useState([]);
  //modal for updating balance
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  //modal to show up breakdown
  const [breakdownOpen, setBreakdownOpen] = useState(false);
  const handleBreakdownOpen = () => setBreakdownOpen(true);
  const handleBreakdownClose = () => setBreakdownOpen(false);

  //modal to show up breakdown 2
  const [breakdown2Open, setBreakdown2Open] = useState(false);
  const handleBreakdown2Open = () => setBreakdown2Open(true);
  const handleBreakdown2Close = () => setBreakdown2Open(false);
  // details
  const [dateAdded, setDateAdded] = useState("");
  const [detailsDescription, setDetailsDescription] = useState("");
  const [detailsCheckNumber, setDetailsCheckNumber] = useState("");
  const [detailsAmount, setDetailsAmount] = useState("");

  const DateToday = () => {
    let d = new Date(todaysDate);
    let month = "" + (d.getMonth() + 1);
    let day = "" + d.getDate();
    let year = d.getFullYear();

    if (month.length < 2) {
      month = "0" + month;
    }
    if (day.length < 2) {
      day = "0" + day;
    }
    return [year, month, day].join("-");
  };
  const [dateToday, setDateToday] = useState(DateToday());
  const [searchDate, setSearchDate] = useState(null);

  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  useEffect(() => {
    axios
      .get(`/api/patients/${patientId}/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setFirstName(res.data.first_name);
        setLastName(res.data.last_name);
        setMiddleName(res.data.middle_name);
        setAddress(res.data.address);
        setTelephone(res.data.telephone);
        setAge(res.data.age);

        setOccupation(res.data.occupation);
        setStatus(res.data.status);
        setComplaint(res.data.complaint);
      });

    axios
      .get("/api/payments", {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setTransactions(res.data);
      });

    axios
      .get("/api/breakdowns", {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setBreakdowns(res.data);
      });
  }, [patientId]);

  const filterTransactions = () => {
    return transactions.filter((val) => {
      return val.patient.first_name === firstName;
    });
  };

  const getUpdateBalance = (id) => {
    if (id) {
      axios
        .get(`/api/payments/${id}/`, {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          console.log("test: ", res.data);
          setBalance(res.data.balance);
          setBalanceId(res.data.id);
          setOpen(true);
        });
    }
  };

  const calculateBalance = (balance, amount) => {
    let balancee = balance;
    let amountt = amount;
    let total = balancee - amountt;
    if (total < 0) {
      return 0;
    }
    return parseInt(balance - amount);
  };

  const handleUpdateBalance = (id) => {
    // console.log("Date Paid: ", datePaid);
    // console.log("Input Check Number: ", checkNumber);
    // console.log("Input Amount: ", amount);
    // console.log("Balance after: ", calculateBalance(balance, amount));
    const form = {
      balance: calculateBalance(balance, amount),
    };
    if (datePaid === "") {
      swal("Error", "Date Required");
    } else if (amount === 0) {
      swal("Error", "Amount Required");
    } else {
      if (id) {
        axios
          .put(`/api/payments/${id}/`, form, {
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
          })
          .then((res) => {
            const form = {
              process_payments: id,
              date_paid: datePaid,
              check_number: checkNumber,
              amount: amount,
              process_by: user.email,
            };

            axios
              .post(`/api/breakdowns/`, form, {
                headers: {
                  Authorization: `Token ${localStorage.getItem("token")}`,
                },
              })
              .then((res) => {
                swal("Success", `Update Balance Successful`, "success").then(
                  setTimeout(() => {
                    window.location.reload(false);
                  }, 1000)
                );
              });
          });
      }
    }
  };

  const handleShowBreakdown1 = (id) => {
    // filteredBreakdowns(id);
    if (id) {
      axios
        .get(`/api/payments/${id}/`, {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          setBreakdowns1(res.data);
          setBreakdownOpen(true);
        });
    }
  };

  const handleShowBreakdown2 = (id) => {
    if (id) {
      let sameProcessId = breakdowns.filter((val) => {
        return val.process_payments.id === id;
      });
      setBreakdowns2(sameProcessId);
      setBreakdown2Open(true);
    }
  };

  return (
    <>
      {/* Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="patients__box">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Process Balance
          </Typography>
          <br />
          <Grid container spacing={2}>
            <Grid item md={12} xs={12}>
              {user?.is_secretary ? (
                <FormControl className="patients__info">
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    type="date"
                    className="patients__info"
                    value={dateToday}
                    disabled={true}
                  />
                </FormControl>
              ) : (
                <FormControl className="patients__info">
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    type="date"
                    className="patients__info"
                    onChange={(e) => setDatePaid(e.target.value)}
                    value={datePaid}
                    helperText="Date Paid"
                  />
                </FormControl>
              )}
            </Grid>
            {/* <Grid item md={12} xs={12}>
              <FormControl className="patients__info">
                <TextField
                  id="outlined-basic"
                  label="Check Number"
                  variant="outlined"
                  type="text"
                  className="patients__info"
                  onChange={(e) => setCheckNumber(e.target.value)}
                  value={checkNumber}
                />
              </FormControl>
            </Grid> */}
            <Grid item md={12} xs={12}>
              <FormControl className="patients__info">
                <TextField
                  id="outlined-basic"
                  label="Amount"
                  variant="outlined"
                  type="number"
                  className="patients__info"
                  onChange={(e) => setAmount(e.target.value)}
                  value={amount}
                />
              </FormControl>
            </Grid>
            <Grid item md={12} xs={12}>
              <FormControl className="patients__info">
                <TextField
                  id="outlined-basic"
                  label="Balance"
                  variant="outlined"
                  type="number"
                  className="patients__info"
                  onChange={(e) => setBalance(e.target.value)}
                  value={calculateBalance(balance, amount)}
                />
              </FormControl>
            </Grid>
            <Grid item md={12} xs={12}>
              <FormControl className="patients__info">
                <TextField
                  id="outlined-basic"
                  label="Amount"
                  variant="outlined"
                  type="text"
                  className="patients__info"
                  helperText="Process By"
                  value={user.email}
                  disabled={true}
                />
              </FormControl>
            </Grid>
          </Grid>

          <Button
            variant="contained"
            className="patients__modalButton"
            onClick={() => handleUpdateBalance(balanceId)}
          >
            Update
          </Button>
        </Box>
      </Modal>
      {/* End of Modal */}

      {/* Modal to show breakdown1 */}
      <Modal
        open={breakdownOpen}
        onClose={handleBreakdownClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style2} className="patients__box">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Details
          </Typography>
          <br />
          <Grid container spacing={2}>
            <Grid item md={12} lg={12} xs={12}>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: "100%" }}>
                  <TableHead className="viewPatient__tableHead">
                    <TableRow>
                      <TableCell className="viewPatient__tableCell">
                        Date Added
                      </TableCell>
                      <TableCell
                        align="center"
                        className="viewPatient__tableCell"
                      >
                        Description
                      </TableCell>
                      <TableCell
                        align="center"
                        className="viewPatient__tableCell"
                      >
                        Check Number
                      </TableCell>
                      <TableCell
                        align="center"
                        className="viewPatient__tableCell"
                      >
                        Amount
                      </TableCell>
                      <TableCell
                        align="center"
                        className="viewPatient__tableCell"
                      >
                        Payment
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                      key={breakdowns1?.id}
                    >
                      <TableCell component="th" scope="row">
                        {breakdowns1?.date}
                      </TableCell>
                      <TableCell align="center">
                        {breakdowns1?.description.name
                          ? breakdowns1?.description.name
                          : ""}
                      </TableCell>
                      <TableCell align="center">
                        {breakdowns1?.check_number
                          ? breakdowns1?.check_number
                          : "N/A"}
                      </TableCell>
                      <TableCell align="center">
                        {breakdowns1?.amount}
                      </TableCell>
                      <TableCell align="center">
                        {breakdowns1?.payment}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item md={12} lg={12} xs={12}>
              <h3 className="viewPatient__breakdownText">Payment History</h3>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: "100%" }}>
                  <TableHead className="viewPatient__tableHead">
                    <TableRow>
                      <TableCell className="viewPatient__tableCell">
                        Date Paid
                      </TableCell>
                      <TableCell
                        align="center"
                        className="viewPatient__tableCell"
                      >
                        Check Number
                      </TableCell>
                      <TableCell
                        align="center"
                        className="viewPatient__tableCell"
                      >
                        Amount
                      </TableCell>
                      <TableCell
                        align="center"
                        className="viewPatient__tableCell"
                      >
                        Process By
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                      key={breakdowns1?.id}
                    >
                      <TableCell component="th" scope="row">
                        {breakdowns1?.date}
                      </TableCell>
                      <TableCell align="center">
                        {breakdowns1?.check_number
                          ? breakdowns1?.check_number
                          : "N/A"}
                      </TableCell>
                      <TableCell align="center">
                        {breakdowns1?.amount}
                      </TableCell>
                      <TableCell align="center">
                        {breakdowns1?.process_by}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Box>
      </Modal>
      {/* End of Modal */}
      {/* -------------- */}
      {/* Modal to show breakdown2 */}
      <Modal
        open={breakdown2Open}
        onClose={handleBreakdown2Close}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style2} className="patients__box">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Details
          </Typography>
          <br />
          <Grid container spacing={2}>
            <Grid item md={12} lg={12} xs={12}>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: "100%" }}>
                  <TableHead className="viewPatient__tableHead">
                    <TableRow>
                      <TableCell className="viewPatient__tableCell">
                        Date Added
                      </TableCell>
                      <TableCell
                        align="center"
                        className="viewPatient__tableCell"
                      >
                        Description
                      </TableCell>
                      <TableCell
                        align="center"
                        className="viewPatient__tableCell"
                      >
                        Check Number
                      </TableCell>
                      <TableCell
                        align="center"
                        className="viewPatient__tableCell"
                      >
                        Amount
                      </TableCell>
                      <TableCell
                        align="center"
                        className="viewPatient__tableCell"
                      >
                        Payment
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell align="center">
                        {breakdowns2[0]?.process_payments.date}
                      </TableCell>
                      <TableCell align="center">
                        {breakdowns2[0]?.process_payments.description.name}
                      </TableCell>
                      <TableCell align="center">
                        {breakdowns2[0]?.process_payments.check_number
                          ? breakdowns2[0]?.process_payments.check_number
                          : "N/A"}
                      </TableCell>
                      <TableCell align="center">
                        {breakdowns2[0]?.process_payments.amount}
                      </TableCell>
                      <TableCell align="center">
                        {breakdowns2[0]?.process_payments.payment}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item md={12} lg={12} xs={12}>
              <h3 className="viewPatient__breakdownText">Payment History</h3>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: "100%" }}>
                  <TableHead className="viewPatient__tableHead">
                    <TableRow>
                      <TableCell className="viewPatient__tableCell">
                        Date Paid
                      </TableCell>
                      <TableCell
                        align="center"
                        className="viewPatient__tableCell"
                      >
                        Check Number
                      </TableCell>
                      <TableCell
                        align="center"
                        className="viewPatient__tableCell"
                      >
                        Amount
                      </TableCell>
                      <TableCell
                        align="center"
                        className="viewPatient__tableCell"
                      >
                        Process By
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {breakdowns2?.map((val) => (
                      <>
                        <TableRow
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                          key={val.id}
                        >
                          <TableCell align="center">{val.date_paid}</TableCell>
                          <TableCell align="center">
                            {val.check_number}
                          </TableCell>
                          <TableCell align="center">{val.amount}</TableCell>
                          <TableCell align="center">{val.process_by}</TableCell>
                        </TableRow>
                      </>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Box>
      </Modal>
      {/* End of Modal */}
      <Grid container spacing={4}>
        <Grid item md={12} xs={12} lg={12} className="test">
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: "100%" }}>
              <TableHead className="viewPatient__tableHead">
                <TableRow>
                  <TableCell className="viewPatient__tableCell">Name</TableCell>
                  <TableCell align="center" className="viewPatient__tableCell">
                    Address
                  </TableCell>
                  <TableCell align="center" className="viewPatient__tableCell">
                    Telephone
                  </TableCell>
                  <TableCell align="center" className="viewPatient__tableCell">
                    Age
                  </TableCell>
                  <TableCell align="center" className="viewPatient__tableCell">
                    Occupation
                  </TableCell>
                  <TableCell align="center" className="viewPatient__tableCell">
                    Status
                  </TableCell>
                  <TableCell align="center" className="viewPatient__tableCell">
                    Complaint
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {firstName} {middleName}. {lastName}
                  </TableCell>
                  <TableCell align="center">{address}</TableCell>
                  <TableCell align="center">{telephone}</TableCell>
                  <TableCell align="center">{age}</TableCell>
                  <TableCell align="center">{occupation}</TableCell>
                  <TableCell align="center">{status}</TableCell>
                  <TableCell align="center">{complaint}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item md={12} xs={12} lg={12}>
          <h1 className="viewPatient__h1">Payment History</h1>
          <Box sx={{ bgcolor: "background.paper", width: 100 + "%" }}>
            <AppBar position="static">
              <Tabs
                value={value}
                onChange={handleChange}
                indicatorColor="secondary"
                textColor="inherit"
                variant="fullWidth"
                aria-label="full width tabs example"
              >
                <Tab label="Paid" {...a11yProps(0)} />
                <Tab label="Balance" {...a11yProps(1)} />
              </Tabs>
            </AppBar>
            <SwipeableViews
              axis={theme.direction === "rtl" ? "x-reverse" : "x"}
              index={value}
              onChangeIndex={handleChangeIndex}
            >
              {/* Paid */}
              <TabPanel value={value} index={0} dir={theme.direction}>
                <Grid item md={12} xs={12}>
                  <FormControl className="viewPatient__dateField">
                    <TextField
                      id="outlined-basic"
                      variant="outlined"
                      type="date"
                      className="patients__info"
                      onChange={(e) => setSearchDate(e.target.value)}
                      value={searchDate}
                    />
                  </FormControl>
                </Grid>

                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: "100%" }}>
                    <TableHead className="viewPatient__tableHead">
                      <TableRow>
                        <TableCell
                          align="center"
                          className="viewPatient__tableCell"
                        >
                          Date
                        </TableCell>
                        <TableCell
                          align="center"
                          className="viewPatient__tableCell"
                        >
                          Description
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
                      {filterTransactions()
                        ?.filter((val) => {
                          if (searchDate === null) {
                            return val;
                          } else if (val.date.includes(searchDate)) {
                            return val;
                          }
                        })
                        .map((val) => (
                          <>
                            {val.balance === 0 ? (
                              <TableRow
                                sx={{
                                  "&:last-child td, &:last-child th": {
                                    border: 0,
                                  },
                                }}
                                key={val.id}
                              >
                                <TableCell
                                  align="center"
                                  component="th"
                                  scope="row"
                                >
                                  {val.date}
                                </TableCell>

                                <TableCell
                                  align="center"
                                  component="th"
                                  scope="row"
                                >
                                  {val.description.name}
                                </TableCell>

                                <TableCell align="center">
                                  {val.is_paid_within_the_day ? (
                                    <Button
                                      variant="contained"
                                      color="success"
                                      className="patients__button"
                                      onClick={() =>
                                        handleShowBreakdown1(val.id)
                                      }
                                    >
                                      Details
                                    </Button>
                                  ) : (
                                    <Button
                                      variant="contained"
                                      color="success"
                                      className="patients__button"
                                      onClick={() =>
                                        handleShowBreakdown2(val.id)
                                      }
                                    >
                                      Details
                                    </Button>
                                  )}
                                </TableCell>
                              </TableRow>
                            ) : (
                              ""
                            )}
                          </>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </TabPanel>
              {/* Balances */}
              <TabPanel value={value} index={1} dir={theme.direction}>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: "100%" }}>
                    <TableHead className="viewPatient__tableHead">
                      <TableRow>
                        <TableCell className="viewPatient__tableCell">
                          Date
                        </TableCell>
                        <TableCell
                          align="center"
                          className="viewPatient__tableCell"
                        >
                          Description
                        </TableCell>
                        <TableCell
                          align="center"
                          className="viewPatient__tableCell"
                        >
                          Check Number
                        </TableCell>
                        <TableCell
                          align="center"
                          className="viewPatient__tableCell"
                        >
                          Discount
                        </TableCell>
                        <TableCell
                          align="center"
                          className="viewPatient__tableCell"
                        >
                          Amount
                        </TableCell>
                        <TableCell
                          align="center"
                          className="viewPatient__tableCell"
                        >
                          Payment
                        </TableCell>
                        <TableCell
                          align="center"
                          className="viewPatient__tableCell"
                        >
                          Balance
                        </TableCell>
                        <TableCell
                          align="center"
                          className="viewPatient__tableCell"
                        >
                          Process By
                        </TableCell>
                        <TableCell
                          align="center"
                          className="viewPatient__tableCell"
                          colSpan={2}
                        >
                          Action
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filterTransactions()?.map((val) => (
                        <>
                          {val.balance !== 0 ? (
                            <TableRow
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  border: 0,
                                },
                              }}
                              key={val.id}
                            >
                              {val.balance !== 0 ? (
                                <TableCell component="th" scope="row">
                                  {val.date}
                                </TableCell>
                              ) : (
                                ""
                              )}
                              {val.balance !== 0 ? (
                                <TableCell
                                  align="center"
                                  component="th"
                                  scope="row"
                                >
                                  {val.description.name}
                                </TableCell>
                              ) : (
                                ""
                              )}
                              {val.balance !== 0 ? (
                                <TableCell align="center">
                                  {val.check_number ? val.check_number : "N/A"}
                                </TableCell>
                              ) : (
                                ""
                              )}
                              {val.balance !== 0 ? (
                                <TableCell align="center">
                                  {numberWithCommas(val.discount)}
                                </TableCell>
                              ) : (
                                ""
                              )}
                              {val.balance !== 0 ? (
                                <TableCell align="center">
                                  {numberWithCommas(val.amount)}
                                </TableCell>
                              ) : (
                                ""
                              )}
                              {val.balance !== 0 ? (
                                <TableCell align="center">
                                  {numberWithCommas(val.payment)}
                                </TableCell>
                              ) : (
                                ""
                              )}
                              {val.balance !== 0 ? (
                                <TableCell align="center">
                                  {numberWithCommas(val.balance)}
                                </TableCell>
                              ) : (
                                ""
                              )}
                              {val.balance !== 0 ? (
                                <TableCell align="center">
                                  {numberWithCommas(val.process_by)}
                                </TableCell>
                              ) : (
                                ""
                              )}
                              {val.balance !== 0 ? (
                                <TableCell align="center">
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    className="patients__button"
                                    onClick={() => getUpdateBalance(val.id)}
                                  >
                                    Update
                                  </Button>
                                </TableCell>
                              ) : (
                                ""
                              )}{" "}
                              &nbsp;
                              <Button
                                variant="contained"
                                color="success"
                                className="viewPatient__balanceDetailsButton"
                                onClick={() => handleShowBreakdown2(val.id)}
                              >
                                Details
                              </Button>
                            </TableRow>
                          ) : (
                            ""
                          )}
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

export default ViewPatient;
