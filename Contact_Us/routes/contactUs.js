const express = require('express');
const { createContact } = require('../controllers/contactController');
const router = express.Router();

// Use the controller for the POST endpoint
router.post('/', createContact);

module.exports = router;
