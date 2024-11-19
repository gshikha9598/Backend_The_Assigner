document.getElementById('save-profile').addEventListener('click', function () {
    // Get form data
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const qualification = document.getElementById('qualification').value;
    const location = document.getElementById('location').value;
    const city = document.getElementById('city').value;
    const about = document.getElementById('about').value;

    // Validate input
    if (!name || !email || !phone) {
        alert('Please fill in all required fields.');
        return;
    }

    // Display saved profile
    document.getElementById('output-name').textContent = name;
    document.getElementById('output-email').textContent = email;
    document.getElementById('output-phone').textContent = phone;
    document.getElementById('output-qualification').textContent = qualification;
    document.getElementById('output-location').textContent = location;
    document.getElementById('output-city').textContent = city;
    document.getElementById('output-about').textContent = about;

    // Show the saved profile section
    document.getElementById('output').classList.remove('hidden');
});

// Handle avatar upload preview
document.getElementById('upload-avatar').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('avatar').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});
