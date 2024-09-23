import { useState, useEffect, useContext } from 'react';
import UserContext from "../context/UserContext";
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Notyf } from 'notyf'; 
import 'notyf/notyf.min.css'; 

export default function Login() {
    const notyf = new Notyf();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isActive, setIsActive] = useState(false);
    const { user, setUser } = useContext(UserContext);

    useEffect(() => {
        if (email !== '' && password !== '') {
            setIsActive(true);
        } else {
            setIsActive(false);
        }
    }, [email, password]);

    useEffect(() => {
        if (user.id) {
            navigate('/products');
        }
    }, [user, navigate]);

    function authenticate(e) {
        e.preventDefault();
        fetch(`${process.env.REACT_APP_API_URL}/users/login`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        })
        .then(res => res.json())
        .then(data => {
            if (data.access) {
                localStorage.setItem('token', data.access);
                retrieveUserDetails(data.access);
                setEmail('');
                setPassword('');
                notyf.success('You are now logged in');
            } else if (data.message === "Incorrect email or password") {
                notyf.error('Incorrect email or password');
            } else {
                notyf.error(`${email} does not exist`);
            }
        });
    }

    function retrieveUserDetails(token) {
        fetch(`${process.env.REACT_APP_API_URL}/users/details`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            if (!res.ok) {
                throw new Error('Network response was not ok.');
            }
            return res.json();
        })
        .then(data => {
            setUser({
                id: data._id,
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                mobileNo: data.mobileNo,
                isAdmin: data.isAdmin
            });
        })
        .catch(error => {
            console.error('Error fetching user details:', error);
        });
    }

    return (
        <>
            <Form onSubmit={authenticate}>
                <h1 className="my-5 text-center">Login</h1>
                <Form.Group>
                    <Form.Label>Email address</Form.Label>
                    <Form.Control 
                        type="email" 
                        placeholder="Enter email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                        type="password" 
                        placeholder="Password" 
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>

                <Button variant="primary" type="submit" id="loginBtn" disabled={!isActive}>
                    Login
                </Button>
            </Form>   

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <span>
                    Please <span 
                        style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }} 
                        onClick={() => navigate('/register')}
                    >
                        register
                    </span> first if you don't have an account yet.
                </span>
            </div>
        </>
    );
}
