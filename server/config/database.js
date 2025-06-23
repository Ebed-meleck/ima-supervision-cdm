import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'entrepot_dashboard',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

// Create table if not exists
const createTable = async () => {
  try {
    const connection = await pool.getConnection();
    
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS form_data (
        id INT AUTO_INCREMENT PRIMARY KEY,
        form_id VARCHAR(255) NOT NULL,
        data JSON NOT NULL,
        province VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_form_id (form_id),
        INDEX idx_province (province)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    
    await connection.execute(createTableSQL);
    console.log('Table form_data created or already exists');
    connection.release();
  } catch (error) {
    console.error('Error creating table:', error);
  }
};

// Initialize database
const initDatabase = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Database connected successfully');
    connection.release();
    await createTable();
  } catch (err) {
    console.error('Database connection failed:', err);
  }
};

// Initialize on import
initDatabase();

export default pool; 