const express = require('express');
const connectDB = require('./config/db');
const contactUsRouter = require('./routes/contactUs');

const app = express();

// Middleware
app.use(express.json());

// Connect to the database (if using MongoDB)
connectDB();

// Routes
app.use('/api/contactus', contactUsRouter);

// Test route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
