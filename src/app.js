const express = require('express');
const cors = require('cors');
const apiRouter = require('./routes/api');

const app = express();
app.use(cors());

// Middleware: body parser
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Routes
app.use('/api', apiRouter);

// Error handler
app.use((err, req, res, next) => {
    console.error('❌ Error:', err);
    res.status(500).json({
        success: false,
        message: 'Lỗi máy chủ',
        error: err.message || err,
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Không tìm thấy tài nguyên yêu cầu',
    });
});

module.exports = app;
