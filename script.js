const searchBtn = document.getElementById('search-btn');
const mealList = document.getElementById('meal');
const mealDetailsContent = document.querySelector('.meal-details-content');
const recipeCloseBtn = document.getElementById('recipe-close-btn');
const apiKey = 'd0a53956ab8545dc8c9f7c66fa66d2ca'; // Replace with your Spoonacular API key

// Event listeners
searchBtn.addEventListener('click', getMealList);
mealList.addEventListener('click', getMealRecipe);
recipeCloseBtn.addEventListener('click', () => {
    mealDetailsContent.parentElement.classList.remove('showRecipe');
});

// Get meal list that matches with the ingredients
function getMealList() {
    let searchInputTxt = document.getElementById('search-input').value.trim();
    
    if (!searchInputTxt) {
        alert("Please enter an ingredient.");
        return;
    }
    
    fetch(`https://api.spoonacular.com/recipes/findByIngredients?ingredients=${searchInputTxt}&apiKey=${apiKey}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        let html = "";
        if (data.length > 0) {
            data.forEach(meal => {
                html += `
                    <div class="meal-item" data-id="${meal.id}">
                        <div class="meal-img">
                            <img src="${meal.image}" alt="${meal.title}">
                        </div>
                        <div class="meal-name">
                            <h3>${meal.title}</h3>
                            <a href="#" class="recipe-btn">Get Recipe</a>
                        </div>
                    </div>
                `;
            });
            mealList.classList.remove('notFound');
        } else {
            html = "Sorry, we didn't find any meal!";
            mealList.classList.add('notFound');
        }
        mealList.innerHTML = html;
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        mealList.innerHTML = "An error occurred while fetching meals.";
    });
}

// Get recipe of the meal
function getMealRecipe(e) {
    e.preventDefault();
    if (e.target.classList.contains('recipe-btn')) {
        let mealItem = e.target.parentElement.parentElement;
        fetch(`https://api.spoonacular.com/recipes/${mealItem.dataset.id}/information?apiKey=${apiKey}`)
        .then(response => response.json())
        .then(data => mealRecipeModal(data));
    }
}

// Create a modal
function mealRecipeModal(meal) {
    let html = `
        <h2 class="recipe-title">${meal.title}</h2>
        <p class="recipe-category">${meal.cuisine ? meal.cuisine.join(', ') : 'Various'}</p>
        <div class="recipe-instruct">
            <h3>Instructions:</h3>
            <p>${meal.instructions ? meal.instructions : 'No instructions available.'}</p>
        </div>
        <div class="recipe-meal-img">
            <img src="${meal.image}" alt="">
        </div>
        <div class="recipe-link">
            <a href="${meal.sourceUrl}" target="_blank">View Full Recipe</a>
        </div>
    `;
    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add('showRecipe');
}