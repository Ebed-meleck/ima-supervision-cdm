import express from 'express';
import pool from '../config/database.js';
import path from 'path';
import fs from 'fs-extra';

const router = express.Router();

// Get all form data
router.get('/form-data', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    
    const { form_id, province, limit = 100, offset = 0 } = req.query;
    
    let query = 'SELECT * FROM form_data WHERE 1=1';
    const params = [];
    
    if (form_id) {
      query += ' AND form_id = ?';
      params.push(form_id);
    }
    
    if (province) {
      query += ' AND province = ?';
      params.push(province);
    }
    
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    
    const [rows] = await connection.execute(query, params);
    
    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM form_data WHERE 1=1';
    const countParams = [];
    
    if (form_id) {
      countQuery += ' AND form_id = ?';
      countParams.push(form_id);
    }
    
    if (province) {
      countQuery += ' AND province = ?';
      countParams.push(province);
    }
    
    const [countResult] = await connection.execute(countQuery, countParams);
    const total = countResult[0].total;
    
    connection.release();
    
    res.json({
      success: true,
      data: rows,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: offset + rows.length < total
      }
    });
  } catch (error) {
    console.error('Error fetching form data:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get form data by ID
router.get('/form-data/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute(
      'SELECT * FROM form_data WHERE id = ?',
      [req.params.id]
    );
    
    connection.release();
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Form data not found'
      });
    }
    
    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Error fetching form data by ID:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get unique form IDs
router.get('/form-ids', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute(
      'SELECT DISTINCT form_id FROM form_data ORDER BY form_id'
    );
    
    connection.release();
    
    res.json({
      success: true,
      data: rows.map(row => row.form_id)
    });
  } catch (error) {
    console.error('Error fetching form IDs:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get unique provinces
router.get('/provinces', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute(
      'SELECT DISTINCT province FROM form_data WHERE province IS NOT NULL AND province != "" ORDER BY province'
    );
    
    connection.release();
    
    res.json({
      success: true,
      data: rows.map(row => row.province)
    });
  } catch (error) {
    console.error('Error fetching provinces:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get statistics
router.get('/stats', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    
    // Total records
    const [totalResult] = await connection.execute('SELECT COUNT(*) as total FROM form_data');
    const total = totalResult[0].total;
    
    // Records by form
    const [formStats] = await connection.execute(`
      SELECT form_id, COUNT(*) as count 
      FROM form_data 
      GROUP BY form_id 
      ORDER BY count DESC
    `);
    
    // Records by province
    const [provinceStats] = await connection.execute(`
      SELECT province, COUNT(*) as count 
      FROM form_data 
      WHERE province IS NOT NULL AND province != ""
      GROUP BY province 
      ORDER BY count DESC
    `);
    
    // Recent records (last 7 days)
    const [recentResult] = await connection.execute(`
      SELECT COUNT(*) as count 
      FROM form_data 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    `);
    const recent = recentResult[0].count;
    
    connection.release();
    
    res.json({
      success: true,
      data: {
        total,
        recent,
        byForm: formStats,
        byProvince: provinceStats
      }
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Serve media files
router.get('/media/:formId/*', (req, res) => {
  const formId = req.params.formId;
  const filePath = req.params[0]; // This captures everything after formId/
  
  const fullPath = path.join(process.env.UPLOAD_DIR || 'uploads', formId, filePath);
  
  // Check if file exists
  if (!fs.existsSync(fullPath)) {
    return res.status(404).json({
      success: false,
      error: 'File not found'
    });
  }
  
  // Serve the file
  res.sendFile(fullPath);
});

// Manual trigger for ODK data download
router.post('/trigger-odk-sync', async (req, res) => {
  try {
    const odkService = (await import('../services/odkService.js')).default;
    
    // Run in background
    odkService.downloadAndProcessAllForms()
      .then(() => {
        console.log('Manual ODK sync completed successfully');
      })
      .catch(error => {
        console.error('Manual ODK sync failed:', error);
      });
    
    res.json({
      success: true,
      message: 'ODK sync started in background'
    });
  } catch (error) {
    console.error('Error triggering ODK sync:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

export default router; 