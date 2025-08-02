// server.js - Main entry point for our Product Comparison backend API server
// This server will handle API requests from our React frontend

const express = require('express'); // Import Express framework
const cors = require('cors'); // Import CORS for cross-origin requests
require('dotenv').config(); // Load environment variables

const app = express(); // Create Express application
const PORT = process.env.PORT || 5000; // Set port (5000 if no env variable)

// Middleware - Functions that run before our routes
app.use(cors()); // Allow requests from React app (different port)
app.use(express.json()); // Parse JSON data from requests

// Test route - to check if server is working
app.get('/api/test', (req, res) => {
  res.json({ message: 'Product Comparison Backend server is running!' });
});

// Sample product data (we'll replace this with real API data later)
// Sample product data (we'll replace this with real API data later)
const products = [
  {
    id: 1,
    name: "iPhone 15 Pro",
    amazon: { price: 99999, rating: 4.7, url: "https://www.amazon.in/s?k=iPhone+15+Pro" },
    flipkart: { price: 98999, rating: 4.8, url: "https://www.flipkart.com/search?q=iPhone+15+Pro" },
    myntra: { price: 89999, rating: 4.6, url: "https://www.myntra.com/search?q=iPhone+15+Pro" },
  },
  {
    id: 2,
    name: "Samsung Galaxy S24",
    amazon: { price: 69999, rating: 4.2, url: "https://www.amazon.in/s?k=Samsung+Galaxy+S24" },
    flipkart: { price: 87999, rating: 4.4, url: "https://www.flipkart.com/search?q=Samsung+Galaxy+S24" },
    myntra: { price: 92999, rating: 4.1, url: "https://www.myntra.com/search?q=Samsung+Galaxy+S24" },
  },
  {
    id: 3,
    name: "MacBook Air M2",
    amazon: { price: 89990, rating: 4.9, url: "https://www.amazon.in/s?k=MacBook+Air+M2" },
    flipkart: { price: 87990, rating: 4.8, url: "https://www.flipkart.com/search?q=MacBook+Air+M2" },
    myntra: { price: 92990, rating: 4.9, url: "https://www.myntra.com/search?q=MacBook+Air+M2" },
  },
  {
    id: 4,
    name: "Sony WH-1000XM5 Headphones",
    amazon: { price: 25000, rating: 4.8, url: "https://www.amazon.in/s?k=Sony+WH-1000XM5" },
    flipkart: { price: 22000, rating: 4.2, url: "https://www.flipkart.com/search?q=Sony+WH-1000XM5" },
    myntra: { price: 20000, rating: 3.6, url: "https://www.myntra.com/search?q=Sony+WH-1000XM5" },
  },
  {
    id: 5,
    name: "Nike Air Max 270",
    amazon: { price: 8999, rating: 3.8, url: "https://www.amazon.in/s?k=Nike+Air+Max+270" },
    flipkart: { price: 8499, rating: 3.5, url: "https://www.flipkart.com/search?q=Nike+Air+Max+270" },
    myntra: { price: 9499, rating: 3.9, url: "https://www.myntra.com/search?q=Nike+Air+Max+270" },
  },
  {
    id: 6,
    name: "Samsung 55-inch QLED TV",
    amazon: { price: 64990, rating: 4.5, url: "https://www.amazon.in/s?k=Samsung+55+inch+QLED+TV" },
    flipkart: { price: 62990, rating: 3.8, url: "https://www.flipkart.com/search?q=Samsung+55+inch+QLED+TV" },
    myntra: { price: 66990, rating: 4.1, url: "https://www.myntra.com/search?q=Samsung+55+inch+QLED+TV" },
  },
  {
    id: 7,
    name: "Apple Watch Series 9",
    amazon: { price: 39990, rating: 4.6, url: "https://www.amazon.in/s?k=Apple+Watch+Series+9" },
    flipkart: { price: 38990, rating: 4.5, url: "https://www.flipkart.com/search?q=Apple+Watch+Series+9" },
    myntra: { price: 41990, rating: 4.7, url: "https://www.myntra.com/search?q=Apple+Watch+Series+9" },
  },
  {
    id: 8,
    name: "Canon EOS R6 Camera",
    amazon: { price: 149990, rating: 4.6, url: "https://www.amazon.in/s?k=Canon+EOS+R6" },
    flipkart: { price: 147990, rating: 2.9, url: "https://www.flipkart.com/search?q=Canon+EOS+R6" },
    myntra: { price: 151990, rating: 4.7, url: "https://www.myntra.com/search?q=Canon+EOS+R6" },
  },
  {
    id: 9,
    name: "Adidas Ultraboost 22",
    amazon: { price: 12999, rating: 2.5, url: "https://www.amazon.in/s?k=Adidas+Ultraboost+22" },
    flipkart: { price: 12499, rating: 2.8, url: "https://www.flipkart.com/search?q=Adidas+Ultraboost+22" },
    myntra: { price: 11499, rating: 2.2, url: "https://www.myntra.com/search?q=Adidas+Ultraboost+22" },
  },
  {
    id: 10,
    name: "Dell XPS 13 Laptop",
    amazon: { price: 89990, rating: 4.5, url: "https://www.amazon.in/s?k=Dell+XPS+13" },
    flipkart: { price: 87990, rating: 4.1, url: "https://www.flipkart.com/search?q=Dell+XPS+13" },
    myntra: { price: 91990, rating: 4.3, url: "https://www.myntra.com/search?q=Dell+XPS+13" },
  }
];
// API Route to get all products
app.get('/api/products', (req, res) => {
  // Send all products as JSON response
  res.json(products);
});

// API Route to search products by name
app.get('/api/products/search', (req, res) => {
  // Get search query from URL parameters
  const searchQuery = req.query.q || '';
  
  // Filter products based on search query
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  res.json(filteredProducts);
});



// Start the server
app.listen(PORT, () => {
  console.log(`Product Comparison Backend server is running on port ${PORT}`);
  console.log(`Test the server: http://localhost:${PORT}/api/test`);
});
