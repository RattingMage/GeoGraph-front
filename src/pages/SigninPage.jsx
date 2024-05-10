import React, {useContext} from 'react';
import AuthContext from "../context/AuthContext";

const SigninPage = () => {
    let {signinUser} = useContext(AuthContext)
    return (
        <div>
            <h1>Sign in</h1>
            <form onSubmit={signinUser}>
                <input type="text" name="username" placeholder="Enter Username"/>
                <input type="password" name="password" placeholder="Enter Password"/>
                <input type="submit"/>
            </form>
        </div>
    );
};

export default SigninPage;