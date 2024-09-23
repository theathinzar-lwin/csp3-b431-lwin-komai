import React, { useState, useEffect } from "react";
import { Container, Card, Spinner, Alert, Row, Col } from "react-bootstrap";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const userUrl = process.env.REACT_APP_API_URL
          ? `${process.env.REACT_APP_API_URL}/users/details`
          : "http://localhost:4000/users/details";

        const userResponse = await fetch(userUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!userResponse.ok) {
          throw new Error("Failed to fetch user details");
        }

        const userData = await userResponse.json();
        setIsAdmin(userData.isAdmin); // Check if user is admin
      } catch (error) {
        setError(error.message);
        setLoading(false);
        return; // Stop further execution if user fetching fails
      }
    };

    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const url = isAdmin
          ? process.env.REACT_APP_API_URL
            ? `${process.env.REACT_APP_API_URL}/orders/all-orders`
            : "http://localhost:4000/orders/all-orders"
          : process.env.REACT_APP_API_URL
          ? `${process.env.REACT_APP_API_URL}/orders/my-orders`
          : "http://localhost:4000/orders/my-orders";

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.status === 403) {
          throw new Error(
            "Access denied. You do not have permission to view all orders."
          );
        } else if (response.status === 404) {
          setOrders([]); // Set orders to empty if not found
          setError(null); // Clear any previous error
        } else if (!response.ok) {
          throw new Error("Failed to fetch orders");
        } else {
          const data = await response.json();
          setOrders(data || []);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails().then(fetchOrders); // Fetch user details first, then orders
  }, [isAdmin]);

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container>
      <h1 className="text-center">Order History</h1>
      {orders.length > 0 ? (
        <Row>
          {orders.map((order) => (
            <Col key={order._id} md={12} className="mb-3">
              <Card style={{ width: "100%" }}>
                <Card.Body>
                  <Card.Title
                    style={{
                      backgroundColor: "black",
                      color: "white",
                      padding: "10px",
                      borderRadius: "5px",
                    }}
                  >
                    Order ID: {order._id}
                  </Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    Date:
                  </Card.Subtitle>
                  <Card.Text>
                    {order.orderedOn
                      ? new Date(order.orderedOn).toLocaleDateString()
                      : "Date not available"}
                  </Card.Text>
                  <Card.Subtitle className="mb-2 text-muted">
                    Status:
                  </Card.Subtitle>
                  <Card.Text>{order.status}</Card.Text>
                  <Card.Subtitle className="mb-2 text-muted">
                    Total:
                  </Card.Subtitle>
                  <Card.Text>
                    ${order.totalPrice?.toFixed(2) || "0.00"}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Alert variant="info">
          You haven't placed any orders yet. Start Shopping!
        </Alert>
      )}
    </Container>
  );
}
