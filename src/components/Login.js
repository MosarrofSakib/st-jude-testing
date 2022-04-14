import { Button, FormControl, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../axios";
import { useDispatch } from "react-redux";
import { setToken, setActiveUser } from "../features/userSlice";
import "../css/Login.css";
import swal from "sweetalert";

function Login() {
  const dispatch = useDispatch();
  let navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pattern, setPattern] = useState(
    new RegExp(
      /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
    )
  );

  useEffect(() => {
    axios.get("/auth/users/").then((res) => {
      console.log(res.data);
      setAccounts(res.data);
    });
  }, []);
  const handleLogin = (e) => {
    e.preventDefault();
    if (email === "" || password === "") {
      swal("Error", `Fill All the Fields`, "error").then(
        setTimeout(() => {
          window.location.reload(false);
        }, 1300)
      );
    } else if (!pattern.test(email)) {
      swal("Error", `Invalid Email`, "error").then(
        setTimeout(() => {
          window.location.reload(false);
        }, 1300)
      );
    } else {
      axios
        .post("/api/v1/token/login/", {
          email: email,
          password: password,
        })
        .then((res) => {
          console.log(res.data);
          dispatch(
            setToken({
              token: res.data.auth_token,
            })
          );
          localStorage.setItem("token", res.data.auth_token);

          axios
            .get("/auth/me", {
              headers: {
                Authorization: `Token ${res.data.auth_token}`,
              },
            })
            .then((response) => {
              console.log(response.data);
              localStorage.setItem("user", response.data);
              dispatch(
                setActiveUser({
                  user: response.data,
                })
              );
            });
          navigate("/");
        })

        .catch((error) => {
          setError("Invalid Credentials");
        });
    }
  };
  return (
    <div className="login">
      <div className="login__container">
        <p className="login__error">{error}</p>
        <h1 className="login__h1">Login</h1>
        <form>
          <FormControl className="patients__info">
            <TextField
              id="outlined-basic"
              variant="outlined"
              label="Email Address"
              type="email"
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
          <Button
            onClick={handleLogin}
            type="submit"
            variant="contained"
            className="login__loginButton"
          >
            Login
          </Button>
        </form>
        <br />
        {accounts?.length === 0 ? (
          <p>
            Don't have an Account?{" "}
            <Link to="/signup">
              <span>Sign Up</span>
            </Link>
          </p>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default Login;
