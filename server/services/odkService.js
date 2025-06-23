import axios from 'axios';
import fs from 'fs-extra';
import path from 'path';
import AdmZip from 'adm-zip';
import pool from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

class ODKService {
  constructor() {
    this.baseURL = process.env.ODK_BASE_URL;
    this.username = process.env.ODK_USERNAME;
    this.password = process.env.ODK_PASSWORD;
    this.projectId = process.env.ODK_PROJECT_ID;
    this.uploadDir = process.env.UPLOAD_DIR || 'uploads';
    this.tempDir = process.env.TEMP_DIR || 'temp';
    
    // Ensure directories exist
    fs.ensureDirSync(this.uploadDir);
    fs.ensureDirSync(this.tempDir);
  }

  // Get authentication token
  async getAuthToken() {
    try {
      const response = await axios.post(`${this.baseURL}/v1/sessions`, {
        email: this.username,
        password: this.password
      });
      return response.data.token;
    } catch (error) {
      console.error('Error getting auth token:', error.message);
      throw error;
    }
  }

  // Get all forms in the project
  async getForms() {
    try {
      const token = await this.getAuthToken();
      const response = await axios.get(`${this.baseURL}/v1/projects/${this.projectId}/forms`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting forms:', error.message);
      throw error;
    }
  }

  // Download form data as CSV
  async downloadFormData(formId) {
    try {
      const token = await this.getAuthToken();
      const response = await axios.get(
        `${this.baseURL}/v1/projects/${this.projectId}/forms/${formId}.svc/Submissions.csv`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          responseType: 'arraybuffer'
        }
      );
      
      const zipPath = path.join(this.tempDir, `${formId}.zip`);
      await fs.writeFile(zipPath, response.data);
      
      return zipPath;
    } catch (error) {
      console.error(`Error downloading form data for ${formId}:`, error.message);
      throw error;
    }
  }

  // Extract ZIP file and process data
  async processFormData(formId) {
    const zipPath = path.join(this.tempDir, `${formId}.zip`);
    const extractPath = path.join(this.tempDir, formId);
    
    try {
      // Extract ZIP file
      const zip = new AdmZip(zipPath);
      zip.extractAllTo(extractPath, true);
      
      // Find CSV file
      const files = await fs.readdir(extractPath);
      const csvFile = files.find(file => file.endsWith('.csv'));
      
      if (!csvFile) {
        throw new Error('No CSV file found in ZIP');
      }
      
      const csvPath = path.join(extractPath, csvFile);
      const csvContent = await fs.readFile(csvPath, 'utf-8');
      
      // Parse CSV and store in database
      await this.storeFormData(formId, csvContent);
      
      // Move media files to uploads directory
      await this.moveMediaFiles(extractPath, formId);
      
      // Clean up
      await fs.remove(extractPath);
      await fs.remove(zipPath);
      
      console.log(`Successfully processed form data for ${formId}`);
    } catch (error) {
      console.error(`Error processing form data for ${formId}:`, error.message);
      // Clean up on error
      await fs.remove(extractPath).catch(() => {});
      await fs.remove(zipPath).catch(() => {});
      throw error;
    }
  }

  // Store form data in database
  async storeFormData(formId, csvContent) {
    try {
      const connection = await pool.getConnection();
      
      // Parse CSV content (simple parsing for demonstration)
      const lines = csvContent.split('\n');
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
          const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
          const data = {};
          
          headers.forEach((header, index) => {
            data[header] = values[index] || '';
          });
          
          // Extract province from data (adjust field name as needed)
          const province = data.province || data.Province || data.PROVINCE || '';
          
          // Check if record exists
          const [existing] = await connection.execute(
            'SELECT id FROM form_data WHERE form_id = ? AND data = ?',
            [formId, JSON.stringify(data)]
          );
          
          if (existing.length === 0) {
            // Insert new record
            await connection.execute(
              'INSERT INTO form_data (form_id, data, province) VALUES (?, ?, ?)',
              [formId, JSON.stringify(data), province]
            );
          }
        }
      }
      
      connection.release();
    } catch (error) {
      console.error('Error storing form data:', error.message);
      throw error;
    }
  }

  // Move media files to uploads directory
  async moveMediaFiles(extractPath, formId) {
    try {
      const mediaPath = path.join(extractPath, 'media');
      const targetPath = path.join(this.uploadDir, formId);
      
      if (await fs.pathExists(mediaPath)) {
        await fs.move(mediaPath, targetPath, { overwrite: true });
        console.log(`Media files moved for form ${formId}`);
      }
    } catch (error) {
      console.error(`Error moving media files for ${formId}:`, error.message);
    }
  }

  // Main method to download and process all forms
  async downloadAndProcessAllForms() {
    try {
      console.log('Starting ODK data download and processing...');
      
      const forms = await this.getForms();
      
      for (const form of forms) {
        try {
          console.log(`Processing form: ${form.xmlFormId}`);
          await this.downloadFormData(form.xmlFormId);
          await this.processFormData(form.xmlFormId);
        } catch (error) {
          console.error(`Failed to process form ${form.xmlFormId}:`, error.message);
        }
      }
      
      console.log('ODK data processing completed');
    } catch (error) {
      console.error('Error in downloadAndProcessAllForms:', error.message);
      throw error;
    }
  }
}

export default new ODKService(); 