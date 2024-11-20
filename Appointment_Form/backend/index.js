const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const appointmentRoutes = require('./routes/appointmentRoutes');
const Appointment = require('./models/appointmentModel')

const app = express();
// Middleware to parse JSON data
app.use(bodyParser.json());

// Serve all appointments at root route
app.get('/data', async (req, res) => {
    try {
        // Fetch all appointments from the database
        const appointments = await Appointment.find();

        // Send the appointments as a JSON response
        res.status(200).json(appointments);
    } catch (error) {
        // Handle any errors
        res.status(500).json({ message: 'Error fetching appointments', error });
    }
});

// Serve the homepage with a success message
app.get('/home', (req, res) => {
    // Get the success message from the query string (if present)
    const successMessage = req.query.successMessage || '';
    res.send(`
        <h1>Welcome to the Homepage</h1>
        ${successMessage ? `<p>${successMessage}</p>` : ''}
        <a href="/">Go to Appointment Form</a>
    `);
});

// Handle form submission and redirect with success message
app.post('/submit-appointment', (req, res) => {
    const { name, email, phoneno, contactDetails, course } = req.body;

    // Process the form data (you can save it to the database, etc.)
    // For now, we'll just generate a success message.
    const successMessage = `You have successfully enrolled, ${name}!`;

    // Redirect to the /home page with the success message
    res.redirect(`/home?successMessage=${encodeURIComponent(successMessage)}`);
});

// MongoDB connection
mongoose
    .connect('mongodb://localhost:27017/appointmentDB', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Serve frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// Backend routes
app.use('/api/appointments', appointmentRoutes);

// Start the server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
