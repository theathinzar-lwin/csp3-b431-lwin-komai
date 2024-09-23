import { useState, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Navigate, useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext';
import { Notyf } from 'notyf';

export default function AddProduct() {
    const notyf = new Notyf();
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");

    const createProduct = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/products/`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name, description, price })
            });

            const data = await response.json();

            if (response.ok) {
                setName("");
                setDescription("");
                setPrice("");
                notyf.success("Product Creation Successful");
                navigate("/products");
            } else {
                if (data.message === "Product already exists") {
                    notyf.error("Error: Product already exists.");
                } else {
                    notyf.error("Error: Something Went Wrong.");
                }
            }
        } catch (error) {
            console.error("Error:", error);
            notyf.error("Error: Something Went Wrong.");
        }
    };

    if (user.isAdmin === false) {
        return <Navigate to="/products" />;
    }

    return (
        <>
            <h1 className="my-5 text-center">Add Product</h1>
            <Form onSubmit={createProduct}>
                <Form.Group controlId="formProductName">
                    <Form.Label>Name:</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter Name"
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                </Form.Group>
                <Form.Group controlId="formProductDescription">
                    <Form.Label>Description:</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter Description"
                        required
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    />
                </Form.Group>
                <Form.Group controlId="formProductPrice">
                    <Form.Label>Price:</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Enter Price"
                        required
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                    />
                </Form.Group>
                <Button variant="primary" type="submit" className="my-5">Submit</Button>
            </Form>
        </>
    );
}
