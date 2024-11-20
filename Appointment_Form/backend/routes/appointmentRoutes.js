const express = require('express');
const appointmentController = require('../controllers/appointmentController');

const router = express.Router();


// Route to send OTPs
router.post('/send-email-otp', appointmentController.sendEmailOtp);
router.post('/send-phone-otp', appointmentController.sendPhoneOtp);

// Route to create an appointment
router.post('/', appointmentController.createAppointment);

// Route to fetch all appointments
router.get('/data', appointmentController.getAllAppointments);


module.exports = router;
