const Contact = require('../models/contactModel');

// Create a new contact message
const createContact = (req, res) => {
    const { name, email, phone, subject, message } = req.body;

    // Validate input
    if (!name || !email || !phone || !subject || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // saving to the database
    const newContact = {
        name,
        email,
        phone,
        subject,
        message,
    };

    res.status(201).json({ message: 'Contact saved successfully', data: newContact });
};

module.exports = { createContact };
