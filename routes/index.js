const express = require('express');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const router = express.Router();

// Serve the index.html file for the root route
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/index.html'));
});

// POST endpoint to receive base64 encoded HTML content and save it
router.post('/save-html', (req, res) => {
  const { htmlContent } = req.body;
  
  if (!htmlContent) {
    return res.status(400).json({ error: 'Base64 encoded HTML content is required' });
  }

  try {
    // Decode base64 content
    const decodedHtml = Buffer.from(htmlContent, 'base64').toString('utf-8');

    // Generate a unique filename using timestamp and random hash
    const timestamp = Date.now();
    const randomHash = crypto.randomBytes(4).toString('hex');
    const filename = `${timestamp}-${randomHash}.html`;

    // Ensure public/files directory exists
    const filesDir = path.join(__dirname, '../public/files');
    if (!fs.existsSync(filesDir)) {
      fs.mkdirSync(filesDir, { recursive: true });
    }

    // Save the decoded HTML file
    const filePath = path.join(filesDir, filename);
    fs.writeFileSync(filePath, decodedHtml, 'utf8');

    // Return the URL where the file can be accessed
    const fileUrl = `/files/${filename}`;
    res.json({ 
      success: true, 
      url: fileUrl,
      message: 'HTML file saved successfully'
    });
  } catch (error) {
    res.status(400).json({ 
      error: 'Invalid base64 encoded content',
      details: error.message 
    });
  }
});

module.exports = router;
