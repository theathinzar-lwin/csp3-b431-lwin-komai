import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import ProductSearch from './ProductSearch';

export default function UserView() {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/products/active`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        // No Authorization header if not needed
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    if (Array.isArray(data)) {
                        const productsArr = data.map(product => (
                            product.isActive ? (
                                <ProductCard productProp={product} key={product._id} />
                            ) : null
                        ));
                        setProducts(productsArr);
                        setError(null); // Clear any previous errors
                    } else {
                        setError("Unexpected data format received.");
                        setProducts([]); // Clear products if the format is unexpected
                    }
                } else {
                    const errorData = await response.json();
                    setError(errorData.error || "Failed to fetch products.");
                    setProducts([]); // Clear products if there's an error
                }
            } catch (error) {
                console.error('Error fetching products:', error);
                setError("An error occurred while fetching products.");
                setProducts([]); // Clear products on fetch error
            }
        };

        fetchData();
    }, []);

    return (
        <>
            <ProductSearch />
            {error ? (
                <p>Error: {error}</p>
            ) : (
                products.length > 0 ? products : <p>No active products available.</p>
            )}
        </>
    );
}
