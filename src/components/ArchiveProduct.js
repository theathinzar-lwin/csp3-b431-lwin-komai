import { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { Notyf } from 'notyf';

export default function ArchiveProduct({ product, isActive, fetchData }) {
    const notyf = new Notyf();
    const [productId, setProductId] = useState('');

    useEffect(() => {
        if (product && product._id) {
            setProductId(product._id);
        } else {
            notyf.error("Product ID is missing or invalid.");
        }
    }, [product]);

    const archiveToggle = () => {
        if (!productId) {
            notyf.error("Product ID is missing.");
            return;
        }

        const url = `${process.env.REACT_APP_API_URL}/products/${productId}/archive`;
        
        fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => {
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.json();
        })
        .then(data => {
            if (data.message === 'Product archived successfully') {
                notyf.success("Successfully Archived");
                fetchData();
            } else {
                notyf.error(data.message || "Something Went Wrong");
            }
        })
        .catch(error => {
            notyf.error("Error occurred while archiving: " + error.message);
        });
    };

    const activateToggle = () => {
        if (!productId) {
            notyf.error("Product ID is missing.");
            return;
        }

        const url = `${process.env.REACT_APP_API_URL}/products/${productId}/activate`;
        
        fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => {
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.json();
        })
        .then(data => {
            if (data.message === 'Product activated successfully') {
                notyf.success('Product successfully enabled');
                fetchData();
            } else {
                notyf.error(data.message || 'Please Try again');
            }
        })
        .catch(error => {
            notyf.error("Error occurred while activating: " + error.message);
        });
    };

    return (
        <>
            {isActive ? 
                <Button variant="danger" size="sm" onClick={archiveToggle}>Disable</Button> 
                : 
                <Button variant="success" size="sm" onClick={activateToggle}>Enable</Button>
            }
        </>
    );
}
