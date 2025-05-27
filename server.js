const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const multer = require('multer'); // For file uploads
// const upload = require('./middlewares/upload');  // Import your upload middleware
// const errorHandler = require('./middleware/errorHandler'); // Custom error handler

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded data (i.e., from regular forms)


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/users', require('./routes/user.routes')); // Existing users routes
app.use('/api/auth', require('./routes/auth.routes')); // Auth routes (login/register)
app.use('/api/banners', require('./routes/banner.routes'));
app.use('/api/contact-us', require('./routes/contactUs.routes'));
app.use('/api/photos', require('./routes/photo.routes'));
app.use('/api/bookings', require('./routes/booking.routes'));
app.use('/api/kathas', require('./routes/katha.routes'));
app.use('/api/videos', require('./routes/video.routes'));
app.use('/api/sevas', require('./routes/seva.routes'));
app.use('/api/settings', require('./routes/setting.routes'));
app.use('/api/pages', require('./routes/page.routes'));
app.use('/api/frontend', require('./routes/frontend.routes'));
app.use('/api/donation', require('./routes/donation.routes'));



// Error handler middleware (ensure it's last)
// app.use(errorHandler); // Catch and handle errors globally

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
