import React, { useState, useEffect } from "react";
import { debounce } from "lodash";
import { makeStyles } from "@material-ui/core/styles";
import { Paper, Typography } from "@material-ui/core";
import swal from "@sweetalert/with-react";

import { authService, dbService } from "../firebase";
import LandingLogin from "../components/LandingLogin";
import LandingRegister from "../components/LandingRegister";
import LandingImage from "../assets/image/paper.jpeg";

const useStyles = makeStyles((theme) => ({
  root: {
    background: `url(${LandingImage}) center center / cover no-repeat`,
    width: "100%",
    display: "flex",
    flexWrap: "wrap",
    boxSizing: "border-box",
    alignContent: "space-around",
    justifyContent: "center",
    "@media (max-width:970px)": {
      flexDirection: "column-reverse",
      "& > div > h1": {
        margin: "0 0 30px 0 !important",
        fontSize: "3em",
      },
    },
    "@media (max-height:517px)": {
      height: "auto !important",
    },
  },
  paper: {
    width: "350px",
    height: "auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "0 30px 15px 30px",
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  up: {
    textAlign: "center",
  },
  titleBox: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#e53935",
    marginLeft: "50px",
    fontFamily: "FingerPaint",
    height: "fit-content",
    padding: "15px",
  },
}));

function Landing() {
  const classes = useStyles();
  const init = {
    email: "",
    password: "",
    name: "",
    department: "",
  };
  const [inputs, setInputs] = useState(init);
  const [newAccount, setNewAccount] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = debounce(() => {
      setWindowWidth(window.innerWidth);
    }, 100);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });

  const onChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;

    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!newAccount) {
        await authService
          .setPersistence("session")
          .then(() =>
            authService
              .createUserWithEmailAndPassword(inputs.email, inputs.password)
              .then((userCredential) => {
                // send verification mail.
                const userInfoObj = {
                  department: inputs.department,
                  email: inputs.email,
                  name: inputs.name,
                };
                dbService.collection("userInfo").add(userInfoObj);
                userCredential.user.sendEmailVerification();
                authService.signOut();
              })
          )
          .catch(alert);
      } else {
        await authService
          .setPersistence("session")
          .then(() => {
            authService
              .signInWithEmailAndPassword(inputs.email, inputs.password)
              .catch((error) => {
                // Handle Errors here.
                swal({
                  title: "잘못된 이메일 또는 비밀번호입니다.",
                  buttons: { cancel: "닫기" },
                });
              });
          })
          .catch((error) => {
            // Handle Errors here.
            alert(error);
          });
      }
      setInputs(init);
    } catch (err) {
      alert(err.message);
    }
  };

  const toggleAccount = () => {
    setInputs(init);
    setNewAccount((prev) => !prev);
  };
  console.log(windowWidth);
  return (
    <div
      className={classes.root}
      style={{
        height: `${
          !newAccount && windowWidth <= 625 ? "auto" : "100vh"
        }`,
      }}
    >
      <Paper className={classes.paper}>
        {!newAccount ? (
          <LandingRegister
            userinput={inputs}
            onch={onChange}
            submit={handleSubmit}
          />
        ) : (
          <LandingLogin
            userinput={inputs}
            onch={onChange}
            submit={handleSubmit}
          />
        )}
        <span
          style={{ color: "blue", cursor: "pointer" }}
          onClick={toggleAccount}
        >
          {!newAccount ? "계정이 있어요" : "계정이 없어요"}
        </span>
        <span onClick={toggleAccount}></span>
      </Paper>
      <div className={classes.titleBox}>
        <Typography component="h1" variant="h2" className={classes.title}>
          KNU
          <span style={{ color: "black" }}>HOUSE</span>
        </Typography>
      </div>
    </div>
  );
}

export default Landing;
