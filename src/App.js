import "./App.css";
// react redux
import { useSelector, useDispatch } from "react-redux";
import {
  selectUser,
  selectToken,
  setActiveUser,
  setUserLogoutState,
  setToken,
} from "./features/userSlice";

// react router dom
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
// components
import Login from "./components/Login.js";
import Signup from "./components/Signup.js";
import Dashboard from "./components/Dashboard";
//axios
import axios from "./axios";

function App() {
  const token = useSelector(selectToken);
  const dispatch = useDispatch();

  useEffect(() => {
    let isMounted = true;

    if (localStorage.getItem("token")) {
      if (isMounted) {
        axios
          .get("/auth/me", {
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
          })
          .then((response) => {
            console.log("User is: ", response.data);
            dispatch(
              setActiveUser({
                user: response.data,
              })
            );
          });
      }
    } else {
      return () => {
        isMounted = false;
      };
    }
  }, [dispatch]);
  return (
    <Router>
      <>
        {!token ? (
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        ) : (
          <div className="app">
            <Dashboard />
          </div>
        )}
      </>
    </Router>
  );
}

export default App;
