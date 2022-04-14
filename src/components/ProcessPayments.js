import React, { useEffect, useState } from "react";
import "../css/ProcessPayments.css";
// material UI
import {
  Button,
  FormControl,
  Grid,
  TextField,
  FormHelperText,
} from "@mui/material";
import Select from "react-select";
// axios
import axios from "../axios";
//sweet alert
import swal from "sweetalert";
// react router dom
import { useNavigate } from "react-router-dom";
// redux
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { AutoFixOffSharp } from "@mui/icons-material";

function ProcessPayments() {
  const user = useSelector(selectUser);
  const [processBy, setProcessBy] = useState(user?.email);
  const todaysDate = new Date();
  let navigate = useNavigate();
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
  const [description, setDescription] = useState("");
  const [treatments, setTreatments] = useState([]);
  const [checkNumber, setCheckNumber] = useState("");
  const [discount, setDiscount] = useState(0);
  const [amount, setAmount] = useState();
  const [payment, setPayment] = useState(0);
  const [patients, setPatients] = useState([]);
  const [patient, setPatient] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [treatmentId, setTreatmentId] = useState("");

  // options for select
  let patientsOptions = patients.map((patient) => ({
    value: patient.id,
    label: patient.first_name + " " + patient.last_name,
  }));

  useEffect(() => {
    // get all patients
    axios
      .get("/api/patients", {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setPatients(res.data);
      });
    // get all appointments
    axios
      .get("/api/appointments", {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setAppointments(res.data);
      });
    // get all treatments
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

  const filterAppointments = () => {
    if (patient) {
      return appointments.filter((val) => {
        return val.patient.id === patient;
      });
    }
  };

  const allDoneAppointments = () => {
    return filterAppointments()?.filter((val) => {
      // setTreatmentId(val.id);
      let statuss = val.status;
      let donePaymentt = val.donePayment;
      if (statuss === true && donePaymentt === false) {
        return val.status === true;
      }
      return null;
    });
  };

  let treatmentsOptions = allDoneAppointments()?.map((treatment) => ({
    value: treatment.description.id,
    label: treatment.description.name,
    treatId: treatment.id,
  }));

  const automaticAmount = (discount) => {
    return amount - discount;
  };

  const [balance, setBalance] = useState(0);

  const automaticBalance = (amount, payment, discount) => {
    let amountt = amount;
    let paymentt = payment;
    let discountt = discount;
    let total = amountt - discountt - paymentt;
    if (total < 0) {
      return 0;
    }
    return total;

    // return parseInt(amount - payment - discount);
  };

  const handleProcessPayment = (e) => {
    e.preventDefault();
    // console.log(dateToday);
    // console.log(patient);
    // console.log(description);
    // console.log(checkNumber);
    // console.log(discount);
    // console.log(automaticAmount(discount));
    // console.log(payment);
    // console.log(automaticBalance(amount, payment, discount));
    if (patient === "" || description === "" || amount === 0) {
      swal("Error", "Fill all the fields", "warning");
    } else {
      if (automaticBalance(amount, payment, discount) === 0) {
        axios
          .post(
            "/api/payments/",
            {
              patient: patient,
              description: description,
              date: dateToday,
              check_number: checkNumber,
              discount: discount,
              amount: automaticAmount(discount),
              payment: payment,
              balance: automaticBalance(amount, payment, discount),
              process_by: user?.email,
              is_paid_within_the_day: true,
            },
            {
              headers: {
                Authorization: `Token ${localStorage.getItem("token")}`,
              },
            }
          )
          .then((res) => {
            axios
              .put(
                `/api/appointments/${treatmentId}/`,
                { donePayment: true, status: true },
                {
                  headers: {
                    Authorization: `Token ${localStorage.getItem("token")}`,
                  },
                }
              )
              .then((res2) => {
                swal("Success", `Process Payment Successful`, "success").then(
                  setTimeout(() => {
                    navigate(`/patients`);
                  }, 500)
                );
              });
          });
      } else {
        axios
          .post(
            "/api/payments/",
            {
              patient: patient,
              description: description,
              date: dateToday,
              check_number: checkNumber,
              discount: discount,
              amount: automaticAmount(discount),
              payment: payment,
              balance: automaticBalance(amount, payment, discount),
              process_by: user?.email,
              is_paid_within_the_day: false,
            },
            {
              headers: {
                Authorization: `Token ${localStorage.getItem("token")}`,
              },
            }
          )
          .then((res) => {
            axios
              .put(
                `/api/appointments/${treatmentId}/`,
                { donePayment: true, status: true },
                {
                  headers: {
                    Authorization: `Token ${localStorage.getItem("token")}`,
                  },
                }
              )
              .then((res2) => {
                swal("Success", `Process Payment Successful`, "success").then(
                  setTimeout(() => {
                    navigate(`/patients`);
                  }, 500)
                );
              });
          });
      }
    }
  };

  return (
    <>
      <Grid container spacing={4}>
        <Grid item md={6} xs={12}>
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
        </Grid>
        <Grid item md={6} xs={12}>
          <FormControl className="patients__info">
            <Select
              label="Select Patients"
              options={patientsOptions}
              onChange={(e) => setPatient(e.value)}
            />
          </FormControl>
        </Grid>
        <Grid item md={6} xs={12}>
          <FormControl className="patients__info">
            <Select
              label="Select Description"
              options={treatmentsOptions}
              onChange={(e) => {
                setDescription(e.value);
                setTreatmentId(e.treatId);
              }}
            />
          </FormControl>
        </Grid>
        <Grid item md={6} xs={12}>
          <FormControl className="patients__info">
            <TextField
              id="outlined-basic"
              variant="outlined"
              label="Check Number"
              type="text"
              className="patients__info"
              onChange={(e) => setCheckNumber(e.target.value)}
              value={checkNumber}
              required
            />
          </FormControl>
        </Grid>
        <Grid item md={6} xs={12}>
          <FormControl className="patients__info">
            <TextField
              id="outlined-basic"
              variant="outlined"
              type="number"
              className="patients__info"
              onChange={(e) => setAmount(e.target.value)}
              value={automaticAmount(discount)}
              required
              helperText="Amount"
            />
          </FormControl>
        </Grid>
        <Grid item md={6} xs={12} lg={6}>
          <FormControl className="patients__info">
            <TextField
              id="outlined-basic"
              variant="outlined"
              type="number"
              className="patients__info"
              onChange={(e) => setDiscount(e.target.value)}
              value={discount}
              required
              helperText="Discount"
            />
          </FormControl>
        </Grid>

        <Grid item md={12} xs={12}>
          <FormControl className="patients__info">
            <TextField
              id="outlined-basic"
              variant="outlined"
              type="number"
              className="patients__info"
              onChange={(e) => setPayment(e.target.value)}
              value={payment}
              required
              helperText="Payment"
            />
          </FormControl>
        </Grid>
        <Grid item md={6} xs={12}>
          <FormControl className="patients__info">
            <TextField
              id="outlined-basic"
              variant="outlined"
              type="number"
              className="patients__info"
              onChange={(e) => setBalance(e.target.value)}
              min="0"
              value={automaticBalance(amount, payment, discount)}
              required
              helperText="Balance"
            />
          </FormControl>
        </Grid>
        <Grid item md={6} xs={12}>
          <FormControl className="patients__info">
            <TextField
              id="outlined-basic"
              variant="outlined"
              type="text"
              className="patients__info"
              value={user?.email}
              disabled={true}
              helperText="Process By"
            />
          </FormControl>
        </Grid>
        <Grid item md={12} xs={12}>
          <Button
            onClick={handleProcessPayment}
            variant="contained"
            className="patients__modalButton"
          >
            Process Payment
          </Button>
        </Grid>
      </Grid>
    </>
  );
}

export default ProcessPayments;
