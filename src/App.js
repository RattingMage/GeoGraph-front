import React, {Fragment} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import "./style.css";
import TreeDPlot from "./components/TreeDPlot";
import {AuthProvider} from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import ResponsiveAppBar from "./components/ResponsiveAppBar";
import {createTheme, ThemeProvider} from "@mui/material";
import PrivateRoute from "./components/PrivateRoute";
import SigninPage from "./pages/SigninPage";
import ProfilePage from "./pages/ProfilePage";

const darkTheme = createTheme({
    palette: {
        mode: 'light',
    },
});

function App() {
    return (
        <ThemeProvider theme={darkTheme}>
            <Router>
                <Fragment>
                    <AuthProvider>
                        <ResponsiveAppBar/>
                        <Routes>
                            <Route exact path='/' element={<PrivateRoute/>}>
                                <Route exact path='/' element={<TreeDPlot/>}/>
                            </Route>
                            <Route exact path='/home' element={<PrivateRoute/>}>
                                <Route exact path='/home' element={<TreeDPlot/>}/>
                            </Route>
                            <Route exact path='/profile' element={<PrivateRoute/>}>
                                <Route exact path='/profile' element={<ProfilePage/>}/>
                            </Route>
                            <Route path="/login" element={<LoginPage/>}/>
                            <Route path="/signin" element={<SigninPage/>}/>
                        </Routes>
                    </AuthProvider>
                </Fragment>
            </Router>
        </ThemeProvider>
    )
}

export default App;
