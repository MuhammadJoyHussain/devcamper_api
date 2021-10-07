const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const mongoSenitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const colors = require('colors');
const errorHandler = require('./middlewere/error');
const connectDB = require('./config/db');


// Load env vars
dotenv.config({ path: './config/config.env' });

// Route files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const users = require('./routes/users');
const reviews = require('./routes/reviews');

// Connect DB
connectDB();

const app = express();

// Body Parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Dev logging middlewere
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// File uloading
app.use(fileupload());

// Sanitize data
app.use(mongoSenitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limiging
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, //10 mins
    max: 100
});

app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enable CORS
app.use(cors());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount router
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`Server runnign in ${process.env.NODE_ENV} mode on port ${PORT}`.green.bold));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    server.close(() => process.exit(1));
});