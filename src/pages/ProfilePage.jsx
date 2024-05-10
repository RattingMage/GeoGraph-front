import React, {useContext} from 'react';
import AuthContext from "../context/AuthContext";

const ProfilePage = () => {
    let {user} = useContext(AuthContext)

    return (
        <div>
            <h1>{user.user_id}</h1>
            <h1>{user.username}</h1>
            <h1>{user.email}</h1>
        </div>
    );
};

export default ProfilePage;