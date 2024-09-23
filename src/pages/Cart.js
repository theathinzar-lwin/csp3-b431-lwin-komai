import { useEffect, useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Button, Table, Form } from 'react-bootstrap';
import UserContext from '../context/UserContext';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const countLimit = 10; // Maximum quantity limit per item

  useEffect(() => {
    if (!user || !user.id) {
      navigate('/login');
    } else {
      fetchCartItems();
    }
  }, [user, navigate]);

  // Fetches details of a single product using its productId
  const fetchProductDetails = async (productId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch product details for ID ${productId}`);
      }

      const product = await response.json();
      return product || { name: 'Unavailable', price: 0 };
    } catch (error) {
      console.error('Error fetching product details:', error);
      return { name: 'Unavailable', price: 0 };
    }
  };

  // Fetches the cart items for the logged-in user
  const fetchCartItems = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/cart/get-cart`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cart items');
      }

      const data = await response.json();

      if (data && Array.isArray(data.cartItems)) {
        const cartItemsWithDetails = await Promise.all(
          data.cartItems.map(async (item) => {
            const product = await fetchProductDetails(item.productId);
            const subtotal = product.price * item.quantity;
            return {
              ...item,
              productName: product.name || 'Product name not available',
              price: product.price || 0,
              subtotal: subtotal,
            };
          })
        );

        setCartItems(cartItemsWithDetails);
        setTotalPrice(cartItemsWithDetails.reduce((acc, item) => acc + item.subtotal, 0));
      } else {
        setCartItems([]);
        setTotalPrice(0);
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
      setCartItems([]);
      setTotalPrice(0);
    }
  };

  // Handles changes to item quantity in the cart
  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1 || newQuantity > countLimit) {
      alert('Quantity must be between 1 and ' + countLimit);
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/cart/update-cart-quantity`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ productId, quantity: newQuantity }),
      });

      if (response.ok) {
        // Fetch updated cart items to reflect the changes
        fetchCartItems();
      } else {
        const errorText = await response.text();
        console.error('Failed to update quantity:', errorText);
        alert(`Failed to update quantity. Error: ${errorText}`);
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('An error occurred while updating quantity. Please try again.');
    }
  };

  // Handles the removal of an item from the cart
  const handleRemove = async (productId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/cart/${productId}/remove-from-cart`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        fetchCartItems();
      } else {
        const errorText = await response.text();
        console.error('Error removing item:', errorText);
        alert('Failed to remove item. Please try again.');
      }
    } catch (error) {
      console.error('Error removing item:', error);
      alert('Failed to remove item. Please try again.');
    }
  };

  // Clears the entire cart
  const handleClearCart = async () => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/cart/clear-cart`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setCartItems([]);
      setTotalPrice(0);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  // Handles the checkout process
  const handleCheckout = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/orders/checkout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cartItems, totalPrice }),
      });

      if (response.ok) {
        navigate('/orders');
      } else {
        const errorText = await response.text();
        console.error('Error during checkout:', errorText);
        alert('Checkout failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('Checkout failed. Please try again.');
    }
  };

  return (
    <Container>
      <h1 className="my-5 text-center">Your Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <div className="text-center">
          <h5>Your cart is empty.</h5>
          <Link to="/products">
            <Button variant="link" style={{ color: 'blue', textDecoration: 'underline' }}>
              Start Shopping
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item._id}>
                  <td>{item.productName || 'Unavailable'}</td>
                  <td>₱{item.price.toFixed(2)}</td>
                  <td>
                    <Form.Control
                      type="number"
                      min="1"
                      max={countLimit}
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.productId, parseInt(e.target.value, 10))}
                    />
                  </td>
                  <td>₱{item.subtotal.toFixed(2)}</td>
                  <td>
                    <Button variant="danger" onClick={() => handleRemove(item.productId)}>
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Row className="my-4">
            <Col md={6}>
              <Button variant="success" className="btn-block" onClick={handleCheckout}>
                Checkout
              </Button>
            </Col>
            <Col md={6} className="text-end">
              <h3>Total: ₱{totalPrice.toFixed(2)}</h3>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Button variant="danger" onClick={handleClearCart}>
                Clear Cart
              </Button>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
}