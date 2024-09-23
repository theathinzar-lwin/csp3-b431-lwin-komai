import {useState, useEffect, useContext} from 'react';
import UserContext from "../context/UserContext";

import {Container, Card, Button, Row, Col} from "react-bootstrap";
import {useParams, useNavigate, Link} from "react-router-dom";
import { Notyf } from 'notyf'; 
import 'notyf/notyf.min.css';

export default function ProductView(){

  const notyf = new Notyf(); 

  const {productId} = useParams(); 
  const navigate = useNavigate();

  const {user} = useContext(UserContext);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);


  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/products/${productId}`)
    .then(res=> res.json())
    .then(data => {
      console.log(data);
      setName(data.name);
      setDescription(data.description);
      setPrice(data.price);
    });
  }, [productId]);


  function enroll(productId){
    fetch(`${process.env.REACT_APP_API_URL}/users/details`, {
      method: "POST",
      headers: {
        "Content-Type" : "application/json",
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        enrolledProducts: [{productId}],
        totalPrice: price
      })
    })
    .then(res=>res.json())
    .then(data => {

      console.log(data.message);
      if(data.message === "Admin is forbidden"){
        notyf.error("Admin Forbidden"); 
      }
      else if(data.message === "Enrolled successfully"){
        notyf.success("Enrollment successfully");
        navigate("/products"); 
      }
      else{
        notyf.error("Internal Server Error. Notify System Admin"); 
      }

    })
  }


  return( 
    <Container className="mt-5">
      <Row>
        <Col lg={{span:6, offset:3}}>
          <Card>
            <Card.Body className="text-center">
              <Card.Title>{name}</Card.Title>

              <Card.Subtitle>Description:</Card.Subtitle>
              <Card.Text>{description}</Card.Text>

              <Card.Subtitle>Price:</Card.Subtitle>
              <Card.Text>Php{price}</Card.Text>


              <Card.Subtitle>Class Schedule:</Card.Subtitle>
              <Card.Text>8am - 5pm</Card.Text>

              {/*conditinal rendering*/}
              {user.id !== null? 
                <Button varian="primary" block="true" onClick={()=>enroll(productId)}>Enroll</Button>
                :
                <Link className="btn btn-danger" to="/login">Log In to Enroll </Link>

              }
            </Card.Body>
          </Card>
        </Col>
      </Row>

    </Container>
  );
}