import React, { useEffect, useState } from "react";
import "../css/Treatment.css";
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

function Treatments() {
  const [name, setName] = useState("");
  const [treatments, setTreatments] = useState([]);
  const [editName, setEditName] = useState("");
  const [nameId, setNameId] = useState("");
  // for modal add treatment
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  //for modal edit treatment
  const [editOpen, setEditOpen] = useState(false);
  const editHandleOpen = () => setEditOpen(true);
  const editHandleClose = () => setEditOpen(false);
  const [searchItem, setSearchItem] = useState("");

  useEffect(() => {
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

  const handleEditTreatment = () => {
    console.log(nameId);
    console.log(editName);
    axios
      .put(
        `/api/treatments/${nameId}/`,
        { name: editName },
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        swal("Success", ` Edit Successfull`, "success").then(
          setTimeout(() => {
            window.location.reload(false);
          }, 1000)
        );
      });
  };

  const handleEditName = (id) => {
    axios
      .get(`/api/treatments/${id}/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setEditName(res.data.name);
        setNameId(res.data.id);
        setEditOpen(true);
      });
  };

  const handleAddTreatment = (e) => {
    e.preventDefault();
    if (name === "") {
      swal("Error", "Add Treatment Name", "warning");
    } else {
      const form = {
        name: name.toLowerCase(),
      };

      axios
        .post("/api/treatments/", form, {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          swal("Success", `Treatment Added Successful`, "success").then(
            setTimeout(() => {
              window.location.reload(false);
            }, 1000)
          );
        });
    }
  };

  const handleDeleteTreatment = (id, name) => {
    axios
      .delete(`/api/treatments/${id}/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        swal("Success", `${name} Deleted Successfull`, "success").then(
          setTimeout(() => {
            window.location.reload(false);
          }, 1000)
        );
      });
  };

  return (
    <>
      {/* Modal for add Treatment */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="treatments__box">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Treatment
          </Typography>
          <br />
          <Grid container spacing={2}>
            <Grid item md={12} xs={12}>
              <FormControl className="treatments__info">
                <TextField
                  id="outlined-basic"
                  label=" Name"
                  variant="outlined"
                  type="text"
                  className="treatments__info"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  required
                />
              </FormControl>
            </Grid>
          </Grid>

          <Button
            type="button"
            onClick={handleAddTreatment}
            variant="contained"
            className="treatments__modalButton"
          >
            Add
          </Button>
        </Box>
      </Modal>
      {/* End of Modal for Add Treatment */}

      {/* Modal for Edit Treatment */}
      <Modal
        open={editOpen}
        onClose={editHandleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="treatments__box">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Edit Treatment
          </Typography>
          <br />
          <Grid container spacing={2}>
            <Grid item md={12} xs={12}>
              <FormControl className="treatments__info">
                <TextField
                  id="outlined-basic"
                  label=" Name"
                  variant="outlined"
                  type="text"
                  className="treatments__info"
                  onChange={(e) => setEditName(e.target.value)}
                  value={editName}
                  required
                />
              </FormControl>
            </Grid>
          </Grid>

          <Button
            type="button"
            onClick={() => handleEditTreatment(editName.id, editName.name)}
            variant="contained"
            className="treatments__modalButton"
          >
            Edit
          </Button>
        </Box>
      </Modal>
      {/* End of Modal for Edit Treatment */}
      <Grid container spacing={4} className="treatments__gridForTable">
        <Grid item md={6} xs={12}>
          <TextField
            id="outlined-basic"
            label="Search Treatment"
            variant="outlined"
            className="treatments__input"
            onChange={(e) => setSearchItem(e.target.value)}
          />
        </Grid>
        <Grid item md={6} xs={12} className="treatments__buttonContainer">
          <Button
            variant="contained"
            className="treatments__button"
            onClick={handleOpen}
          >
            Add Treatment
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
                {treatments
                  .filter((val) => {
                    if (searchItem === "") {
                      return val;
                    } else if (
                      val.name.toLowerCase().includes(searchItem.toLowerCase())
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
                          {val.name}
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            variant="contained"
                            color="success"
                            className="treatments__button"
                            onClick={() => handleEditName(val.id)}
                          >
                            Edit
                          </Button>{" "}
                          &nbsp;
                          <Button
                            variant="contained"
                            color="warning"
                            className="treatments__button"
                            onClick={() => handleDeleteTreatment(val.id)}
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

export default Treatments;
