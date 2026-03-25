/**
 * This script defines the CRUD operations for Recipe objects in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

let recipes = [];

// Wait for DOM to fully load before accessing elements
window.addEventListener("DOMContentLoaded", () => {

    // Get references to DOM elements
    const recipeNameInput = document.getElementById("recipe-name-input");
    const recipeInstructionsInput = document.getElementById("recipe-instructions-input");
    const updateRecipeNameInput = document.getElementById("update-recipe-name-input");
    const updateInstructionsInput = document.getElementById("update-instructions-input");
    const deleteRecipeNameInput = document.getElementById("delete-recipe-name-input");
    const recipeList = document.getElementById("recipe-list");
    const searchInput = document.getElementById("search-input");
    const adminLink = document.getElementById("admin-link");
    const logoutButton = document.getElementById("logout-button");

    // Show logout button if user is logged in
    if (sessionStorage.getItem("auth-token")) {
        logoutButton.style.display = "inline-block";
    }

    // Show admin link only if user is admin
    if (sessionStorage.getItem("is-admin") === "true") {
        adminLink.style.display = "inline-block";
    }

    // Attach event handlers
    document.getElementById("add-recipe-button").addEventListener("click", addRecipe);
    document.getElementById("update-recipe-button").addEventListener("click", updateRecipe);
    document.getElementById("delete-recipe-button").addEventListener("click", deleteRecipe);
    document.getElementById("search-button").addEventListener("click", searchRecipes);
    logoutButton.addEventListener("click", processLogout);

    // Load recipes when page opens
    getRecipes();

    /**
     * Search Recipes by name
     */
    async function searchRecipes() {
        const searchTerm = searchInput.value.trim();

        try {
            const response = await fetch(`${BASE_URL}/recipes?name=${encodeURIComponent(searchTerm)}`);

            if (response.ok) {
                recipes = await response.json();
                refreshRecipeList();
            } else {
                alert("Failed to search recipes.");
            }
        } catch (error) {
            console.error("Search error:", error);
            alert("An error occurred while searching recipes.");
        }
    }

    /**
     * Add a new recipe
     */
    async function addRecipe() {
        const name = recipeNameInput.value.trim();
        const instructions = recipeInstructionsInput.value.trim();

        if (!name || !instructions) {
            alert("Please enter both recipe name and instructions.");
            return;
        }

        const token = sessionStorage.getItem("auth-token");

        try {
            const response = await fetch(`${BASE_URL}/recipes`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ name, instructions })
            });

            if (response.ok) {
                alert("Recipe added successfully!");
                recipeNameInput.value = "";
                recipeInstructionsInput.value = "";
                await getRecipes();        // Refresh the list
            } else {
                alert("Failed to add recipe.");
            }
        } catch (error) {
            console.error("Add recipe error:", error);
            alert("An error occurred while adding the recipe.");
        }
    }

    /**
     * Update an existing recipe
     */
    async function updateRecipe() {
        const name = updateRecipeNameInput.value.trim();
        const instructions = updateInstructionsInput.value.trim();

        if (!name || !instructions) {
            alert("Please enter both recipe name and new instructions.");
            return;
        }

        // Find the recipe ID by name
        const recipeToUpdate = recipes.find(r => r.name.toLowerCase() === name.toLowerCase());
        if (!recipeToUpdate) {
            alert("Recipe not found. Please check the name.");
            return;
        }

        const token = sessionStorage.getItem("auth-token");

        try {
            const response = await fetch(`${BASE_URL}/recipes/${recipeToUpdate.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ instructions })
            });

            if (response.ok) {
                alert("Recipe updated successfully!");
                updateRecipeNameInput.value = "";
                updateInstructionsInput.value = "";
                await getRecipes();
            } else {
                alert("Failed to update recipe.");
            }
        } catch (error) {
            console.error("Update recipe error:", error);
            alert("An error occurred while updating the recipe.");
        }
    }

    /**
     * Delete a recipe by name
     */
    async function deleteRecipe() {
        const name = deleteRecipeNameInput.value.trim();

        if (!name) {
            alert("Please enter the recipe name to delete.");
            return;
        }

        // Find the recipe ID
        const recipeToDelete = recipes.find(r => r.name.toLowerCase() === name.toLowerCase());
        if (!recipeToDelete) {
            alert("Recipe not found. Please check the name.");
            return;
        }

        const token = sessionStorage.getItem("auth-token");

        if (!confirm(`Are you sure you want to delete "${name}"?`)) {
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/recipes/${recipeToDelete.id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                alert("Recipe deleted successfully!");
                deleteRecipeNameInput.value = "";
                await getRecipes();
            } else {
                alert("Failed to delete recipe.");
            }
        } catch (error) {
            console.error("Delete recipe error:", error);
            alert("An error occurred while deleting the recipe.");
        }
    }

    /**
     * Fetch all recipes from the backend
     */
    async function getRecipes() {
        try {
            const response = await fetch(`${BASE_URL}/recipes`);

            if (response.ok) {
                recipes = await response.json();
                refreshRecipeList();
            } else {
                console.error("Failed to fetch recipes");
            }
        } catch (error) {
            console.error("Get recipes error:", error);
            alert("Could not load recipes. Please check if the server is running.");
        }
    }

    /**
     * Refresh the recipe list in the DOM
     */
    function refreshRecipeList() {
        recipeList.innerHTML = ""; // Clear current list

        recipes.forEach(recipe => {
            const li = document.createElement("li");
            li.innerHTML = `
                <strong>${recipe.name}</strong><br>
                ${recipe.instructions}
            `;
            recipeList.appendChild(li);
        });

        if (recipes.length === 0) {
            const li = document.createElement("li");
            li.textContent = "No recipes found.";
            li.style.fontStyle = "italic";
            recipeList.appendChild(li);
        }
    }

    /**
     * Logout the user
     */
    async function processLogout() {
        const token = sessionStorage.getItem("auth-token");

        try {
            const response = await fetch(`${BASE_URL}/logout`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                sessionStorage.clear();
                alert("You have been logged out successfully.");
                window.location.href = "login.html";
            } else {
                alert("Logout failed. Please try again.");
            }
        } catch (error) {
            console.error("Logout error:", error);
            alert("An error occurred during logout.");
        }
    }

});