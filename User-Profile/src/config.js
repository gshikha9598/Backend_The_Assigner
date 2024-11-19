const mongoose = require('mongoose');

// MongoDB connection URI
const dbURI = "mongodb://localhost:27017/Login";

// Create a connection to MongoDB using async/await
async function connectToDatabase() {
    try {
        await mongoose.connect(dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1); // Exit if connection fails
    }
}

// Call the database connection function
connectToDatabase();

// Define schema for user login
const loginSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, // Ensure name is required
        unique: true,   // Make name unique to avoid duplicates
    },
    email: {
        type: String,
        required: true,  // Email is required
        unique: true,    // Make email unique to avoid duplicates
    },
    phone: {
        type: String,
        required: true,  // Phone is required
    },
    qualification: {
        type: String,
        required: true,  // Educational qualification is required
    },
    city: {
        type: String,
        required: true,  // City is required
    },
    profilePic: {
        type: String,    // Path to profile picture (can be null)
    },
    password: {
        type: String,
        required: true,  // Password is required
    }
});

// Create a model based on the schema
const collection = mongoose.model("collection", loginSchema);

// Create indexes for unique fields (optional but recommended)
collection.createIndexes();

module.exports = collection;
