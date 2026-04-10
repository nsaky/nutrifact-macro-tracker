import { debounce } from './debounce.js';
import { searchFoods } from './api.js';
import { renderSkeletons, renderFoods, renderEmptyState, renderWelcomeState } from './render.js';
import { processFoods } from './filter.js';
import { renderLog, clearLog } from './log.js';
import { setupTargetListeners } from './targets.js';
import { loadData } from './storage.js';

let currentFoods = [];
let showingFavourites = false;

const searchInput = document.getElementById('search-input');
const resultsGrid = document.querySelector('.results-grid');
const toggleFavBtn = document.getElementById('toggle-favourites');
const themeToggleBtn = document.getElementById('theme-toggle');
const filtersBar = document.querySelector('.filters-bar');

const filterMinProtein = document.getElementById('min-protein');
const filterMaxCalories = document.getElementById('max-calories');
const filterMaxFat = document.getElementById('max-fat');
const sortByDropdown = document.getElementById('sort-by');

const proteinValDisplay = document.getElementById('protein-val');
const caloriesValDisplay = document.getElementById('calories-val');
const fatValDisplay = document.getElementById('fat-val');


const resetModal = document.getElementById('reset-modal');
const openResetBtn = document.getElementById('open-reset-modal');
const confirmResetYes = document.getElementById('confirm-reset-yes');
const confirmResetNo = document.getElementById('confirm-reset-no');

const updateFilterVisibility = () => {
  const query = searchInput.value.trim();
  if (showingFavourites) {
    filtersBar?.classList.add('hidden');
  } else if (!query) {
    filtersBar?.classList.add('hidden');
    renderWelcomeState(resultsGrid);
  } else if (currentFoods.length > 0) {
    filtersBar?.classList.remove('hidden');
  }
};

const applyFilters = () => {
  if (showingFavourites || !currentFoods.length) return;
  const minProtein = parseInt(filterMinProtein?.value || 0, 10);
  const maxCalories = parseInt(filterMaxCalories?.value || 1000, 10);
  const maxFat = parseInt(filterMaxFat?.value || 100, 10);
  const sortType = sortByDropdown?.value || 'default';

  if (proteinValDisplay) proteinValDisplay.textContent = `${minProtein}g`;
  if (caloriesValDisplay) caloriesValDisplay.textContent = `${maxCalories}`;
  if (fatValDisplay) fatValDisplay.textContent = `${maxFat}g`;

  const processed = processFoods(currentFoods, { minProtein, maxCalories, maxFat }, sortType);
  if (processed.length === 0) {
    renderEmptyState(resultsGrid, "No items match your filter criteria.");
  } else {
    renderFoods(resultsGrid, processed);
  }
};

[filterMinProtein, filterMaxCalories, filterMaxFat, sortByDropdown].forEach(el => {
  el?.addEventListener('input', applyFilters);
});

if (searchInput) {
  const handleSearch = async (event) => {
    const query = event.target.value.trim();
    showingFavourites = false;
    toggleFavBtn?.classList.remove('active');
    
    if (!query) {
      currentFoods = [];
      updateFilterVisibility();
      return;
    }

    renderSkeletons(resultsGrid, 8);
    const data = await searchFoods(query);
    if (!data || !data.foods || data.foods.length === 0) {
      currentFoods = [];
      renderEmptyState(resultsGrid, `No matches for "${query}".`);
      filtersBar?.classList.add('hidden');
    } else {
      currentFoods = data.foods;
      updateFilterVisibility();
      applyFilters();
    }
  };
  searchInput.addEventListener('input', debounce(handleSearch, 1000));
}


if (toggleFavBtn) {
  toggleFavBtn.addEventListener('click', () => {
    showingFavourites = !showingFavourites;
    toggleFavBtn.classList.toggle('active');
    
    if (showingFavourites) {
      filtersBar?.classList.add('hidden');
      const favs = loadData('nutrifact-favourites', []);
      if (favs.length === 0) renderEmptyState(resultsGrid, "No favourites saved yet.");
      else renderFoods(resultsGrid, favs);
    } else {
      updateFilterVisibility();
      if (currentFoods.length > 0) applyFilters();
      else renderWelcomeState(resultsGrid);
    }
  });
}


openResetBtn?.addEventListener('click', () => resetModal.classList.remove('hidden'));
confirmResetNo?.addEventListener('click', () => resetModal.classList.add('hidden'));
confirmResetYes?.addEventListener('click', () => {
  clearLog();
  resetModal.classList.add('hidden');
});


themeToggleBtn?.addEventListener('click', (e) => {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  localStorage.setItem('nutrifact-theme', isDark ? 'dark' : 'light');
  e.target.textContent = isDark ? '☀️' : '🌙';
});


const mobileLogToggle = document.getElementById('mobile-log-toggle');
const asideLog = document.querySelector('.meal-log');
if (mobileLogToggle && asideLog) {
  mobileLogToggle.addEventListener('click', () => {
    asideLog.classList.toggle('aside-open');
    document.body.classList.toggle('aside-active');
    const isOpen = asideLog.classList.contains('aside-open');
    mobileLogToggle.innerHTML = isOpen ? 'close target <span>︾</span>' : 'Daily Target <span>︽</span>';
  });
}

function init() {
  renderLog();
  setupTargetListeners();
  
  const savedTheme = localStorage.getItem('nutrifact-theme') || 'light';
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    if (themeToggleBtn) themeToggleBtn.textContent = '☀️';
  }
  
  updateFilterVisibility();
}

init();
