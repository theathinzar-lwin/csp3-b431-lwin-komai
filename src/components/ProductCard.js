import { Card, Button } from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProductCard({ productProp }) {
    if (!productProp) {
        return <p>Product data is not available.</p>;
    }

    const { _id, name, description, price } = productProp;
    const [count, setCount] = useState(1); // Initialize count to 1
    const navigate = useNavigate();

    const addToCart = async () => {
        // Validate count
        if (count <= 0) {
            alert("Quantity must be at least 1.");
            return;
        }

        const subtotal = count * price; // Calculate subtotal
        const token = localStorage.getItem('token'); // Get the token from local storage

        // Check if the user is logged in
        if (!token) {
            alert('Please log in first to add items to the cart.');
            navigate('/login'); // Redirect to login page
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/cart/add-to-cart`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}` // Include token since user is logged in
                },
                body: JSON.stringify({
                    productId: _id,
                    quantity: count,
                    subtotal: subtotal, // Send subtotal
                    totalPrice: subtotal // Send totalPrice
                })
            });

            if (!response.ok) {
                if (response.status === 401) { // Check for unauthorized status
                    alert('Failed to add item to cart. Please Login.');
                    navigate('/login'); // Redirect to login page
                } else {
                    const errorText = await response.text();
                    throw new Error(errorText);
                }
            } else {
                navigate('/cart'); // Redirect to cart page after adding the item
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('An error occurred while adding the item to the cart.'); // Optional user feedback
        }
    };

    return (
        <Card>
            <Card.Body>
                <Card.Title>{name}</Card.Title>
                <Card.Subtitle>Description:</Card.Subtitle>
                <Card.Text>{description}</Card.Text>
                <Card.Subtitle>Price:</Card.Subtitle>
                <Card.Text>{price}</Card.Text>
                <Button onClick={addToCart} variant="primary">Add to Cart</Button>
            </Card.Body>
        </Card>
    );
}
