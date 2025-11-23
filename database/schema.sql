CREATE DATABASE IF NOT EXISTS rewear_db;
USE rewear_db;

CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(50),
  size VARCHAR(20),
  `condition` VARCHAR(20),
  status VARCHAR(20) DEFAULT 'available',
  sellerId VARCHAR(36),
  imageUrls JSON,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  likes INT DEFAULT 0
);

-- Insert some sample data
INSERT IGNORE INTO products (id, name, description, price, category, size, `condition`, status, sellerId, imageUrls, likes) VALUES 
('1', 'Zara Denim Jacket', 'Classic oversized denim jacket.', 15.00, 'Clothing', 'M', 'Good', 'available', 'user1', '["https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600"]', 12),
('2', 'Vintage Leather Bag', 'Genuine leather.', 45.50, 'Bags', 'One Size', 'Like New', 'available', 'user2', '["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=600"]', 45),
('3', 'Nike Sneakers', 'Air force one.', 80.00, 'Shoes', '39', 'Good', 'available', 'user3', '["https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600"]', 8);
