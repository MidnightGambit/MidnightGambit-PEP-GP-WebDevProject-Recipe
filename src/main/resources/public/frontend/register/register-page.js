/**
 * This script defines the registration functionality for the Registration page in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

// Get references to DOM elements
const usernameInput = document.getElementById("username-input");
const emailInput = document.getElementById("email-input");
const passwordInput = document.getElementById("password-input");
const repeatPasswordInput = document.getElementById("repeat-password-input");
const registerButton = document.getElementById("register-button");

// Attach click event to the register button
registerButton.addEventListener("click", processRegistration);

/**
 * Handles the user registration process
 */
async function processRegistration() {
    try {
        // Retrieve values from input fields
        const username = usernameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const repeatPassword = repeatPasswordInput.value.trim();

        // Validate all fields are filled
        if (!username || !email || !password || !repeatPassword) {
            alert("Please fill in all fields.");
            return;
        }

        // Check that passwords match
        if (password !== repeatPassword) {
            alert("Passwords do not match. Please try again.");
            return;
        }

        // Create request body
        const registerBody = {
            username: username,
            email: email,
            password: password
        };

        // Define request options
        const requestOptions = {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify(registerBody)
        };

        // Send registration request to backend
        const response = await fetch(`${BASE_URL}/register`, requestOptions);

        if (response.status === 201) {
            alert("Registration successful! Redirecting to login page...");
            window.location.href = "login.html";   // Change to your actual login page filename if different
        } 
        else if (response.status === 409) {
            alert("Username or email already exists. Please try a different one.");
        } 
        else {
            alert("Registration failed. Please try again later.");
        }

    } catch (error) {
        console.error("Registration error:", error);
        alert("An error occurred during registration. Please check your connection and try again.");
    }
}