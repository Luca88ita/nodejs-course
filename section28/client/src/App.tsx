import { useState, useEffect, FormEvent, useCallback } from "react";
import { Outlet, useNavigate, Route, Routes } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";

import Layout from "./components/Layout/Layout";
import Backdrop from "./components/Backdrop/Backdrop";
import Toolbar from "./components/Toolbar/Toolbar";
import MainNavigation from "./components/Navigation/MainNavigation/MainNavigation";
import MobileNavigation from "./components/Navigation/MobileNavigation/MobileNavigation";
import ErrorHandler from "./components/ErrorHandler/ErrorHandler";
import FeedPage from "./pages/Feed/Feed";
import SinglePostPage from "./pages/Feed/SinglePost/SinglePost";
import LoginPage from "./pages/Auth/Login";
import SignupPage from "./pages/Auth/Signup";
import "./App.css";
import { Credentials, SignupForm } from "./util/types";
import Queries from "./gql/queries";
import { InputMaybe, UserInputData } from "./__generated__/graphql";

const App = () => {
  const navigate = useNavigate();

  const [showBackdrop, setShowBackdrop] = useState<boolean>(false);
  const [showMobileNav, setShowMobileNav] = useState<boolean>(false);
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [token, setToken] = useState<string>("");
  //const [userId, setUserId] = useState<string>("");
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [err, setErr] = useState<Error | null>(null);
  /* const [userInput, setUserInput] = useState<InputMaybe<UserInputData>>({
    email: "",
    password: "",
    name: "",
  }); */
  const userInput: InputMaybe<UserInputData> | undefined = {
    email: "",
    password: "",
    name: "",
  };

  const [createUser, { error, data }] = useMutation(Queries.signupQuery, {
    variables: {
      userInput,
    },
  });

  const logoutHandler = useCallback(() => {
    setIsAuth(false);
    setToken("");
    localStorage.removeItem("token");
    localStorage.removeItem("expiryDate");
    localStorage.removeItem("userId");
    navigate("/");
  }, [navigate]);

  const setAutoLogout = useCallback(
    (milliseconds: number) => {
      setTimeout(() => {
        logoutHandler();
      }, milliseconds);
    },
    [logoutHandler]
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    const expiryDate = localStorage.getItem("expiryDate");
    if (!token || !expiryDate) {
      return;
    }
    if (new Date(expiryDate) <= new Date()) {
      logoutHandler();
      return;
    }
    //const userId = localStorage.getItem("userId");
    const remainingMilliseconds =
      new Date(expiryDate).getTime() - new Date().getTime();
    setIsAuth(true);
    setToken(token);
    //setUserId(userId!);
    setAutoLogout(remainingMilliseconds);
  }, [logoutHandler, setAutoLogout]);

  const mobileNavHandler = (isOpen: boolean) => {
    setShowMobileNav(isOpen);
    setShowBackdrop(isOpen);
  };

  const backdropClickHandler = () => {
    setShowBackdrop(false);
    setShowMobileNav(false);
    setErr(null);
  };

  const loginHandler = (
    event: FormEvent<HTMLFormElement>,
    authData: Credentials
  ) => {
    event.preventDefault();
    setAuthLoading(true);
    fetch("http://localhost:8080/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: authData.email,
        password: authData.password,
      }),
    })
      .then((res) => {
        if (res.status === 422) {
          throw new Error("Validation failed.");
        }
        if (res.status !== 200 && res.status !== 201) {
          console.log("Error!");
          throw new Error("Could not authenticate you!");
        }
        return res.json();
      })
      .then((resData) => {
        setIsAuth(true);
        setToken(resData.token);
        setAuthLoading(false);
        //setUserId(resData.userId);
        localStorage.setItem("token", resData.token);
        localStorage.setItem("userId", resData.userId);
        const remainingMilliseconds = 60 * 60 * 1000;
        const expiryDate = new Date(
          new Date().getTime() + remainingMilliseconds
        );
        localStorage.setItem("expiryDate", expiryDate.toISOString());
        setAutoLogout(remainingMilliseconds);
      })
      .catch((err: Error) => {
        console.log(err);
        setIsAuth(false);
        setAuthLoading(false);
        setErr(err);
      });
  };

  const signupHandler = (
    event: FormEvent<HTMLFormElement>,
    authData: SignupForm
  ) => {
    event.preventDefault();
    setAuthLoading(true);
    userInput.email = authData.email.value;
    userInput.name = authData.name.value;
    userInput.password = authData.password.value;

    createUser()
      .then((resData) => {
        //console.log(resData);
        setIsAuth(false);
        setAuthLoading(false);
        navigate("/");
      })
      .catch((err: Error) => {
        //console.log(err);
        setIsAuth(false);
        setAuthLoading(false);
        setErr(err);
      });
  };

  return (
    <div>
      {showBackdrop && <Backdrop onClick={backdropClickHandler} />}
      <ErrorHandler error={err} onHandle={() => setErr(null)} />
      <Layout
        header={
          <Toolbar>
            <MainNavigation
              onOpenMobileNav={() => mobileNavHandler(true)}
              onLogout={logoutHandler}
              isAuth={isAuth}
            />
          </Toolbar>
        }
        mobileNav={
          <MobileNavigation
            open={showMobileNav}
            mobile
            onChooseItem={() => mobileNavHandler(false)}
            onLogout={logoutHandler}
            isAuth={isAuth}
          />
        }
      />
      <Routes>
        <Route path="/" element={<Outlet />} />
        <Route
          index
          element={
            isAuth ? (
              <FeedPage token={token} />
            ) : (
              <LoginPage onLogin={loginHandler} loading={authLoading} />
            )
          }
        />
        <Route
          path="/signup"
          element={
            <SignupPage onSignup={signupHandler} loading={authLoading} />
          }
        />
        <Route path="/:postId" element={<SinglePostPage token={token} />} />
      </Routes>
    </div>
  );
};

export default App;
