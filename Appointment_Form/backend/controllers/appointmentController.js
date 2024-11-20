const Appointment = require('../models/appointmentModel'); // Import the Appointment model
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator'); // Ensure this package is installed
const redis = require('redis'); // Redis for temporary OTP storage
const dotenv = require('dotenv').config();

// Set up Redis client
const redisClient = redis.createClient();

(async () => {
    try {
        await redisClient.connect();
        console.log('Connected to Redis');
    } catch (err) {
        console.error('Redis connection error:', err);
    }
})();

// Function to send an email OTP
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Use App Password
        pass: process.env.EMAIL_PASS,
    },
});

// Function to send an phone OTP
exports.sendPhoneOtp = async (req, res) => {
    const { phone } = req.body;

    if (!phone || !/^[0-9]{10}$/.test(phone)) {
        return res.status(400).json({ message: 'Invalid phone number' });
    }

    const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });

    try {
        // Store OTP in Redis with a 5-minute expiration
        await redisClient.setEx(`phone_otp_${phone}`, 300, otp);
        console.log(`OTP for phone ${phone}: ${otp}`); // For development

        res.status(200).json({ message: 'OTP sent to your phone' });
    } catch (error) {
        console.error('Error storing OTP in Redis:', error.message);
        res.status(500).json({ message: 'Error sending OTP. Please try again later.' });
    }
};

// Function to create a new appointment
exports.createAppointment = async (req, res) => {
    const { name, email, emailOtp, phone, phoneOtp, contactDetails, course } = req.body;

    if (!name || !email || !emailOtp || !phone || !phoneOtp || !contactDetails || !course) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const storedEmailOtp = await getOtp(`email_otp_${email}`);
        if (!storedEmailOtp || storedEmailOtp !== emailOtp) {
            return res.status(400).json({ message: 'Invalid or expired email OTP' });
        }

        const storedPhoneOtp = await getOtp(`phone_otp_${phone}`);
        if (!storedPhoneOtp || storedPhoneOtp !== phoneOtp) {
            return res.status(400).json({ message: 'Invalid or expired phone OTP' });
        }

        const newAppointment = new Appointment({ name, email, phone, contactDetails, course });
        const savedAppointment = await newAppointment.save();

        // Clear OTPs after use
        await redisClient.del(`email_otp_${email}`);
        await redisClient.del(`phone_otp_${phone}`);

        res.status(201).json(savedAppointment);
    } catch (error) {
        console.error('Error creating appointment:', error.message);
        res.status(500).json({ message: 'Error creating appointment. Please try again later.' });
    }
};

// Function to get all appointments
exports.getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find();
        res.status(200).json(appointments);
    } catch (error) {
        console.error('Error fetching appointments:', error.message);
        res.status(500).json({ message: 'Error fetching appointments. Please try again later.' });
    }
};
