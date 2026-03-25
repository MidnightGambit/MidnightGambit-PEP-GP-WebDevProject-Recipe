/**
 * This script handles the login functionality for the Recipe Management Application.
 * It manages user authentication by sending login requests to the server and handling responses.
*/

const BASE_URL = "http://localhost:8081"; // backend URL

// Get references to DOM elements
const usernameInput = document.getElementById("username-input");
const passwordInput = document.getElementById("password-input");
const loginButton = document.getElementById("login-button");
// const logoutButton = document.getElementById("logout-button"); // optional

// Add click event listener to login button
loginButton.addEventListener("click", processLogin);

/**
 * Process the login request and handle authentication
 */
async function processLogin() {
    try {
        // Retrieve and trim username and password
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        // Basic validation
        if (!username || !password) {
            alert("Please enter both username and password.");
            return;
        }

        // Create request body
        const requestBody = {
            username: username,
            password: password
        };

        const requestOptions = {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*"
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify(requestBody)
        };

        // Send login request to backend
        const response = await fetch(`${BASE_URL}/login`, requestOptions);

        if (response.status === 200) {
            // Response is expected to be: "token123 true" (space separated)
            const responseText = await response.text();
            const [token, isAdmin] = responseText.trim().split(" ");

            if (!token) {
                throw new Error("Invalid response from server");
            }

            // Store authentication data in sessionStorage
            sessionStorage.setItem("auth-token", token);
            sessionStorage.setItem("is-admin", isAdmin || "false");

            alert("Login successful! Redirecting...");

            // Small delay before redirect (better UX)
            setTimeout(() => {
                window.location.href = "recipes.html";   // Make sure this matches your recipe page filename
            }, 800);

        } 
        else if (response.status === 401) {
            alert("Incorrect login! Please check your username and password.");
        } 
        else {
            alert("Login failed. Unknown issue occurred.");
        }

    } catch (error) {
        console.error("Login error:", error);
        alert("An error occurred during login. Please check your connection and try again.");
    }
}