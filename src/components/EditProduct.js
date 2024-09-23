import { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

export default function EditProduct({ product, fetchData }) {
    const notyf = new Notyf();

    const [showEdit, setShowEdit] = useState(false);
    const [name, setName] = useState(product.name);
    const [description, setDescription] = useState(product.description);
    const [price, setPrice] = useState(product.price);

    const editProduct = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/products/${product._id}/update`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ name, description, price }),
            });

            const data = await response.json();
            if (response.ok) {
                notyf.success("Successfully Updated");
                fetchData();
                closeEdit();
            } else {
                notyf.error(data.message || "Update failed");
            }
        } catch (error) {
            notyf.error("An error occurred: " + error.message);
        }
    };

    const openEdit = () => setShowEdit(true);
    const closeEdit = () => setShowEdit(false);

    return (
        <>
            <Button variant="primary" size="sm" onClick={openEdit}>Update</Button>

            <Modal show={showEdit} onHide={closeEdit}>
                <Form onSubmit={editProduct}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Product</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <Form.Group controlId="productName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control 
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                required 
                            />
                        </Form.Group>

                        <Form.Group controlId="productDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control 
                                type="text"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                required 
                            />
                        </Form.Group>

                        <Form.Group controlId="productPrice">
                            <Form.Label>Price</Form.Label>
                            <Form.Control 
                                type="number"
                                value={price}
                                onChange={e => setPrice(e.target.value)}
                                required 
                            />
                        </Form.Group>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={closeEdit}>Close</Button>
                        <Button variant="success" type="submit">Submit</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
}
