const express = require('express');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const router = express.Router();

// Middleware to parse raw body as text
router.use(express.text({ type: 'text/html' }));

// Serve the index.html file for the root route
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/index.html'));
});

// POST endpoint to receive and save HTML content
router.post('/save-html', (req, res) => {
  const htmlContent = req.body;
  if (!htmlContent) {
    return res.status(400).json({ error: 'HTML content is required' });
  }

  // Generate a unique filename using timestamp and random hash
  const timestamp = Date.now();
  const randomHash = crypto.randomBytes(4).toString('hex');
  const filename = `${timestamp}-${randomHash}.html`;

  // Ensure public/files directory exists
  const filesDir = path.join(__dirname, '../public/files');
  if (!fs.existsSync(filesDir)) {
    fs.mkdirSync(filesDir, { recursive: true });
  }

  // Save the HTML file
  const filePath = path.join(filesDir, filename);
  fs.writeFileSync(filePath, htmlContent, 'utf8');

  // Return the URL where the file can be accessed
  const fileUrl = `/files/${filename}`;
  res.json({ 
    success: true, 
    url: fileUrl,
    message: 'HTML file saved successfully'
  });
});

module.exports = router;
