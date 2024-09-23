import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { Link, NavLink } from "react-router-dom";
import { useContext } from "react";
import UserContext from "../context/UserContext";

export default function AppNavbar() {
  const { user } = useContext(UserContext);

  return (
    <Navbar expand="lg" className="bg-light">
      <Container className="ms-0">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" exact="true">The Zuitt Shop</Nav.Link>
            <Nav.Link as={NavLink} to="/products" exact="true">Products</Nav.Link>


            {(user.id !== null) ? 
                  (user.isAdmin == true)
                   ?
                <>
                  
                  <Nav.Link as={Link} to="/logout">Logout</Nav.Link>
                </>
                : 
                <>
                  <Nav.Link as={Link} to="/cart">Cart</Nav.Link>  
                  <Nav.Link as={Link} to="/profile" exact="true">Profile</Nav.Link>
                  <Nav.Link as={Link} to="/orders" exact="true">Orders</Nav.Link> 
                  <Nav.Link as={NavLink} to="/logout">Logout</Nav.Link>
                </>          
               : 
              <>
                <Nav.Link as={NavLink} to="/login" exact="true">Login</Nav.Link>
                <Nav.Link as={NavLink} to="/register" exact="true">Register</Nav.Link>
              </>
            }
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}