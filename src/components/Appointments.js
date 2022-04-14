import React, { useEffect, useState } from "react";
//react router
import { useNavigate } from "react-router";
//css
import "../css/Appointment.css";
//react select
import Select from "react-select";
// material UI
import { Button, FormControl, Grid, TextField } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
// axios
import axios from "../axios";
// sweet alert
import swal from "sweetalert";

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

function Appointments() {
  const navigate = useNavigate();
  const todaysDate = new Date();

  const [patients, setPatients] = useState([]);
  const [patient, setPatient] = useState("");
  const [treatments, setTreatments] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [dateAppointed, setDateAppointed] = useState("");
  const [description, setDescription] = useState("");
  // modal for adding appointment
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // options for select
  let patientsOptions = patients.map((patient) => ({
    value: patient.id,
    label: patient.first_name + " " + patient.last_name,
  }));
  let treatmentsOptions = treatments.map((treatment) => ({
    value: treatment.id,
    label: treatment.name,
  }));

  useEffect(() => {
    axios
      .get("/api/appointments", {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setAppointments(res.data);
      });

    axios
      .get("/api/patients", {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setPatients(res.data);
      });

    axios
      .get("/api/treatments", {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setTreatments(res.data);
      });
  }, []);

  console.log("all apointments: ", appointments);

  // filtered appointments
  const filterAppointments = () => {
    return appointments.filter((appointment) => {
      return appointment.date_appointed === searchDate;
    });
  };

  //add appointment
  const handleAddTreatment = (e) => {
    e.preventDefault();

    if (patient === "" || dateAppointed === "" || description === "") {
      swal("Error", "Fill All Fields ", "warning");
    } else {
      const form = {
        date_appointed: dateAppointed,
        patient: patient,
        description: description,
        status: false,
        donePayment: false,
      };

      axios
        .post("/api/appointments/", form, {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          swal("Success", `Appointment Added Successful`, "success").then(
            setTimeout(() => {
              window.location.reload(false);
            }, 1000)
          );
        });
    }
  };

  //cancel appointment
  const handleCancelAppointment = (id) => {
    axios
      .delete(`/api/appointments/${id}/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        swal("Success", ` Canceled`, "success").then(
          setTimeout(() => {
            window.location.reload(false);
          }, 1000)
        );
      });
  };

  // done button
  const handleDoneButton = (id) => {
    const form = {
      status: true,
      donePayment: false,
    };

    axios
      .put(`/api/appointments/${id}/`, form, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        swal("Success", ` Done`, "success").then(
          setTimeout(() => {
            window.location.reload(false);
          }, 1000)
        );
      });
  };

  const formatDate = () => {
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

  const [searchDate, setSearchDate] = useState(formatDate());

  return (
    <>
      {/* Modal for adding appointment */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="appointments__box">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Appointment
          </Typography>
          <br />
          <Grid container spacing={2}>
            <Grid item md={12} xs={12}>
              <FormControl className="appointments__info">
                <Select
                  label="Select Patients"
                  options={patientsOptions}
                  onChange={(e) => setPatient(e.value)}
                />
              </FormControl>
            </Grid>
            <Grid item md={12} xs={12}>
              <FormControl className="appointments__info">
                <TextField
                  id="outlined-basic"
                  type="date"
                  variant="outlined"
                  className="appointments__info"
                  onChange={(e) => setDateAppointed(e.target.value)}
                  value={dateAppointed}
                  required
                />
              </FormControl>
            </Grid>
            <Grid item md={12} xs={12}>
              <FormControl className="appointments__info">
                <Select
                  options={treatmentsOptions}
                  onChange={(e) => setDescription(e.value)}
                />
              </FormControl>
            </Grid>
          </Grid>

          <Button
            onClick={handleAddTreatment}
            variant="contained"
            className="appointments__modalButton"
          >
            Add
          </Button>
        </Box>
      </Modal>
      {/* End of Modal */}

      <Grid container spacing={4} className="appointments__gridForTable">
        <Grid item md={6} xs={12}>
          <TextField
            type="date"
            id="outlined-basic"
            variant="outlined"
            className="appointments__input"
            onChange={(e) => setSearchDate(e.target.value)}
            value={searchDate}
          />
        </Grid>
        <Grid item md={6} xs={12} className="appointments__buttonContainer">
          <Button
            variant="contained"
            className="appointments__button"
            onClick={handleOpen}
          >
            Add Appointment
          </Button>
        </Grid>
        <Grid item md={12} xs={12}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: "100%" }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Date Appointed</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center" colSpan={2}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!searchDate ? (
                  <>
                    {appointments?.map((val) => {
                      return (
                        <TableRow
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                          key={val.id}
                        >
                          <TableCell component="th" scope="row">
                            {val.date_appointed}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {val.patient.first_name} {val.patient.middle_name}.{" "}
                            {val.patient.last_name}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {val.patient.telephone}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {val.description.name}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {!val.status ? "Pending" : "Done"}
                          </TableCell>
                          <TableCell align="center">
                            {!val.status ? (
                              <Button
                                variant="contained"
                                color="success"
                                className="appointments__button "
                                onClick={() => handleDoneButton(val.id)}
                              >
                                Done
                              </Button>
                            ) : (
                              ""
                            )}
                            &nbsp;
                            {!val.status ? (
                              <Button
                                variant="contained"
                                color="warning"
                                className="appointments__button"
                                onClick={() => handleCancelAppointment(val.id)}
                              >
                                Cancel
                              </Button>
                            ) : (
                              <Button
                                variant="contained"
                                color="warning"
                                className="appointments__button"
                                onClick={() =>
                                  navigate(`/view-patient/:${val.id}`)
                                }
                              >
                                View
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </>
                ) : (
                  <>
                    {filterAppointments()?.map((val) => {
                      return (
                        <TableRow
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                          key={val.id}
                        >
                          <TableCell component="th" scope="row">
                            {val.date_appointed}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {val.patient.first_name} {val.patient.middle_name}.{" "}
                            {val.patient.last_name}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {val.patient.telephone}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {val.description.name}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {!val.status ? "Pending" : "Done"}
                          </TableCell>
                          <TableCell align="center">
                            {!val.status ? (
                              <Button
                                variant="contained"
                                color="success"
                                className="appointments__button "
                                onClick={() => handleDoneButton(val.id)}
                              >
                                Done
                              </Button>
                            ) : (
                              ""
                            )}
                            &nbsp;
                            {!val.status ? (
                              <Button
                                variant="contained"
                                color="warning"
                                className="appointments__button"
                                onClick={() => handleCancelAppointment(val.id)}
                              >
                                Cancel
                              </Button>
                            ) : (
                              <Button
                                variant="contained"
                                color="success"
                                className="appointments__button"
                                onClick={() =>
                                  navigate(`/view-patient/:${val.id}`)
                                }
                              >
                                View
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </>
  );
}

export default Appointments;
