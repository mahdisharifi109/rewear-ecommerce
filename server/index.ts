import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import { register, login, authMiddleware } from './auth';
import { initializeSocket } from './socket';
import { createOrder, getOrderDetails, shipOrder, completeOrder, createReview } from './orders';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer Configuration (Memory Storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'));
    }
  },
});

const app = express();
const httpServer = http.createServer(app);
const io = initializeSocket(httpServer);
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Auth Routes
app.post('/api/auth/register', register);
app.post('/api/auth/login', login);

// Upload Endpoint
app.post('/api/upload', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const streamUpload = (req: any) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'rewear-products',
            fetch_format: 'auto',
            quality: 'auto',
            width: 1080,
            crop: 'limit',
          },
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    const result: any = await streamUpload(req);
    res.json({ url: result.secure_url });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Image upload failed' });
  }
});

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

// Create Product Endpoint
app.post('/api/products', authMiddleware, async (req, res) => {
  try {
    const { id, name, description, price, category, size, condition, imageUrls } = req.body;
    const sellerId = (req as any).user.id; // Get sellerId from token
    
    // Basic validation
    if (!name || !price || !category || !imageUrls) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const query = `
      INSERT INTO products (id, name, description, price, category, size, \`condition\`, status, sellerId, imageUrls)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'available', ?, ?)
    `;

    await pool.query(query, [
      id,
      name,
      description,
      price,
      category,
      size,
      condition,
      sellerId,
      JSON.stringify(imageUrls)
    ]);

    res.status(201).json({ message: 'Product created successfully', id });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Chat Routes

// Start or get conversation
app.post('/api/conversations', authMiddleware, async (req: any, res) => {
  try {
    const { productId, sellerId } = req.body;
    const buyerId = req.user.id;

    if (!productId || !sellerId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if conversation already exists
    const [existing]: any = await pool.query(
      'SELECT * FROM conversations WHERE product_id = ? AND buyer_id = ? AND seller_id = ?',
      [productId, buyerId, sellerId]
    );

    if (existing.length > 0) {
      return res.json(existing[0]);
    }

    const conversationId = uuidv4();
    await pool.query(
      'INSERT INTO conversations (id, product_id, buyer_id, seller_id) VALUES (?, ?, ?, ?)',
      [conversationId, productId, buyerId, sellerId]
    );

    res.status(201).json({ id: conversationId, product_id: productId, buyer_id: buyerId, seller_id: sellerId });
  } catch (error) {
    console.error('Create conversation error:', error);
    res.status(500).json({ error: 'Failed to create conversation' });
  }
});

// Order Routes
app.post('/api/orders', authMiddleware, createOrder);
app.get('/api/orders/:id', authMiddleware, getOrderDetails);
app.post('/api/orders/:id/ship', authMiddleware, shipOrder);
app.post('/api/orders/:id/complete', authMiddleware, completeOrder);
app.post('/api/reviews', authMiddleware, createReview);

httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
