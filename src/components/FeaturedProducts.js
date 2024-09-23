import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ProductCard from './ProductCard'; // Ensure this path is correct

export default function FeaturedProducts() {
  const products = [
    {
      _id: "1",
      name: "LOGITECH C505 HD WEBCAM",
      description: "C505 is a webcam with HD 720p video...",
      price: 2000,
    },
    {
      _id: "2",
      name: "HYPERX QUADCAST S STANDALONE RGB USB MICROPHONE",
      description: "The HyperX QuadCast™ is the ideal microphone...",
      price: 8395,
    },
    {
      _id: "3",
      name: "LOGITECH F310 GAMEPAD Pro",
      description: "G502 HERO features an advanced optical sensor...",
      price: 9955,
    },
  ];

  return (
    <Container>
      <Row className="justify-content-center">
        {products.map((product) => (
          <Col xs={12} md={4} key={product._id}>
            <ProductCard productProp={product} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}