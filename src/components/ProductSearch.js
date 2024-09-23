import React, { useState } from 'react';
import ProductCard from './ProductCard';

export default function ProductSearch() {
  const [productName, setProductName] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Function to search products by name
  const handleSearchByName = async (e) => {
    e.preventDefault();

    if (!productName.trim()) {
      setError('Please enter a product name.');
      return;
    }

    setLoading(true);
    setError('');
    setSearchResults([]);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/products/search-by-name`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: productName }), // Correctly pass 'name' as per the controller
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Error searching for products by name.');
      } else {
        setSearchResults(data || []);
      }
    } catch (err) {
      setError('An error occurred while searching for the product.');
    } finally {
      setLoading(false);
    }
  };

  // Function to search products by price range
  const handleSearchByPrice = async (e) => {
    e.preventDefault();

    if (minPrice === '' || maxPrice === '') {
      setError('Please enter both minimum and maximum prices.');
      return;
    }

    if (Number(minPrice) > Number(maxPrice)) {
      setError('Minimum price should be less than or equal to maximum price.');
      return;
    }

    setLoading(true);
    setError('');
    setSearchResults([]);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/products/search-by-price`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          minPrice: Number(minPrice),
          maxPrice: Number(maxPrice),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Error searching for products by price range.');
      } else {
        setSearchResults(data || []);
      }
    } catch (err) {
      setError('An error occurred while searching for products by price.');
    } finally {
      setLoading(false);
    }
  };

  // Clear input fields and reset the search results
  const clearSearch = () => {
    setProductName('');
    setMinPrice('');
    setMaxPrice('');
    setSearchResults([]);
    setError('');
  };

  return (
    <div className="container mt-5 mb-5">
      <h2>Product Search</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <div className="alert alert-info">Loading...</div>}

      {/* Search by Product Name Form */}
      <form>
        <div className="form-group">
          <label htmlFor="productName">Product Name</label>
          <input
            type="text"
            className="form-control"
            id="productName"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Enter product name"
          />
        </div>

        {/* Search by Price Range Form */}
        <div className="form-group">
          <label htmlFor="minPrice">Minimum Price</label>
          <input
            type="number"
            className="form-control"
            id="minPrice"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Enter minimum price"
          />
        </div>

        <div className="form-group">
          <label htmlFor="maxPrice">Maximum Price</label>
          <input
            type="number"
            className="form-control"
            id="maxPrice"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Enter maximum price"
          />
        </div>

        {/* Action Buttons */}
        <div className="mt-3">
          <button
            type="button"
            onClick={handleSearchByName}
            className="btn btn-primary"
          >
            Search by Name
          </button>
          <button
            type="button"
            onClick={handleSearchByPrice}
            className="btn btn-info ml-2"
          >
            Search by Price
          </button>
          <button
            type="button"
            onClick={clearSearch}
            className="btn btn-danger ml-2"
          >
            Clear
          </button>
        </div>
      </form>

      {/* Display Search Results */}
      {searchResults.length > 0 && (
        <div className="mt-4">
          <h3>Search Results</h3>
          <ul className="list-group">
            {searchResults.map((product) => (
              <ProductCard key={product._id} productProp={product} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
