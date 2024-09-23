import { useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import UserContext from "../context/UserContext";

export default function Logout() {
    const { setUser } = useContext(UserContext);

    useEffect(() => {
          setUser({
            id: null,
            email: null,
            firstName: null,
            lastName: null,
            mobileNo: null,
            isAdmin: null
        });
        
        // Optionally remove token from localStorage
        localStorage.removeItem('token');
    }, [setUser]);

    return <Navigate to='/login' />;
}
