const mealList = document.getElementById("meal-list");
const todayMealDiv = document.getElementById("today-meal");
const modal = document.getElementById("modal");
const modalContent = document.getElementById("modal-content");

function getFavorites() {
  return JSON.parse(localStorage.getItem("favorites") || "[]");
}

function saveFavorites(favs) {
  localStorage.setItem("favorites", JSON.stringify(favs));
}

async function loadCategories() {
  const res = await fetch("https://www.themealdb.com/api/json/v1/1/categories.php");
  const data = await res.json();
  const container = document.getElementById("category-buttons");

  data.categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.className = "category-button";
    btn.textContent = cat.strCategory;
    btn.onclick = () => fetchMealsByCategory(cat.strCategory);
    container.appendChild(btn);
  });
}

async function fetchMealsByCategory(category) {
  const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
  const data = await res.json();
  mealList.innerHTML = "";
  for (let item of data.meals) {
    const mealData = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${item.idMeal}`);
    const meal = (await mealData.json()).meals[0];
    displayMeal(meal, mealList);
  }
}

async function searchByIngredient() {
  const input = document.getElementById("ingredientInput").value.trim();
  if (!input) {
    alert("재료를 입력해주세요!");
    return;
  }
  const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${input}`);
  const data = await res.json();
  mealList.innerHTML = "";
  if (!data.meals) {
    mealList.innerHTML = "<p>해당 재료로 만든 음식을 찾을 수 없습니다.</p>";
    return;
  }
  for (let item of data.meals) {
    const mealData = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${item.idMeal}`);
    const meal = (await mealData.json()).meals[0];
    displayMeal(meal, mealList);
  }
}

function displayMeal(meal, target) {
  const div = document.createElement("div");
  div.className = "meal";
  div.innerHTML = `
    <img src="${meal.strMealThumb}" onclick="showDetails(${meal.idMeal})" />
    <h3>${meal.strMeal}</h3>
    <button class="favorite" onclick="toggleFavorite(${meal.idMeal})">
      ${isFavorite(meal.idMeal) ? "❤️" : "🤍"}
    </button>
  `;
  target.appendChild(div);
}

async function showDetails(id) {
  const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
  const meal = (await res.json()).meals[0];
  modalContent.innerHTML = `
    <h2>${meal.strMeal}</h2>
    <img src="${meal.strMealThumb}" width="200">
    <p><strong>Ingredients:</strong></p>
    <ul>
      ${[...Array(20).keys()]
        .map(i => meal[`strIngredient${i + 1}`] ? `<li>${meal[`strIngredient${i + 1}`]} - ${meal[`strMeasure${i + 1}`]}</li>` : '')
        .join('')}
    </ul>
    <p><strong>Instructions:</strong></p>
    <p>${meal.strInstructions}</p>
  `;
  modal.classList.remove("hidden");
}

function closeModal() {
  modal.classList.add("hidden");
}

function toggleFavorite(id) {
  let favs = getFavorites();
  if (favs.includes(id)) {
    favs = favs.filter(x => x !== id);
  } else {
    favs.push(id);
  }
  saveFavorites(favs);
  loadFavorites();
  showTodayMeal();
}

function isFavorite(id) {
  const favs = getFavorites();
  return favs.includes(id);
}

async function showTodayMeal() {
  const today = new Date().toDateString();
  const savedDate = localStorage.getItem("lastDate");
  let mealId = localStorage.getItem("todayMeal");

  if (today !== savedDate) {
    const favs = getFavorites();
    if (favs.length > 0) {
      mealId = favs[Math.floor(Math.random() * favs.length)];
      localStorage.setItem("todayMeal", mealId);
      localStorage.setItem("lastDate", today);
    }
  }

  if (mealId) {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
    const meal = (await res.json()).meals[0];
    todayMealDiv.innerHTML = `
      <h2>${meal.strMeal}</h2>
      <img src="${meal.strMealThumb}" width="200" />
    `;
  } else {
    todayMealDiv.innerHTML = "<p>좋아요한 레시피가 없습니다.</p>";
  }
}

async function loadFavorites() {
  const favs = getFavorites();
  const favContainer = document.getElementById("favorite-list");
  favContainer.innerHTML = "";

  for (let id of favs) {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    const meal = (await res.json()).meals[0];
    displayMeal(meal, favContainer);
  }
}

function pickRandomMeal() {
  const favs = getFavorites();
  if (favs.length === 0) {
    alert("즐겨찾기한 레시피가 없습니다.");
    return;
  }
  const randomMeal = favs[Math.floor(Math.random() * favs.length)];
  showDetails(randomMeal);
}

// 초기 실행
loadCategories();
loadFavorites();
showTodayMeal();
