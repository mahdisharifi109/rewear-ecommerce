import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Test route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Products routes
app.get('/api/products', async (req, res) => {
  try {
    const { category, size, minPrice, maxPrice, search, sortBy } = req.query;
    
    let query = 'SELECT * FROM products WHERE status = "available"';
    const params: any[] = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    if (size) {
      query += ' AND size = ?';
      params.push(size);
    }

    if (minPrice) {
      query += ' AND price >= ?';
      params.push(minPrice);
    }

    if (maxPrice) {
      query += ' AND price <= ?';
      params.push(maxPrice);
    }

    if (search) {
      query += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (sortBy) {
      switch (sortBy) {
        case 'price_asc':
          query += ' ORDER BY price ASC';
          break;
        case 'price_desc':
          query += ' ORDER BY price DESC';
          break;
        case 'likes':
          query += ' ORDER BY likes DESC';
          break;
        case 'newest':
          query += ' ORDER BY createdAt DESC';
          break;
        default:
          query += ' ORDER BY createdAt DESC';
      }
    } else {
      query += ' ORDER BY createdAt DESC';
    }

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    const products = rows as any[];
    if (products.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(products[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/*
  Database Schema:
  
  CREATE TABLE products (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50),
    size VARCHAR(20),
    condition VARCHAR(20),
    status VARCHAR(20) DEFAULT 'available',
    sellerId VARCHAR(36),
    imageUrls JSON,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    likes INT DEFAULT 0
  );
*/

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
