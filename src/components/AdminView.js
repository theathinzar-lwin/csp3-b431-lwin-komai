import { useState, useEffect } from 'react';
import { Table, Button, Container, Modal } from 'react-bootstrap';
import AddProduct from "./AddProduct"; 
import EditProduct from "./EditProduct";
import ArchiveProduct from "./ArchiveProduct";
import Orders from "../pages/Orders";

export default function AdminView({ productsData, fetchData }) {
    const [products, setProducts] = useState([]);
    const [showAddProductModal, setShowAddProductModal] = useState(false);
    const [showOrdersModal, setShowOrdersModal] = useState(false); 

    useEffect(() => {
        setProducts(productsData.map(product => (
            <tr key={product._id}>
                <td>{product._id}</td>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>{product.price}</td>
                <td className={product.isActive ? "text-success" : "text-danger"}>
                    {product.isActive ? "Available" : "Unavailable"}
                </td>
                <td><EditProduct product={product} fetchData={fetchData} /></td>
                <td>
                    <ArchiveProduct 
                        product={product}  // Pass the entire product object
                        isActive={product.isActive} 
                        fetchData={fetchData} 
                    />
                </td>
            </tr>
        )));
    }, [productsData, fetchData]);

    const handleAddProductModalClose = () => setShowAddProductModal(false);
    const handleAddProductModalShow = () => setShowAddProductModal(true);
    const handleOrdersModalClose = () => setShowOrdersModal(false); 
    const handleOrdersModalShow = () => setShowOrdersModal(true); 

    return (
        <Container>
            <h1 className="text-center my-4">Admin Dashboard</h1>
            <div className="d-flex justify-content-center mb-4">
                <Button variant="primary" onClick={handleAddProductModalShow} className="mx-2">
                    Add New Product
                </Button>
                <Button style={{ backgroundColor: 'hotpink', borderColor: 'hotpink' }} onClick={handleOrdersModalShow} className="mx-2">
                    Show User Orders
                </Button>
            </div>

            <Modal show={showAddProductModal} onHide={handleAddProductModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddProduct fetchData={fetchData} onClose={handleAddProductModalClose} />
                </Modal.Body>
            </Modal>

            <Modal size="lg" show={showOrdersModal} onHide={handleOrdersModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>User Orders</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Orders /> 
                </Modal.Body>
            </Modal>

            <Table striped bordered hover responsive>
                <thead>
                    <tr className="text-center">
                        <th>ID</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Availability</th>
                        <th colSpan="2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products}
                </tbody>
            </Table>    
        </Container>
    );
}
