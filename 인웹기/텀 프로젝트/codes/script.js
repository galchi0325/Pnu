// 기존 요소 가져오기
const mealList = document.getElementById("meal-list");
const todayMealDiv = document.getElementById("today-meal");
const modal = document.getElementById("modal");
const modalContent = document.getElementById("modal-content");
const overlay = document.getElementById("modal-overlay");

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

  allMeals = [];
  currentPage = 1;

  const fetches = data.meals.map(item =>
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${item.idMeal}`)
      .then(res => res.json())
      .then(json => json.meals[0])
  );

  allMeals = await Promise.all(fetches);
  renderMeals();
  renderPagination();
}

async function searchByIngredient() {
  const inputEl = document.getElementById("ingredientInput");
  const input = inputEl.value.trim();
  if (!input) {
    alert("재료를 입력해주세요!");
    return;
  }

  const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${input}`);
  const data = await res.json();
  inputEl.value = "";
  currentPage = 1;
  allMeals = [];

  if (!data.meals) {
    mealList.innerHTML = "<p>해당 재료로 만든 음식을 찾을 수 없습니다.</p>";
    return;
  }

  const fetches = data.meals.map(item =>
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${item.idMeal}`)
      .then(res => res.json())
      .then(json => json.meals[0])
  );

  allMeals = await Promise.all(fetches);
  renderMeals();
  renderPagination();
}

function displayMeal(meal, target) {
  const div = document.createElement("div");
  div.className = "meal";
  const isFav = isFavorite(meal.idMeal);
  div.innerHTML = `
    <img src="${meal.strMealThumb}" onclick="showDetails(${meal.idMeal})" />
    <h3>${meal.strMeal}</h3>
    <button class="favorite ${isFav ? 'hearted' : ''}" data-id="${meal.idMeal}">
      ${isFav ? "❤" : "🤍"}
    </button>
  `;
  const favBtn = div.querySelector(".favorite");
  favBtn.addEventListener("click", () => toggleFavorite(meal.idMeal, favBtn));
  target.appendChild(div);
}

async function showDetails(id) {
  try {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    const data = await res.json();
    const meal = data.meals[0];

    const cleanedInstructions = meal.strInstructions
      .split(/[\r\n]+|(?<=\.) /)
      .map(line => `<li>${line.trim()}</li>`)
      .join("");

    modalContent.innerHTML = `
      <h2>${meal.strMeal}</h2>
      <img src="${meal.strMealThumb}" width="200" />
      <p><strong>Ingredients:</strong></p>
      <ul>
        ${[...Array(20).keys()]
          .map(i => meal[`strIngredient${i+1}`] ? `<li>${meal[`strIngredient${i+1}`]} - ${meal[`strMeasure${i+1}`]}</li>` : '')
          .join('')}
      </ul>

      <button onclick="toggleInstructions()" class="button-primary" style="margin-top: 10px;">
        📖 조리법 보기
      </button>

      ${meal.strYoutube ? `
        <button onclick="window.open('${meal.strYoutube}', '_blank')" class="button-danger" style="margin-left: 10px;">
          ▶ 동영상 보기
        </button>
      ` : ''}

      <ol id="instructions" class="hidden" style="margin-top: 10px;">
        ${cleanedInstructions}
      </ol>
    `;

    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");
  } catch (error) {
    console.error("레시피 로딩 오류:", error);
    alert("레시피 정보를 불러오는 데 실패했습니다.");
  }
}


function closeModal() {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
}

window.addEventListener("click", function(e) {
  if (e.target === modal || e.target === overlay) {
    closeModal();
  }
});

document.getElementById("searchBtn").addEventListener("click", searchByIngredient);
document.getElementById("ingredientInput").addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    searchByIngredient();
  }
});
document.getElementById("randomBtn").addEventListener("click", showRandomMeal);

async function showRandomMeal() {
  const res = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
  const meal = (await res.json()).meals[0];
  todayMealDiv.innerHTML = `
    <h2>${meal.strMeal}</h2>
    <img src="${meal.strMealThumb}" width="200" style="cursor:pointer;" onclick="showDetails(${meal.idMeal})" />
  `;
}

function toggleFavorite(id, button) {
  let favs = getFavorites();
  const index = favs.indexOf(id);
  const isAdding = index === -1;

  if (isAdding) {
    favs.push(id);
  } else {
    favs.splice(index, 1);
  }

  saveFavorites(favs);
  loadFavorites();
  showTodayMeal();

  if (button) {
    button.classList.toggle("hearted", isAdding);
    button.innerHTML = isAdding ? "❤" : "🤍";
  }
}

function isFavorite(id) {
  const favs = getFavorites().map(String);
  return favs.includes(String(id));
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
      <img src="${meal.strMealThumb}" width="200" style="cursor:pointer;" onclick="showDetails(${meal.idMeal})" />
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

let allMeals = [];
let currentPage = 1;
const itemsPerPage = 16;

async function fetchAllMeals() {
  const res = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=");
  const data = await res.json();
  allMeals = data.meals;
  renderMeals();
  renderPagination();
}

function renderMeals() {
  mealList.innerHTML = "";
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const mealsToShow = allMeals.slice(start, end);
  mealsToShow.forEach(meal => {
    displayMeal(meal, mealList);
  });
}

function renderPagination() {
  const totalPages = Math.ceil(allMeals.length / itemsPerPage);
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  if (currentPage > 1) {
    const prev = document.createElement("button");
    prev.textContent = "이전";
    prev.onclick = () => {
      currentPage--;
      renderMeals();
      renderPagination();
    };
    pagination.appendChild(prev);
  }

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.style.margin = "0 5px";
    btn.style.fontWeight = i === currentPage ? "bold" : "normal";
    btn.onclick = () => {
      currentPage = i;
      renderMeals();
      renderPagination();
    };
    pagination.appendChild(btn);
  }

  if (currentPage < totalPages) {
    const next = document.createElement("button");
    next.textContent = "다음";
    next.onclick = () => {
      currentPage++;
      renderMeals();
      renderPagination();
    };
    pagination.appendChild(next);
  }
}

fetchAllMeals();
loadCategories();
loadFavorites();
showTodayMeal();

function toggleInstructions() {
  const el = document.getElementById("instructions");
  el.classList.toggle("hidden");
}
