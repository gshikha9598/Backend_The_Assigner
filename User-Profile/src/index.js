const express = require('express');
const path = require("path");
const bcrypt = require("bcrypt");
const collection = require("./config"); // Ensure this is correct
const session = require('express-session');
const multer = require('multer');
const fs = require('fs');

const app = express();

// Parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Set the views directory
app.set('views', path.join(__dirname, '../views'));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// Session middleware (should be placed at the top of your app.js)
app.use(
    session({
        secret: 'your-secret-key', // Replace with a strong secret
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }, // If using HTTPS, set this to true
    })
);

// Configure storage for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../public/uploads');
        // Create the uploads directory if it doesn't exist
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

// Initialize multer
const upload = multer({ storage });

// Routes
app.get("/login", (req, res) => {
    if (req.session.user_id) {
        return res.redirect("/home"); // If already logged in, redirect to home
    }
    res.render("login"); // Otherwise, show the login page
});



app.get("/signup", (req, res) => {
    res.render("signup");
});

// Register User
app.post("/signup", upload.single('profilePic'), async (req, res) => {
    const { username, email, phone, qualification, city } = req.body;
    const profilePic = req.file ? `/uploads/${req.file.filename}` : null;

    // Check if the necessary fields are present
    if (!username || !email || !phone || !qualification || !city || !req.body.password) {
        return res.status(400).send("All fields are required.");
    }

    try {
        // Check if the user already exists
        const existingUser = await collection.findOne({ name: username });
        if (existingUser) {
            return res.send("User already exists. Please choose a different username.");
        }

        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // Save user data
        const newUser = new collection({
            name: username,
            email,
            phone,
            qualification,
            city,
            profilePic,
            password: hashedPassword,
        });

        await newUser.save();  // Use newUser.save() here instead of user.save()

        console.log("User registered:", newUser);

        // Redirect to login page
        res.redirect("/login");
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).send("An error occurred. Please try again.");
    }
});


// Login User
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.render("login", { error: "Both username and password are required." });
    }

    try {
        const user = await collection.findOne({ name: username });
        if (!user) {
            return res.render("login", { error: "Username not found." });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.render("login", { error: "Invalid password." });
        }

        // Login successful - Store user ID in session
        req.session.user_id = user._id;

        // Redirect to home page
        res.redirect("/home");
    } catch (error) {
        console.error("Login error:", error);
        res.render("login", { error: "An error occurred. Please try again." });
    }
});


// Home Page after login
app.get("/home", async (req, res) => {
    if (!req.session.user_id) {
        return res.redirect("/"); // Redirect to login page if the user is not logged in
    }

    try {
        const userData = await collection.findOne({ _id: req.session.user_id });
        if (!userData) {
            return res.send("User data not found.");
        }

        // Render the home page with user data
        res.render("home", { userData });
    } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).send("An error occurred. Please try again.");
    }
});

// Logout route
app.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error destroying session:", err);
            return res.status(500).send("An error occurred.");
        }

        // Redirect to login page after logging out
        res.redirect("/login"); 
    });
});


const port = 5000;
app.listen(port, () => {
    console.log(`Server running on Port: ${port}`);
});
