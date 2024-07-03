import React, {useState} from "react";
import LoginPage from "./LoginPage";

const Login = (props) => {
    return (<div className="Login">
        <LoginPage userHandler={props.userHandler}
        />
    </div>);
};

export default Login;