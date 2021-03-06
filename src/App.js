import React from "react";
import "./App.css";
import themeFile from "./util/theme";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import jwtDecode from "jwt-decode";

//REDUX
import { Provider } from "react-redux";
import store from "./redux/store";
import { SET_AUTHENTICATED } from "./redux/types";
import { logoutUser, getUserData } from "./redux/actions/userActions";

//components
import Navbar from "./components/layout/Navbar";
import AuthRoute from "./util/AuthRoute";
import Home from "./components/layout/Home";
import Login from "./components/layout/Login";
import Signup from "./components/layout/Signup";
import User from "./components/layout/User";
import axios from "axios";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DayjsUtils from "@date-io/dayjs";

const theme = createMuiTheme(themeFile);

axios.defaults.baseURL = "https://europe-west3-mivkbp.cloudfunctions.net/api";

const token = localStorage.FbIdToken;
if (token) {
  const decodedToken = jwtDecode(token);
  if (decodedToken.exp * 1000 < Date.now()) {
    store.dispatch(logoutUser());
    window.location.href = "/login";
  } else {
    store.dispatch({ type: SET_AUTHENTICATED });
    axios.defaults.headers.common["Authorization"] = token;
    store.dispatch(getUserData());
  }
}

function App() {
  return (
    <MuiPickersUtilsProvider utils={DayjsUtils}>
      <MuiThemeProvider theme={theme}>
        <Provider store={store}>
          <Router>
            <Navbar />
            <div className="container">
              <Switch>
                <Route exact path="/" component={Home}></Route>
                <AuthRoute exact path="/login" component={Login} />
                <AuthRoute exact path="/signup" component={Signup} />
                <Route exact path="/users/:username" component={User} />
                <Route
                  exact
                  path="/users/:username/scream/:screamId"
                  component={User}
                />
              </Switch>
            </div>
          </Router>
        </Provider>
      </MuiThemeProvider>
    </MuiPickersUtilsProvider>
  );
}

export default App;
