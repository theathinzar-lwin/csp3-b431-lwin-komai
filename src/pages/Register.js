import { useState, useEffect, useContext } from 'react';  
import { Form, Button } from 'react-bootstrap';
import UserContext from '../context/UserContext'; 
import { Navigate } from 'react-router-dom'; 
import { Notyf } from 'notyf'; 
import 'notyf/notyf.min.css'; 

export default function Register() {
  const notyf = new Notyf(); 
  const { user } = useContext(UserContext);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (
      firstName !== "" &&
      lastName !== "" &&
      email !== "" &&
      mobileNo !== "" &&
      password !== "" &&
      confirmPassword !== "" &&
      password === confirmPassword
    ) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [firstName, lastName, email, mobileNo, password, confirmPassword]);

  function registerUser(e) {
    e.preventDefault();

    fetch(`${process.env.REACT_APP_API_URL}/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        mobileNo,
        password,
      }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.message === "User registered successfully") {
          notyf.success("Registration successful");

          setFirstName("");
          setLastName("");
          setEmail("");
          setMobileNo("");
          setPassword("");
          setConfirmPassword("");
        } else if (data.message === "Email invalid") {
          notyf.error("Email is invalid");
        } else if (data.message === "Mobile number is invalid") {
          notyf.error("11 Digit Number is Required");
        } else if (data.message === "Password must be at least 8 characters long") {
          notyf.error("Password must be at least 8 characters");
        } else {
          notyf.error("Something went wrong");
        }
      });
  }

  // Handle redirection when user is logged in
  if (user && user.id) {
    return <Navigate to="/products" />;
  }

  return (
    <Form onSubmit={(e) => registerUser(e)}>
      <h1 className="my-5 text-center">Register</h1> 
      <Form.Group>
        <Form.Label>First Name:</Form.Label>
        <Form.Control 
          type="text" 
          placeholder="Enter First Name" 
          required 
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Last Name:</Form.Label>
        <Form.Control 
          type="text" 
          placeholder="Enter Last Name" 
          required 
          value={lastName}
          onChange={e => setLastName(e.target.value)}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Email:</Form.Label>
        <Form.Control 
          type="email" 
          placeholder="Enter Email" 
          required 
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Mobile No.:</Form.Label>
        <Form.Control 
          type="text" 
          placeholder="Enter Mobile Number" 
          required 
          value={mobileNo}
          onChange={e => setMobileNo(e.target.value)}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Password:</Form.Label>
        <Form.Control 
          type="password" 
          placeholder="Enter Password" 
          required 
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Confirm Password:</Form.Label>
        <Form.Control 
          type="password" 
          placeholder="Confirm Password" 
          required 
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
        />
      </Form.Group>
      
      <Button 
        variant={isActive ? "primary" : "danger"} 
        type="submit" 
        disabled={!isActive}
      >
        Submit
      </Button>
    </Form>
  );
}
