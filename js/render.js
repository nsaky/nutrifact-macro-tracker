import { saveData, loadData } from './storage.js';
import { addToLog } from './log.js';

let currentOpenFood = null;
let favourites = loadData('nutrifact-favourites', []);

export function renderSkeletons(container, count) {
  const skeletonsHtml = Array.from({ length: count }, () => `
    <div class="skeleton-card">
      <div class="skeleton-content">
        <div class="skeleton-title"></div>
        <div class="skeleton-macros">
          <div class="skeleton-macro"></div>
          <div class="skeleton-macro"></div>
        </div>
      </div>
    </div>
  `).join('');
  container.innerHTML = skeletonsHtml;
}

export function renderFoods(container, rawFoodsArray) {
  const foodsHtml = rawFoodsArray.map((food, index) => {
    const isFavourite = favourites.find(f => f.fdcId === food.fdcId);
    const starClass = isFavourite ? 'active ph-fill' : 'ph';
    const name = food.description || 'Unknown Food';
    const nutrients = food.foodNutrients || [];

    const getNutrient = (searchName) => {
      const match = nutrients.find(n => n.nutrientName && n.nutrientName.toLowerCase().includes(searchName.toLowerCase()));
      return match ? `${match.value}${match.unitName.toLowerCase()}` : '0g'; 
    };

    return `
      <div class="food-card" data-index="${index}">
        <button class="star-btn" data-index="${index}" title="Favorite">
          <i class="ph-star ${starClass}"></i>
        </button>
        <div class="food-card-content">
          <h3 class="food-card-title">${name}</h3>
          <div class="macro-pills">
            <span class="macro-pill cals">${getNutrient('energy')}</span>
            <span class="macro-pill prot">${getNutrient('protein')}</span>
            <span class="macro-pill carb">${getNutrient('carbohydrate')}</span>
            <span class="macro-pill fat">${getNutrient('total lipid')}</span>
          </div>
          <button class="add-btn" data-index="${index}"><i class="ph ph-plus"></i> Add</button>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = foodsHtml;

  
  container.querySelectorAll('.add-btn').forEach(btn => {
    btn.addEventListener('click', () => openModal(rawFoodsArray[btn.dataset.index]));
  });

  
  container.querySelectorAll('.star-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleFavourite(rawFoodsArray[btn.dataset.index], btn);
    });
  });
}

function toggleFavourite(food, btn) {
  const exists = favourites.find(f => f.fdcId === food.fdcId);
  if (exists) {
    favourites = favourites.filter(f => f.fdcId !== food.fdcId);
    btn.classList.remove('active');
  } else {
    favourites.push(food);
    btn.classList.add('active');
  }
  saveData('nutrifact-favourites', favourites);
}

export function renderWelcomeState(container) {
  container.innerHTML = `
    <div class="empty-state">
      <h3>Welcome to NutriFact</h3>
      <p>Start by searching for a food in the bar above.</p>
    </div>
  `;
}

export function renderEmptyState(container, message) {
  container.innerHTML = `
    <div class="empty-state">
      <h3>No Results Found</h3>
      <p>${message}</p>
    </div>
  `;
}

const modal = document.getElementById('food-modal');
const servingSizeInput = document.getElementById('serving-size');
const closeBtn = document.querySelector('.modal-close');
const overlay = document.querySelector('.modal-overlay');
const addBtn = document.getElementById('add-to-log-btn');

function getMacroValue(food, searchName) {
  const match = (food.foodNutrients || []).find(n => n.nutrientName && n.nutrientName.toLowerCase().includes(searchName.toLowerCase()));
  return match ? parseFloat(match.value) : 0;
}

function updateModalMacros() {
  if (!currentOpenFood) return;
  const servingSize = parseFloat(servingSizeInput.value) || 0;
  const factor = servingSize / 100;
  const ids = ['calories', 'kj', 'protein', 'carbs', 'fat', 'fiber', 'sugar', 'sodium'];
  const searches = ['energy', 'energy', 'protein', 'carbohydrate', 'total lipid', 'fiber', 'sugar', 'sodium'];
  
  searches.forEach((s, i) => {
    const val = getMacroValue(currentOpenFood, s);
    let final = val * factor;
    if (ids[i] === 'kj') final *= 4.184;
    document.getElementById(`modal-${ids[i]}`).textContent = final.toFixed(1) + (i > 1 && i < 7 ? 'g' : i === 7 ? 'mg' : '');
  });
}

function openModal(food) {
  currentOpenFood = food;
  if (servingSizeInput) servingSizeInput.value = 100;
  
  const titleEl = document.getElementById('modal-title');
  if (titleEl) titleEl.textContent = food.description || 'Unknown Food';
  
  const imgContainer = document.querySelector('.modal-img-container');
  if (imgContainer) imgContainer.style.display = 'none'; 
  
  updateModalMacros();
  if (modal) modal.classList.remove('hidden');
}

function closeModal() {
  modal.classList.add('hidden');
  currentOpenFood = null;
}

if (servingSizeInput) servingSizeInput.addEventListener('input', updateModalMacros);
if (closeBtn) closeBtn.addEventListener('click', closeModal);
if (overlay) overlay.addEventListener('click', closeModal);

if (addBtn) {
  addBtn.addEventListener('click', () => {
    addBtn.classList.add('loading');
    setTimeout(() => {
      const servingSize = parseFloat(servingSizeInput.value) || 100;
      addToLog(currentOpenFood, servingSize);
      addBtn.classList.remove('loading');
      closeModal();
    }, 500);
  });
}
