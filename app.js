const express = require('express');
const path = require('path');
const indexRouter = require('./routes/index');

const app = express();
const PORT = 3000;

// Configure JSON body parser with size limit
app.use(express.json({ limit: '5mb' }));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Use the router for handling routes
app.use('/', indexRouter);

// Catch-all route for handling 404 errors
app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

// Error handler for payload too large
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.type === 'entity.too.large') {
    res.status(413).json({
      error: 'Payload too large',
      message: 'The file size exceeds the 5MB limit'
    });
  } else {
    next(err);
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
