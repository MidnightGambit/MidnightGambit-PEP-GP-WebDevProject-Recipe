/**
 * This script defines the add, view, and delete operations for Ingredient objects in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

let ingredients = [];

// Get references to DOM elements
const addIngredientNameInput = document.getElementById("add-ingredient-name-input");
const deleteIngredientNameInput = document.getElementById("delete-ingredient-name-input");
const ingredientListContainer = document.getElementById("ingredient-list");
const addButton = document.getElementById("add-ingredient-submit-button");
const deleteButton = document.getElementById("delete-ingredient-submit-button");

// Attach event listeners
addButton.addEventListener("click", addIngredient);
deleteButton.addEventListener("click", deleteIngredient);

// Load ingredients when the page loads
window.addEventListener("DOMContentLoaded", () => {
    getIngredients();
});

/**
 * Add a new ingredient
 */
async function addIngredient() {
    const name = addIngredientNameInput.value.trim();

    if (!name) {
        alert("Please enter an ingredient name.");
        return;
    }

    const token = sessionStorage.getItem("auth-token");

    if (!token) {
        alert("You must be logged in to add ingredients.");
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/ingredients`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ name: name })
        });

        if (response.ok) {
            alert("Ingredient added successfully!");
            addIngredientNameInput.value = "";   // clear input
            await getIngredients();              // refresh list
        } else {
            const errorText = await response.text();
            alert(`Failed to add ingredient: ${errorText || response.status}`);
        }
    } catch (error) {
        console.error("Add ingredient error:", error);
        alert("An error occurred while adding the ingredient.");
    }
}

/**
 * Fetch all ingredients from the backend
 */
async function getIngredients() {
    try {
        const response = await fetch(`${BASE_URL}/ingredients`);

        if (response.ok) {
            ingredients = await response.json();
            refreshIngredientList();
        } else {
            alert("Failed to load ingredients.");
        }
    } catch (error) {
        console.error("Get ingredients error:", error);
        alert("Could not load ingredients. Please check if the server is running.");
    }
}

/**
 * Delete an ingredient
 */
async function deleteIngredient() {
    const name = deleteIngredientNameInput.value.trim();

    if (!name) {
        alert("Please enter the ingredient name to delete.");
        return;
    }

    // Find the ingredient in our current list
    const ingredientToDelete = ingredients.find(ing => 
        ing.name.toLowerCase() === name.toLowerCase()
    );

    if (!ingredientToDelete) {
        alert("Ingredient not found. Please check the name.");
        return;
    }

    const token = sessionStorage.getItem("auth-token");

    if (!token) {
        alert("You must be logged in to delete ingredients.");
        return;
    }

    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/ingredients/${ingredientToDelete.id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.ok) {
            alert("Ingredient deleted successfully!");
            deleteIngredientNameInput.value = "";
            await getIngredients();   // refresh list
        } else {
            alert("Failed to delete ingredient.");
        }
    } catch (error) {
        console.error("Delete ingredient error:", error);
        alert("An error occurred while deleting the ingredient.");
    }
}

/**
 * Refresh the ingredient list in the DOM
 */
function refreshIngredientList() {
    ingredientListContainer.innerHTML = ""; // clear current list

    if (ingredients.length === 0) {
        const li = document.createElement("li");
        li.textContent = "No ingredients found.";
        li.style.fontStyle = "italic";
        ingredientListContainer.appendChild(li);
        return;
    }

    ingredients.forEach(ingredient => {
        const li = document.createElement("li");
        const p = document.createElement("p");
        p.textContent = ingredient.name;
        li.appendChild(p);
        ingredientListContainer.appendChild(li);
    });
}