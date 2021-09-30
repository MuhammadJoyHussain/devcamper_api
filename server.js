const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');


// Load env vars
dotenv.config({ path: './config/config.env' });

// Route files
const bootcamps = require('./routes/bootcamps');

// Connect DB
connectDB();

const app = express();

// Dev logging middlewere
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Mount router
app.use('/api/v1/bootcamps', bootcamps);

app.get('/', (req, res) => {
    res.status(200).json({ success: true, data: { id: 1 } });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`Server runnign in ${process.env.NODE_ENV} mode on port ${PORT}`));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
});