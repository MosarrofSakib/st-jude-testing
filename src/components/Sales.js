import {
  Button,
  FormControl,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import axios from "../axios";
import React, { useEffect, useState } from "react";
import "../css/Sales.css";

function Sales() {
  const todaysDate = new Date();
  const [payments, setPayments] = useState([]);
  const [breakdowns, setBreakdowns] = useState([]);
  const [combine, setCombine] = useState(payments.concat(breakdowns));

  useEffect(() => {
    axios
      .get("/api/payments", {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setPayments(res.data);
      });
    //breakdowns
    axios
      .get("/api/breakdowns", {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setBreakdowns(res.data);
      });
  }, []);
  console.log("payments: ", payments);
  console.log("breakdowns: ", breakdowns);

  // let combine = payments.concat(breakdowns);

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
  const [selectDate, setSelectDate] = useState(formatDate());

  const filterSales = () => {
    return payments.filter((payment) => {
      return payment.date === selectDate;
    });
  };

  const filterBreakdown = () => {
    return breakdowns.filter((val) => {
      return val.date_paid === selectDate;
    });
  };

  const totalEarn1 = () => {
    return filterSales()?.reduce((currentTotal, item) => {
      return item.payment + currentTotal;
    }, 0);
  };
  const totalEarn2 = () => {
    return filterBreakdown()?.reduce((currentTotal, item) => {
      return item.amount + currentTotal;
    }, 0);
  };

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={12} lg={12}>
        <FormControl className="viewPatient__dateField">
          <TextField
            id="outlined-basic"
            variant="outlined"
            type="date"
            className="patients__info"
            onChange={(e) => setSelectDate(e.target.value)}
            value={selectDate}
          />
        </FormControl>
        <h1 className="sales__h1">
          Total Sales: ₱{numberWithCommas(totalEarn1() + totalEarn2())}
        </h1>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: "100%" }}>
            <TableHead className="viewPatient__tableHead">
              <TableRow>
                <TableCell align="center" className="viewPatient__tableCell">
                  Name
                </TableCell>
                <TableCell align="center" className="viewPatient__tableCell">
                  Description
                </TableCell>

                <TableCell align="center" className="viewPatient__tableCell">
                  Amount
                </TableCell>
                <TableCell align="center" className="viewPatient__tableCell">
                  Check Number
                </TableCell>
                <TableCell align="center" className="viewPatient__tableCell">
                  Payment
                </TableCell>
                <TableCell align="center" className="viewPatient__tableCell">
                  Balance
                </TableCell>
                <TableCell align="center" className="viewPatient__tableCell">
                  Process By
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filterSales()?.map((val) => (
                <>
                  <TableRow
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                    key={val.id}
                  >
                    <TableCell align="center">
                      {val.patient.first_name} {val.patient.middle_name}.{" "}
                      {val.patient.last_name}
                    </TableCell>
                    <TableCell align="center">{val.description.name}</TableCell>
                    <TableCell align="center">{val.amount}</TableCell>
                    <TableCell align="center">{val.check_number}</TableCell>
                    <TableCell align="center">{val.payment}</TableCell>
                    <TableCell align="center">
                      {val.balance === 0 ? "Paid" : val.balance}
                    </TableCell>
                    <TableCell align="center">{val.process_by}</TableCell>
                  </TableRow>
                </>
              ))}
              {filterBreakdown()?.map((val) => (
                <>
                  <TableRow
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                    key={val.id}
                  >
                    <TableCell align="center">
                      {val.process_payments.patient.first_name}{" "}
                      {val.process_payments.patient.middle_name}.{" "}
                      {val.process_payments.patient.last_name}
                    </TableCell>
                    <TableCell align="center">
                      {val.process_payments.description.name}
                    </TableCell>
                    <TableCell align="center">
                      {val.process_payments.amount}
                    </TableCell>
                    <TableCell align="center">{val.check_number}</TableCell>
                    <TableCell align="center">{val.amount}</TableCell>
                    <TableCell align="center">
                      {val.process_payments.balance === 0
                        ? "Paid"
                        : val.process_payments.balance}
                    </TableCell>
                    <TableCell align="center">{val.process_by}</TableCell>
                  </TableRow>
                </>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
}

export default Sales;
