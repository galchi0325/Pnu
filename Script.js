const mealList = document.getElementById("meal-list");
const todayMealDiv = document.getElementById("today-meal");
const modal = document.getElementById("modal");
const modalContent = document.getElementById("modal-content");

async function fetchMeals(keyword = "") {
  const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${keyword}`);
  const data = await res.json();
  mealList.innerHTML = ""; // 검색할 때마다 초기화
  if (data.meals) {
    displayMeals(data.meals);
  } else {
    mealList.innerHTML = "<p>검색 결과가 없습니다.</p>";
  }
}

function displayMeals(meals) {
  meals.forEach(meal => {
    const div = document.createElement("div");
    div.className = "meal";
    div.innerHTML = `
      <img src="${meal.strMealThumb}" onclick="showDetails(${meal.idMeal})" />
      <h3 onclick="showDetails(${meal.idMeal})">${meal.strMeal}</h3>
      <button class="favorite" onclick="toggleFavorite(event, ${meal.idMeal})">
        ${isFavorite(meal.idMeal) ? "❤️" : "🤍"}
      </button>
    `;
    mealList.appendChild(div);
  });
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
        .map(i => meal[`strIngredient${i+1}`] ? `<li>${meal[`strIngredient${i+1}`]} - ${meal[`strMeasure${i+1}`]}</li>` : '')
        .join('')}
    </ul>
  `;
  modal.classList.remove("hidden");
}

function closeModal() {
  modal.classList.add("hidden");
}

function toggleFavorite(event, id) {
  event.stopPropagation(); // 클릭 이벤트가 부모로 전달되지 않게 막음
  let favs = JSON.parse(localStorage.getItem("favorites")) || [];
  if (favs.includes(id)) {
    favs = favs.filter(x => x !== id);
  } else {
    favs.push(id);
  }
  localStorage.setItem("favorites", JSON.stringify(favs));
  fetchMeals(document.getElementById("searchInput").value); // 하트 갱신
  showTodayMeal(); // 오늘 추천 음식도 갱신
}

function isFavorite(id) {
  const favs = JSON.parse(localStorage.getItem("favorites")) || [];
  return favs.includes(id);
}

async function showTodayMeal() {
  const today = new Date().toDateString();
  const savedDate = localStorage.getItem("lastDate");
  let mealId = localStorage.getItem("todayMeal");

  if (today !== savedDate) {
    const favs = JSON.parse(localStorage.getItem("favorites")) || [];
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
    todayMealDiv.innerHTML = "<p>좋아요한 음식이 없습니다.</p>";
  }
}

function searchMeals() {
  const keyword = document.getElementById("searchInput").value.trim();
  fetchMeals(keyword);
}

async function pickRandomMeal() {
  const favs = JSON.parse(localStorage.getItem("favorites")) || [];
  let mealId;

  if (favs.length > 0) {
    mealId = favs[Math.floor(Math.random() * favs.length)];
  } else {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/random.php`);
    const meal = (await res.json()).meals[0];
    mealId = meal.idMeal;
  }

  const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
  const meal = (await res.json()).meals[0];

  todayMealDiv.innerHTML = `
    <h2>${meal.strMeal}</h2>
    <img src="${meal.strMealThumb}" width="200" />
  `;

  localStorage.setItem("todayMeal", mealId);
  localStorage.setItem("lastDate", new Date().toDateString());
}

fetchMeals();
showTodayMeal();
