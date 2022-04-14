import { Button, FormControl, TextField } from "@mui/material";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/Signup.css";
import axios from "../axios";
import swal from "sweetalert";

function Signup() {
  let navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [pattern, setPattern] = useState(
    new RegExp(
      /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
    )
  );
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
      swal("Error", "Password does not match");
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
          is_secretary: false,
        })
        .then((res) => {
          axios
            .post(
              `/auth/user-email-and-password/`,
              { email: email, password: password },
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
            }, 1000)
          );
          navigate("/login");
        })
        .catch((err) => {
          console.log(err);
          setError("Email Already Exist");
        });
    }
  };
  return (
    <div className="signup">
      <div className="signup__container">
        <h1 className="signup__h1">Sign Up</h1>
        <form>
          <FormControl className="patients__info">
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
          <FormControl className="patients__info">
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
          <FormControl className="patients__info">
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
          <FormControl className="patients__info">
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
          <FormControl className="patients__info">
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
          <FormControl className="patients__info">
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
            className="signup__signUpButton"
          >
            Sign Up
          </Button>
        </form>
        <br />
        <p>
          Already have an Account?{" "}
          <Link to="/login">
            <span>Login</span>
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
