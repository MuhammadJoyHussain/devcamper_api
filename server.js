const express = require('express');
const dotenv = require('dotenv');

// Route files
const bootcamps = require('./routes/bootcamps');

// Load env vars
dotenv.config({ path: './config/config.env' });

const app = express();

// Mount router
app.use('/api/v1/bootcamps', bootcamps)

app.get('/', (req, res) => {
    res.status(200).json({ success: true, data: { id: 1 } })
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server runnign in ${process.env.NODE_ENV} mode on port ${PORT}`));