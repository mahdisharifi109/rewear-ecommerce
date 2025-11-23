import { Request, Response } from 'express';
import pool from './db';
import { v4 as uuidv4 } from 'uuid';

// Helper to get order details
const getOrder = async (orderId: string) => {
  const [orders]: any = await pool.query('SELECT * FROM orders WHERE id = ?', [orderId]);
  return orders[0];
};

// Create Order (Simple version for "Buy Now")
export const createOrder = async (req: any, res: Response) => {
  try {
    const { productId } = req.body;
    const buyerId = req.user.id;

    // Get product details
    const [products]: any = await pool.query('SELECT * FROM products WHERE id = ?', [productId]);
    if (products.length === 0) return res.status(404).json({ error: 'Product not found' });
    const product = products[0];

    if (product.status !== 'available') {
      return res.status(400).json({ error: 'Product is not available' });
    }

    const orderId = uuidv4();
    const totalAmount = product.price; // Simplified: no fees/shipping calc for now

    // Start transaction
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Create Order
      await connection.query(
        'INSERT INTO orders (id, product_id, buyer_id, seller_id, total_amount, status) VALUES (?, ?, ?, ?, ?, ?)',
        [orderId, productId, buyerId, product.sellerId, totalAmount, 'paid'] // Assuming immediate payment for simplicity
      );

      // Update Product Status
      await connection.query('UPDATE products SET status = "sold" WHERE id = ?', [productId]);

      await connection.commit();
      res.status(201).json({ id: orderId, status: 'paid' });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

// Get Order Details
export const getOrderDetails = async (req: any, res: Response) => {
  try {
    const orderId = req.params.id;
    const userId = req.user.id;

    const [orders]: any = await pool.query(
      `SELECT o.*, p.name as product_name, p.imageUrls as product_images, 
              s.full_name as seller_name, b.full_name as buyer_name
       FROM orders o
       JOIN products p ON o.product_id = p.id
       JOIN users s ON o.seller_id = s.id
       JOIN users b ON o.buyer_id = b.id
       WHERE o.id = ? AND (o.buyer_id = ? OR o.seller_id = ?)`,
      [orderId, userId, userId]
    );

    if (orders.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(orders[0]);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
};

// Ship Order
export const shipOrder = async (req: any, res: Response) => {
  try {
    const orderId = req.params.id;
    const { trackingCode } = req.body;
    const userId = req.user.id;

    const order = await getOrder(orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    if (order.seller_id !== userId) {
      return res.status(403).json({ error: 'Only the seller can mark as shipped' });
    }

    if (order.status !== 'paid') {
      return res.status(400).json({ error: 'Order must be paid before shipping' });
    }

    await pool.query(
      'UPDATE orders SET status = "shipped", tracking_code = ? WHERE id = ?',
      [trackingCode, orderId]
    );

    res.json({ status: 'shipped', trackingCode });
  } catch (error) {
    console.error('Ship order error:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
};

// Complete Order & Release Funds
export const completeOrder = async (req: any, res: Response) => {
  try {
    const orderId = req.params.id;
    const userId = req.user.id;

    const order = await getOrder(orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    if (order.buyer_id !== userId) {
      return res.status(403).json({ error: 'Only the buyer can confirm receipt' });
    }

    if (order.status !== 'shipped') {
      return res.status(400).json({ error: 'Order must be shipped before completion' });
    }

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // 1. Update Order Status
      await connection.query('UPDATE orders SET status = "completed" WHERE id = ?', [orderId]);

      // 2. Release Funds to Seller
      await connection.query(
        'UPDATE users SET wallet_balance = wallet_balance + ? WHERE id = ?',
        [order.total_amount, order.seller_id]
      );

      await connection.commit();
      res.json({ status: 'completed' });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Complete order error:', error);
    res.status(500).json({ error: 'Failed to complete order' });
  }
};

// Create Review
export const createReview = async (req: any, res: Response) => {
  try {
    const { orderId, rating, comment } = req.body;
    const reviewerId = req.user.id;

    const order = await getOrder(orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    if (order.buyer_id !== reviewerId) {
      return res.status(403).json({ error: 'Only the buyer can review' });
    }

    if (order.status !== 'completed') {
      return res.status(400).json({ error: 'Order must be completed before reviewing' });
    }

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // 1. Insert Review
      await connection.query(
        'INSERT INTO reviews (order_id, reviewer_id, target_id, rating, comment) VALUES (?, ?, ?, ?, ?)',
        [orderId, reviewerId, order.seller_id, rating, comment]
      );

      // 2. Update Seller's Average Rating
      await connection.query(
        `UPDATE users u
         SET rating_avg = (SELECT AVG(rating) FROM reviews WHERE target_id = u.id)
         WHERE id = ?`,
        [order.seller_id]
      );

      await connection.commit();
      res.status(201).json({ message: 'Review submitted' });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Review error:', error);
    res.status(500).json({ error: 'Failed to submit review' });
  }
};
