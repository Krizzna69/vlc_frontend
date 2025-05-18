import React, { createContext, useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import api from '../api/api';
import AuthContext from './AuthContext';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalValue: 0,
    lowStockCount: 0
  });

  // Get all products
  const getProducts = async (filters = {}) => {
    try {
      setLoading(true);
      
      // Build query string from filters
      const queryParams = new URLSearchParams();
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.sort) queryParams.append('sort', filters.sort);
      
      const res = await api.get(`/api/products?${queryParams.toString()}`);
      
      setProducts(res.data.data);
      setStats({
        totalProducts: res.data.count,
        totalValue: res.data.totalValue,
        lowStockCount: res.data.lowStockCount
      });
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching products');
      toast.error('Failed to fetch products');
      setLoading(false);
    }
  };

  // Get single product
  const getProduct = async (id) => {
    try {
      setLoading(true);
      const res = await api.get(`/api/products/${id}`);
      setProduct(res.data.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching product');
      toast.error('Failed to fetch product details');
      setLoading(false);
    }
  };

  // Create product
  const createProduct = async (productData) => {
    try {
      // Handle image upload if present
      const formData = new FormData();
      Object.keys(productData).forEach(key => {
        if (key === 'image' && productData[key]) {
          formData.append('image', productData[key]);
        } else if (productData[key] !== undefined) {
          formData.append(key, productData[key]);
        }
      });
      
      const res = await api.post('/api/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setProducts([res.data.data, ...products]);
      toast.success('Product added successfully');
      return res.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating product');
      toast.error('Failed to add product');
      throw err;
    }
  };

  // Update product
  const updateProduct = async (id, productData) => {
    try {
      // Handle image upload if present
      const formData = new FormData();
      Object.keys(productData).forEach(key => {
        if (key === 'image' && productData[key]) {
          formData.append('image', productData[key]);
        } else if (productData[key] !== undefined) {
          formData.append(key, productData[key]);
        }
      });
      
      const res = await api.put(`/api/products/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Update products list
      setProducts(
        products.map(product => 
          product._id === id ? res.data.data : product
        )
      );
      
      toast.success('Product updated successfully');
      return res.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating product');
      toast.error('Failed to update product');
      throw err;
    }
  };

  // Delete product
  const deleteProduct = async (id) => {
    try {
      await api.delete(`/api/products/${id}`);
      
      // Update products list
      setProducts(products.filter(product => product._id !== id));
      
      toast.success('Product deleted successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting product');
      toast.error('Failed to delete product');
      throw err;
    }
  };

  // Load products when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      getProducts();
    }
  }, [isAuthenticated]);

  return (
    <ProductContext.Provider
      value={{
        products,
        product,
        loading,
        error,
        stats,
        getProducts,
        getProduct,
        createProduct,
        updateProduct,
        deleteProduct,
        clearProduct: () => setProduct(null)
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export default ProductContext;