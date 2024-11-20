document.addEventListener("DOMContentLoaded", () => {
    const appointmentForm = document.getElementById("appointmentForm");
    const verifyEmailButton = document.getElementById("verifyEmail");
    const sendOtpButton = document.getElementById("sendOtp");
    const emailOtpInput = document.getElementById("emailOtp");
    const phoneOtpInput = document.getElementById("phoneOtp");

    // Utility to validate email format
    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    // Utility to validate phone number format
    const isValidPhoneNumber = (phone) => /^[0-9]{10}$/.test(phone);

    // Restrict OTP input to numbers only
    emailOtpInput.addEventListener("input", () => {
        emailOtpInput.value = emailOtpInput.value.replace(/\D/g, "");
    });

    phoneOtpInput.addEventListener("input", () => {
        phoneOtpInput.value = phoneOtpInput.value.replace(/\D/g, "");
    });

    // Validate form inputs
    const validateInputs = () => {
        const phone = document.getElementById("phoneno").value;
        const email = document.getElementById("email").value;

        if (!isValidPhoneNumber(phone)) {
            alert("Please enter a valid 10-digit phone number.");
            return false;
        }

        if (!isValidEmail(email)) {
            alert("Please enter a valid email address.");
            return false;
        }

        return true;
    };

    // Send email OTP
    verifyEmailButton.addEventListener("click", async () => {
        const email = document.getElementById("email").value;

        if (!validateInputs()) return;

        try {
            const response = await fetch("/api/appointments/send-email-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                alert("Email OTP sent. Please check your inbox.");
                emailOtpInput.disabled = false;
            } else {
                alert("Error sending email OTP.");
            }
        } catch (error) {
            console.error("Error sending email OTP:", error);
            alert("Failed to send email OTP.");
        }
    });

    // Send phone OTP
    sendOtpButton.addEventListener("click", async () => {
        const phone = document.getElementById("phoneno").value;

        if (!validateInputs()) return;

        try {
            const response = await fetch("/api/appointments/send-phone-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone }),
            });

            if (response.ok) {
                alert("Phone OTP sent. Please check your phone.");
                phoneOtpInput.disabled = false;
            } else {
                alert("Error sending phone OTP.");
            }
        } catch (error) {
            console.error("Error sending phone OTP:", error);
            alert("Failed to send phone OTP.");
        }
    });

    // Handle form submission
    appointmentForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const emailOtp = emailOtpInput.value;
        const phone = document.getElementById("phoneno").value;
        const phoneOtp = phoneOtpInput.value;
        const contactDetails = document.getElementById("contactDetails").value;
        const course = document.getElementById("course").value;

        if (!validateInputs() || !emailOtp || !phoneOtp) {
            alert("Please verify all inputs and OTPs before submitting.");
            return;
        }

        const appointmentData = {
            name,
            email,
            emailOtp,
            phone,
            phoneOtp,
            contactDetails,
            course,
        };

        try {
            const response = await fetch("/api/appointments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(appointmentData),
            });

            if (response.ok) {
                alert("Appointment created successfully!");
                appointmentForm.reset();
                emailOtpInput.disabled = true;
                phoneOtpInput.disabled = true;
            } else {
                alert("Error creating appointment.");
            }
        } catch (error) {
            console.error("Error creating appointment:", error);
            alert("Failed to create appointment.");
        }
    });
});
