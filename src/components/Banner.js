import { Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Banner({ data }) {
    const { title, content, destination, buttonLabel } = data;

    return (
        <Row className="justify-content-center text-center my-4">
            <Col md={8}>
                <h1 className="my-4">{title}</h1>
                <p className="my-4">{content}</p>
                <Link to={destination}>
                    <Button variant="primary">{buttonLabel}</Button>
                </Link>
            </Col>
        </Row>
    );
}
