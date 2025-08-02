// App.js - Main entry point for our E-commerce Product Comparison app
import "./App.css";
import React, { useState, useEffect } from "react"; // Added useEffect for API calls
import axios from "axios"; // Import axios for API calls
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./Header";

function App() {
  // ==================== STATE MANAGEMENT ====================
  
  // State for the search input
  const [searchQuery, setSearchQuery] = useState("");

  // State for products - now fetched from API
  const [products, setProducts] = useState([]); // Start with empty array

  // State for loading spinner (for search actions)
  const [isLoading, setIsLoading] = useState(false);

  // State for initial product loading (when page first loads)
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  // ==================== FILTER STATES ====================
  // State for brand filter - tracks which brand is selected in dropdown
  const [selectedBrand, setSelectedBrand] = useState("all");

  // State for price range filter - tracks which price range is selected
  const [priceRange, setPriceRange] = useState("all");

  // State for rating filter - tracks which minimum rating is selected
  const [selectedRating, setSelectedRating] = useState("all");

  // ==================== API FUNCTIONS ====================
  
  // Function to fetch all products from backend API
  const fetchProducts = async () => {
    try {
      setIsLoadingProducts(true); // Show loading while fetching
      const response = await axios.get("http://localhost:5000/api/products");
      setProducts(response.data); // Update products state with API data
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoadingProducts(false); // Hide loading
    }
  };

  // Function to search products via API
  const searchProducts = async (query) => {
    try {
      setIsLoading(true); // Show spinner for search
      
      // Add minimum loading time to prevent spinner from flashing
      const startTime = Date.now();
      
      const response = await axios.get(
        `http://localhost:5000/api/products/search?q=${query}`
      );
      
      // Calculate how long the API call took
      const elapsedTime = Date.now() - startTime;
      const minLoadingTime = 500; // Minimum 500ms loading time
      
      // If API call was too fast, wait a bit more to show spinner
      if (elapsedTime < minLoadingTime) {
        await new Promise(resolve => setTimeout(resolve, minLoadingTime - elapsedTime));
      }
      
      setProducts(response.data); // Update with search results
    } catch (error) {
      console.error("Error searching products:", error);
    } finally {
      setIsLoading(false); // Hide spinner
    }
  };

    // ==================== EVENT HANDLERS ====================

  // Function to handle search form submission
  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // checking that searchquery is not empty or just spaces
      await searchProducts(searchQuery); // Search via API if query exists
    } else {
      await fetchProducts(); // Show all products if search is empty
    }
  };

  // Function to clear search and show all products
  const clearSearch = async () => {
    setSearchQuery(""); // Clear search input
    setIsLoading(false); // Hide any loading spinner
    await fetchProducts(); // Fetch all products again from API
  };

  // ==================== FILTER EVENT HANDLERS ====================
  // Function to handle brand filter change - called when user selects different brand
  const handleBrandFilter = (brand) => {
    setSelectedBrand(brand); // Update the brand filter state
    // No need to call API - filtering happens locally using applyFilters function
  };

  // Function to handle price range filter change - called when user selects different price range
  const handlePriceFilter = (range) => {
    setPriceRange(range); // Update the price range filter state
    // No need to call API - filtering happens locally using applyFilters function
  };

  // Function to handle rating filter change - called when user selects different minimum rating
  const handleRatingFilter = (rating) => {
    setSelectedRating(rating); // Update the rating filter state
    // No need to call API - filtering happens locally using applyFilters function
  };

  // ==================== UTILITY FUNCTIONS ====================
  
  // Function to find the cheapest price among all stores for a specific product
  const findBestDeal = (product) => {
    // Get all prices from different stores for this specific product
    const prices = [
      { store: "amazon", price: product.amazon.price },
      { store: "flipkart", price: product.flipkart.price },
      { store: "myntra", price: product.myntra.price },
    ];

    // Find the minimum price among all stores for this product
    const bestDeal = prices.reduce((min, current) =>
      current.price < min.price ? current : min
    );

    return bestDeal.store; // Returns 'amazon', 'flipkart', or 'myntra'
  };

  // ==================== SIDE EFFECTS ====================
  
  // Load products when component first mounts (page loads)
  useEffect(() => {
    fetchProducts(); // code under usestate only runs when the componenent first loads otherwise infinite rendering .
  }, []); // Empty array means run only once when component mounts

  // ==================== DATA PROCESSING ====================
  
  // Products are now filtered by the API, so filteredProducts is just the current products state
  const filteredProducts = products;

  // ==================== RENDER LOGIC ====================
  
  return (
    <div className="container-fluid">
      
      {/* ==================== HEADER SECTION ==================== */}
      <Header />

      {/* ==================== SEARCH SECTION ==================== */}
      <div className="row mt-4">
        <div className="col-md-8 mx-auto">
          
          {/* Search Form */}
          <form onSubmit={handleSearch}>
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="btn btn-primary btn-lg" type="submit">
                Search
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary btn-lg ms-2"
                onClick={clearSearch}
              >
                🗑️ Clear
              </button>
            </div>
          </form>

          {/* ==================== FILTERS SECTION ==================== */}
          {/* This section adds advanced filtering options for better product discovery */}
          <div className="row mb-3">
            {/* Brand Filter Dropdown */}
            <div className="col-md-4">
              <label className="form-label fw-bold">Brand:</label>
              <select 
                className="form-select" 
                value={selectedBrand}
                onChange={(e) => handleBrandFilter(e.target.value)}
                // onChange triggers when user selects a different option
                // e.target.value contains the selected option value, passed to handleBrandFilter function
                // handleBrandFilter updates the selectedBrand state, which triggers re-render with filtered products
              >
                <option value="all">All Brands</option>
                <option value="apple">Apple</option>
                <option value="samsung">Samsung</option>
                <option value="sony">Sony</option>
                <option value="nike">Nike</option>
                <option value="adidas">Adidas</option>
                <option value="canon">Canon</option>
                <option value="dell">Dell</option>
              </select>
            </div>
            
            {/* Price Range Filter Dropdown */}
            <div className="col-md-4">
              <label className="form-label fw-bold">Price Range:</label>
              <select 
                className="form-select" 
                value={priceRange}
                onChange={(e) => handlePriceFilter(e.target.value)}
                // onChange updates the priceRange state when user selects different range
                // handlePriceFilter updates the priceRange state, which triggers re-render with filtered products
              >
                <option value="all">All Prices</option>
                <option value="0-10000">Under ₹10,000</option>
                <option value="10000-50000">₹10,000 - ₹50,000</option>
                <option value="50000-100000">₹50,000 - ₹1,00,000</option>
                <option value="100000+">Above ₹1,00,000</option>
              </select>
            </div>
            
            {/* Rating Filter Dropdown */}
            <div className="col-md-4">
              <label className="form-label fw-bold">Rating:</label>
              <select 
                className="form-select" 
                value={selectedRating}
                onChange={(e) => handleRatingFilter(e.target.value)}
                // onChange updates the selectedRating state when user selects different rating
                // handleRatingFilter updates the selectedRating state, which triggers re-render with filtered products
              >
                <option value="all">All Ratings</option>
                <option value="4.5+">4.5+ Stars</option>
                <option value="4.0+">4.0+ Stars</option>
                <option value="3.5+">3.5+ Stars</option>
              </select>
            </div>
          </div>

          {/* ==================== PRODUCT COUNT DISPLAY ==================== */}
          {!isLoading && !isLoadingProducts && (
            <div className="text-center mb-3">
              {searchQuery === "" ? (
                <p className="text-muted">
                  Showing all {products.length} products
                </p>
              ) : (
                <p className="text-muted">
                  {products.length === 0
                    ? "No products found"
                    : `${products.length} product${
                        products.length === 1 ? "" : "s"
                      } found for "${searchQuery}"`}
                </p>
              )}
            </div>
          )}

          {/* ==================== LOADING SPINNERS ==================== */}
          
          {/* Loading Spinner for Search */}
          {isLoading && (
            <div className="text-center mt-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2 text-muted">Searching for products...</p>
            </div>
          )}

          {/* Loading Spinner for Initial Load */}
          {isLoadingProducts && (
            <div className="text-center mt-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2 text-muted">Loading products...</p>
            </div>
          )}

          {/* ==================== PRODUCTS LIST ==================== */}
          {!isLoading && !isLoadingProducts && (
            <div>
              {filteredProducts.map((product) => (
                <div key={product.id} className="card mb-3">
                  
                  {/* Product Header */}
                  <div className="card-header">
                    <h3>{product.name}</h3>
                  </div>

                  {/* Product Price Cards */}
                  <div className="card-body">
                    <div className="row">
                      
                      {/* ==================== AMAZON PRICE CARD ==================== */}
                      <div className="col-md-4">
                        <div
                          className={`text-center p-3 border rounded price-card ${
                            findBestDeal(product) === "amazon"
                              ? "border-success bg-light"
                              : ""
                          }`}
                        >
                          <h5 className="text-dark">Amazon</h5>
                          <h4 className="text-success">
                            {/*green color to amount text*/}₹
                            {product.amazon.price}
                          </h4>
                          <div className="text-warning">
                            {/*yellow color to stars*/}
                            {"⭐".repeat(Math.floor(product.amazon.rating))}
                          </div>
                          <button className="btn btn-outline-primary mt-2">
                            View Deal
                          </button>
                          {findBestDeal(product) === "amazon" && (
                            <div className="mt-2">
                              <span className="badge bg-success">
                                Best Deal
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* ==================== FLIPKART PRICE CARD ==================== */}
                      <div className="col-md-4">
                        <div
                          className={`text-center p-3 border rounded price-card ${
                            findBestDeal(product) === "flipkart"
                              ? "border-success bg-light"
                              : ""
                          }`}
                        >
                          <h5 className="text-dark">Flipkart</h5>
                          <h4 className="text-success">
                            ₹{product.flipkart.price}
                          </h4>
                          <div className="text-warning">
                            {"⭐".repeat(Math.floor(product.flipkart.rating))}
                          </div>
                          <button className="btn btn-outline-primary mt-2">
                            View Deal
                          </button>
                          {findBestDeal(product) === "flipkart" && (
                            <div className="mt-2">
                              <span className="badge bg-success">
                                Best Deal
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* ==================== MYNTRA PRICE CARD ==================== */}
                      <div className="col-md-4">
                        <div
                          className={`text-center p-3 border rounded price-card ${
                            findBestDeal(product) === "myntra"
                              ? "border-success bg-light"
                              : ""
                          }`}
                        >
                          <h5 className="text-dark">Myntra</h5>
                          <h4 className="text-success">
                            ₹{product.myntra.price}
                          </h4>
                          <div className="text-warning">
                            {"⭐".repeat(Math.floor(product.myntra.rating))}
                          </div>
                          <button className="btn btn-outline-primary mt-2">
                            View Deal
                          </button>
                          {findBestDeal(product) === "myntra" && (
                            <div className="mt-2">
                              <span className="badge bg-success">
                                Best Deal
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ==================== NO PRODUCTS MESSAGE ==================== */}
          {!isLoading &&
            !isLoadingProducts &&
            products.length === 0 &&
            searchQuery !== "" && (
              <div className="text-center mt-4">
                <h4 className="text-muted">
                  No products found for "{searchQuery}"
                </h4>
                <p className="text-muted">Try searching for something else</p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

export default App; 