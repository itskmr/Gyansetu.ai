// server.js
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const morgan = require('morgan');
const dotenv = require('dotenv');
const fs = require('fs');
const chatController = require('./controllers/chatController');
const quizController = require('./controllers/quizController');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Ensure required directories exist
const uploadDir = process.env.UPLOAD_DIR || 'uploads';
const imageDir = process.env.IMAGE_DIR || 'images';

// Create directories if they don't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log(`Created directory: ${uploadDir}`);
}

if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir, { recursive: true });
  console.log(`Created directory: ${imageDir}`);
}

// Configure file upload middleware
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Create a safe filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const fileExtension = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${fileExtension}`);
  }
});

const upload = multer({ 
  storage,
  limits: { 
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB limit by default
  }
});

// Simple CORS configuration that allows any localhost origin
app.use(cors({
  origin: true, // This allows all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}));

app.use(express.json());
app.use(morgan('dev')); // Logging

// Serve static files - IMPORTANT for image display
app.use('/uploads', express.static(path.join(__dirname, uploadDir)));
app.use('/images', express.static(path.join(__dirname, imageDir), {
  setHeaders: (res, filePath) => {
    // Set proper headers for SVG files
    if (path.extname(filePath) === '.svg') {
      res.setHeader('Content-Type', 'image/svg+xml');
    }
  }
}));

// Additional static serve for the images directory
app.use(`/${imageDir}`, express.static(path.join(__dirname, imageDir), {
  setHeaders: (res, filePath) => {
    // Set SVG files to be treated as images, not as HTML
    if (path.extname(filePath) === '.svg') {
      res.setHeader('Content-Type', 'image/svg+xml');
    }
  }
}));

// Log all incoming requests for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} from origin: ${req.headers.origin || 'unknown'}`);
  next();
});

// Special route for image debugging
app.get('/check-image/:filename', (req, res) => {
  const filename = req.params.filename;
  const imagePath = path.join(__dirname, imageDir, filename);
  
  fs.access(imagePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).json({
        exists: false, 
        path: imagePath,
        error: err.message
      });
    }
    
    // File exists, send additional info
    fs.stat(imagePath, (statErr, stats) => {
      if (statErr) {
        return res.status(500).json({
          exists: true,
          path: imagePath,
          error: statErr.message
        });
      }
      
      res.json({
        exists: true,
        path: imagePath,
        size: stats.size,
        isFile: stats.isFile(),
        created: stats.birthtime,
        modified: stats.mtime
      });
    });
  });
});

// Chat API routes
app.post('/api/chat/message', upload.array('files'), chatController.sendMessage);
app.post('/api/chat/simplify', chatController.simplifyResponse);
app.get('/api/chat/history', chatController.getChatHistory);
app.get('/api/chat/:chatId', chatController.getChat);
app.delete('/api/chat/:chatId', chatController.deleteChat);

// Quiz API routes
app.post('/api/quiz/generate', quizController.generateQuiz);
app.get('/api/quiz/:quizId', quizController.getQuiz);
app.post('/api/quiz/results', quizController.saveQuizResults);
app.get('/api/quiz', quizController.getQuizzes);
app.delete('/api/quiz/:quizId', quizController.deleteQuiz);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    uptime: process.uptime(),
    directories: {
      uploads: {
        path: path.resolve(uploadDir),
        exists: fs.existsSync(uploadDir)
      },
      images: {
        path: path.resolve(imageDir),
        exists: fs.existsSync(imageDir)
      }
    }
  });
});

// Test endpoint for image URLs
app.get('/api/test-image-url', (req, res) => {
  // Find a random SVG file in the images directory
  fs.readdir(path.join(__dirname, imageDir), (err, files) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    // Filter for SVG files
    const svgFiles = files.filter(file => path.extname(file).toLowerCase() === '.svg');
    
    if (svgFiles.length === 0) {
      return res.status(404).json({ error: 'No SVG files found' });
    }
    
    // Pick a random SVG file
    const randomSvg = svgFiles[Math.floor(Math.random() * svgFiles.length)];
    
    // Return the correct URL to access this file
    res.json({
      filename: randomSvg,
      relativePath: `/${imageDir}/${randomSvg}`,
      fullUrl: `http://localhost:${PORT}/${imageDir}/${randomSvg}`,
      fileExists: fs.existsSync(path.join(__dirname, imageDir, randomSvg))
    });
  });
});

// Direct image test route
app.get('/test-svg', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>SVG Test</title>
    </head>
    <body>
      <h1>SVG Test Page</h1>
      <div id="svg-container">Loading SVGs...</div>
      
      <script>
        // Fetch the list of SVG files
        fetch('/api/test-image-url')
          .then(response => response.json())
          .then(data => {
            const container = document.getElementById('svg-container');
            container.innerHTML = \`
              <h2>SVG File: \${data.filename}</h2>
              <p>Path: \${data.relativePath}</p>
              <p>Full URL: \${data.fullUrl}</p>
              <p>File exists: \${data.fileExists}</p>
              <img src="\${data.relativePath}" alt="Test SVG" style="max-width: 500px; border: 1px solid #ccc; padding: 10px;" />
            \`;
          })
          .catch(error => {
            document.getElementById('svg-container').innerHTML = \`<p>Error: \${error.message}</p>\`;
          });
      </script>
    </body>
    </html>
  `);
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

// Catch-all 404 route
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `The requested endpoint ${req.method} ${req.originalUrl} does not exist.`
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  
  // Remove sensitive error details in production
  const errorMessage = process.env.NODE_ENV === 'development' 
    ? err.message 
    : 'An unexpected error occurred';
  
  res.status(500).json({
    error: 'Server error',
    message: errorMessage
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`OpenAI API Key: ${process.env.OPENAI_API_KEY ? 'Configured' : 'Not configured (will use mock responses)'}`);
  console.log(`Upload directory: ${path.resolve(uploadDir)}`);
  console.log(`Image directory: ${path.resolve(imageDir)}`);
  console.log(`Images should be accessible at: http://localhost:${PORT}/images`);
  console.log(`API Health check: http://localhost:${PORT}/api/health`);
});