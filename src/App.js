import { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AppNavbar from './components/AppNavbar';
import Home from './pages/Home';
import Products from './pages/Products';
import Register from './pages/Register';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Profile from './pages/Profile';
import ProductsView from './pages/ProductsView';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import { UserProvider } from './context/UserContext';

function App() {
    const [user, setUser] = useState({
        id: null,
        email: null,
        firstName: null,
        lastName: null,
        mobileNo: null,
        isAdmin: null
    });

    // Function to retrieve user details
    const retrieveUserDetails = async (token) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/users/details`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }

            const data = await response.json();
            setUser({
                id: data._id,
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                mobileNo: data.mobileNo,
                isAdmin: data.isAdmin
            });
        } catch (error) {
            console.error('Error fetching user details:', error);
            setUser({
                id: null,
                email: null,
                firstName: null,
                lastName: null,
                mobileNo: null,
                isAdmin: null
            });
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            retrieveUserDetails(token);
        }
    }, []);

    return (
        <UserProvider value={{ user, setUser }}>
            <Router>
                <AppNavbar />
                <Container>
                    <Routes>
                       <Route path = "/" element={ <Home /> } />
                                  <Route path = "/products" element={ <Products /> } />
                                  <Route path = "/product/:productId" element={ <ProductsView /> } /> 
                                  <Route path = "/profile" element={ <Profile /> } />
                                  <Route path = "/register" element={ <Register /> } />
                                  <Route path = "/cart" element={ <Cart /> } />
                                  <Route path = "/orders" element= { <Orders /> } />
                                  <Route path = "/login" element={ <Login /> } />
                                  <Route path = "/logout" element={ <Logout /> } />
                    </Routes>
                </Container>
            </Router>
        </UserProvider>
    );
}

export default App;
