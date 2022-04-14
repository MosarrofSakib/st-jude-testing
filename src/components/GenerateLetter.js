import React, { useState } from "react";
import "../css/GenerateLetter.css";
import print from "print-js";
import printJS from "print-js";
import {
  Button,
  FormControl,
  Grid,
  Input,
  InputLabel,
  TextField,
} from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

function GeneratePayment() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const todaysDate = new Date();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [resident, setResident] = useState("");
  const [dateTreated, setDateTreated] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [procedures, setProcedures] = useState("");

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
  const generateForm = () => {
    printJS({
      printable: "form__container",
      type: "html",
      targetStyles: ["*"],
    });
  };

  // style for modal
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    height: 600,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
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
        <Box sx={style} className="generateLetter__modal">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Input Info
          </Typography>
          <br />
          <Grid container spacing={2}>
            <Grid item md={12} xs={12}>
              <FormControl className="patients__info">
                <TextField
                  id="outlined-basic"
                  label=" Name"
                  variant="outlined"
                  type="text"
                  className="patients__info"
                  onChangeCapture={(e) => setName(e.target.value)}
                  value={name}
                />
              </FormControl>
            </Grid>
            <Grid item md={12} xs={12}>
              <FormControl className="patients__info">
                <TextField
                  id="outlined-basic"
                  label=" Age"
                  variant="outlined"
                  type="number"
                  className="patients__info"
                  onChangeCapture={(e) => setAge(e.target.value)}
                  value={age}
                />
              </FormControl>
            </Grid>
            <Grid item md={12} xs={12}>
              <FormControl className="patients__info">
                <TextField
                  id="outlined-basic"
                  label=" Resident Of"
                  variant="outlined"
                  type="text"
                  className="patients__info"
                  onChangeCapture={(e) => setResident(e.target.value)}
                  value={resident}
                />
              </FormControl>
            </Grid>
            <Grid item md={12} xs={12}>
              <FormControl className="patients__info">
                <TextField
                  id="outlined-basic"
                  helperText="Date Treated"
                  variant="outlined"
                  type="date"
                  className="patients__info"
                  onChangeCapture={(e) => setDateTreated(e.target.value)}
                  value={dateTreated}
                />
              </FormControl>
            </Grid>
            <Grid item md={12} xs={12}>
              <FormControl className="patients__info">
                <TextField
                  id="standard-multiline-static"
                  label="Findings/Diagnosis"
                  multiline
                  rows={4}
                  variant="standard"
                  onChangeCapture={(e) => setDiagnosis(e.target.value)}
                  value={diagnosis}
                />
              </FormControl>
            </Grid>
            <Grid item md={12} xs={12}>
              <FormControl className="patients__info">
                <TextField
                  id="standard-multiline-static"
                  label="Treatment/Procedure Done"
                  multiline
                  rows={4}
                  variant="standard"
                  onChangeCapture={(e) => setProcedures(e.target.value)}
                  value={procedures}
                />
              </FormControl>
            </Grid>
          </Grid>

          <Button
            onClick={() => setOpen(false)}
            variant="contained"
            className="patients__modalButton"
          >
            Save
          </Button>
        </Box>
      </Modal>
      {/* End of Modal */}
      <div className="container generatePayment__container">
        <Button
          type="button"
          color="success"
          variant="contained"
          onClick={generateForm}
          className="generatePayment__generateButton"
        >
          Generate
        </Button>
        <Button
          type="button"
          variant="contained"
          className="generatePayment__inputButton"
          onClick={handleOpen}
        >
          Input
        </Button>
        <div id="form__container">
          <h3 class="text-center bold-text">ST JUDE DENTAL CLINIC</h3>
          <p class="text-center">Malvar St Tacurong City</p>
          <p class="text-center">Sultan Kudarat</p>
          <p class="text-center">Tel #: 064-200-3686</p>
          <h3 class="text-center bold-text">Dental Certificate</h3>
          <div class="dentalForm__container">
            <div class="dateRight">
              Date:&nbsp; <span>{formatDate()}</span>
            </div>
            <div class="toWhom bold-text">To whom It My Concern:</div>
            <div class="body">
              &nbsp;&nbsp;&nbsp; This is to certify that &nbsp;
              {name} ,&nbsp; {age} year old, resident of {resident}
              was <br />
              &nbsp;&nbsp;&nbsp; examined/treated in this clinic on &nbsp;{" "}
              {dateTreated}
            </div>
            <div class="findings">
              <p className="bold-text">FINDINGS/DIAGNOSIS:</p>
              <p>{diagnosis}</p>
            </div>
            <div class="treatment">
              <p className="bold-text">TREATMENT/PROCEDURES DONE:</p>
              <p>{procedures}</p>
            </div>
            <br />
            <br />
            <div class="dentist_container">
              <h6 className="bold-text">MA. JOSELA LAVALLE-DEFENSOR, D.M.D</h6>

              <p class="dentist ">Dentis</p>
            </div>
            <br />
            <div class="license__contaienr">
              <p>License No. 0035946</p>
              <p>PTR No. ______</p>
            </div>
            <br />
          </div>
        </div>
      </div>
    </>
  );
}

export default GeneratePayment;
