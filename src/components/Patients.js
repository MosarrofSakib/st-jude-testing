import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import "../css/Patients.css";
import {
  Button,
  colors,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
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
import swal from "sweetalert";
import axios from "../axios";

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

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

function Patients() {
  const navigate = useNavigate();
  //modal for adding patient
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  // end of modal for adding patient
  //modal for sure to add existing fullname
  const [openSureModal, setOpenSureModal] = useState(false);
  const handleSureOpen = () => setOpenSureModal(true);
  const handleSureClose = () => setOpenSureModal(false);
  // end of modal for sure to add existing fullname
  const [searchItem, setSearchItem] = useState("");
  const [patients, setPatients] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [address, setAddress] = useState("");
  const [telephone, setTelephone] = useState("");
  const [age, setAge] = useState(0);
  const [occupation, setOccupation] = useState("");
  const [status, setStatus] = useState("");
  const [complaint, setComplaint] = useState("");
  const [searchName, setSearchName] = useState("");

  // regex number for PH
  let numberPattern = /^(09|\+639)\d{9}$/gm;
  console.log("csrftoken: ", getCookie("csrftoken"));
  //get all patients
  useEffect(() => {
    axios
      .get("/api/patients", {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setPatients(res.data);
      });
  }, []);

  //capitalize the first letter of each word
  const capitalize = (input) => {
    return input
      .toLowerCase()
      .split(" ")
      .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
      .join(" ");
  };
  console.log(telephone);
  //check if number is already exist
  const checkNumber = patients?.some((val) => val.telephone === telephone);

  // check if full name is already exist
  const checkFullName = patients?.some(
    (val) =>
      val.first_name === capitalize(firstName) &&
      val.last_name === capitalize(lastName) &&
      val.middle_name === capitalize(middleName)
  );

  // add patient
  const handleAddPatient = (e) => {
    e.preventDefault();
    const form = {
      first_name: capitalize(firstName),
      last_name: capitalize(lastName),
      middle_name: capitalize(middleName),
      address: capitalize(address),
      telephone: telephone.toString(),
      age: age,
      occupation: capitalize(occupation),
      status: status,
      complaint: capitalize(complaint),
    };
    // else if (telephone.toString().match(numberPattern) == false) {
    //   swal("Error", "Invalid Number", "warning");
    // }
    if (
      firstName === "" ||
      lastName === "" ||
      middleName === "" ||
      address === "" ||
      age === 0 ||
      telephone === 0 ||
      occupation === "" ||
      status === "" ||
      complaint === ""
    ) {
      swal("Error", "Fill all the Fields", "warning");
    } else if (age > 100) {
      swal("Error", "Maximum age is 100", "warning");
    } else if (!numberPattern.test(telephone)) {
      swal("Error", "Invalid Number", "warning");
    } else if (checkNumber) {
      swal("Error", "This number is Already Exist", "warning");
    } else if (checkFullName) {
      setOpenSureModal(true);
    } else {
      axios
        .post("api/patients/", form, {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          swal("Success", `Patient Added Successful`, "success").then(
            setTimeout(() => {
              window.location.reload(false);
            }, 1000)
          );
          setFirstName("");
          setLastName("");
          setMiddleName("");
          setAddress("");
          setTelephone("");
          setAge("");
          setOccupation("");
          setStatus("");
          setComplaint("");
        });
    }
  };

  const addPatientEvenIfExist = (e) => {
    e.preventDefault();
    const form = {
      first_name: capitalize(firstName),
      last_name: capitalize(lastName),
      middle_name: capitalize(middleName),
      address: capitalize(address),
      telephone: telephone,
      age: age,
      occupation: capitalize(occupation),
      status: status,
      complaint: capitalize(complaint),
    };
    axios
      .post("api/patients/", form, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        swal("Success", `Patient Added Successful`, "success").then(
          setTimeout(() => {
            window.location.reload(false);
          }, 1300)
        );
        setFirstName("");
        setLastName("");
        setMiddleName("");
        setAddress("");
        setTelephone("");
        setAge("");
        setOccupation("");
        setStatus("");
        setComplaint("");
      });
  };

  // handle delete
  const handleDeletePatient = (id, firstName) => {
    axios
      .delete(`/api/patients/${id}/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        swal("Success", `${firstName} Deleted Successfull`, "success").then(
          setTimeout(() => {
            window.location.reload(false);
          }, 1000)
        );
      });
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
            Patient Info
          </Typography>
          <br />
          <Grid container spacing={2}>
            <Grid item md={6} xs={12}>
              <FormControl className="patients__info">
                <TextField
                  id="outlined-basic"
                  label="First Name"
                  variant="outlined"
                  type="text"
                  className="patients__info"
                  onChange={(e) => setFirstName(e.target.value)}
                  value={firstName}
                  required
                />
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12}>
              <FormControl className="patients__info">
                <TextField
                  id="outlined-basic"
                  label="Middle Name"
                  variant="outlined"
                  type="text"
                  className="patients__info"
                  onChange={(e) => setMiddleName(e.target.value)}
                  value={middleName}
                  required
                />
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12}>
              <FormControl className="patients__info">
                <TextField
                  id="outlined-basic"
                  label="Last Name"
                  variant="outlined"
                  type="text"
                  className="patients__info"
                  onChange={(e) => setLastName(e.target.value)}
                  value={lastName}
                  required
                />
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12}>
              <FormControl className="patients__info">
                <TextField
                  id="outlined-basic"
                  label="Address"
                  variant="outlined"
                  type="text"
                  className="patients__info"
                  onChange={(e) => setAddress(e.target.value)}
                  value={address}
                  required
                />
              </FormControl>
            </Grid>
          </Grid>
          <FormControl className="patients__info">
            <TextField
              id="outlined-basic"
              label="Age"
              variant="outlined"
              type="number"
              className="patients__info"
              onChange={(e) => setAge(e.target.value)}
              value={age}
              required
            />
          </FormControl>

          <FormControl className="patients__info">
            <TextField
              id="outlined-basic"
              label="Mobile Number"
              variant="outlined"
              type="number"
              className="patients__info"
              onChange={(e) => setTelephone(e.target.value)}
              value={telephone}
              required
            />
          </FormControl>
          <FormControl className="patients__info">
            <TextField
              id="outlined-basic"
              label="Occupation"
              variant="outlined"
              type="text"
              className="patients__info"
              onChange={(e) => setOccupation(e.target.value)}
              value={occupation}
              required
            />
          </FormControl>
          <FormControl className="patients__info">
            <InputLabel id="demo-simple-select-label">Status</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={status}
              label="Status"
              onChange={(e) => setStatus(e.target.value)}
            >
              <MenuItem value={"Single"}>Single</MenuItem>
              <MenuItem value={"Married"}>Married</MenuItem>
              <MenuItem value={"Divorced"}>Divorced</MenuItem>
              <MenuItem value={"Separated"}>Separated</MenuItem>
            </Select>
          </FormControl>
          <FormControl className="patients__info">
            <TextField
              id="outlined-basic"
              label="Complaint"
              variant="outlined"
              className="patients__info"
              onChange={(e) => setComplaint(e.target.value)}
              value={complaint}
              required
            />
          </FormControl>
          <Button
            onClick={handleAddPatient}
            variant="contained"
            className="patients__modalButton"
          >
            Add
          </Button>
        </Box>
      </Modal>
      {/* End of Modal */}
      {/* Modal for Sure Modal */}
      <Modal
        open={openSureModal}
        onClose={handleSureClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="patients__box">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            This Fullname is Already Exist Are you sure you want to proceed?
          </Typography>
          <br />

          <Button
            onClick={addPatientEvenIfExist}
            variant="contained"
            className="patients__modalButton"
          >
            Yes
          </Button>
        </Box>
      </Modal>
      {/* End of Modal */}
      <Grid container spacing={4} className="patients__gridForTable">
        <Grid item md={6} xs={12} sm={12}>
          <TextField
            id="outlined-basic"
            label="Search Patient"
            variant="outlined"
            className="patients__input"
            onChange={(e) => setSearchItem(e.target.value)}
          />
        </Grid>
        <Grid item md={6} xs={12} sm={12} className="patients__buttonContainer">
          <Button
            variant="contained"
            className="patients__button"
            onClick={handleOpen}
          >
            Add Patient
          </Button>
        </Grid>
        <Grid item md={12} xs={12}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: "100%" }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell align="center" colSpan={2}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {patients
                  .filter((val) => {
                    if (searchItem === "") {
                      return val;
                    } else if (
                      val.first_name
                        .toLowerCase()
                        .includes(searchItem.toLowerCase())
                    ) {
                      return val;
                    }
                  })
                  .map((val) => {
                    return (
                      <TableRow
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                        key={val.id}
                      >
                        <TableCell component="th" scope="row">
                          {val.first_name} {val.middle_name}. {val.last_name}
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            variant="contained"
                            color="success"
                            className="patients__button"
                            onClick={() => navigate(`/view-patient/${val.id}`)}
                          >
                            View
                          </Button>{" "}
                          &nbsp;
                          <Button
                            variant="contained"
                            color="warning"
                            className="patients__button"
                            onClick={() =>
                              handleDeletePatient(val.id, val.first_name)
                            }
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </>
  );
}

export default Patients;
