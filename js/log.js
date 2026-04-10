import { saveData, loadData } from './storage.js';
import { updateProgressBars } from './targets.js';

let mealLog = loadData('nutrifact-meal-log', []);

export function addToLog(foodItem, servingSize) {
  const factor = servingSize / 100;
  
  const getVal = (name) => {
    const match = (foodItem.foodNutrients || []).find(n => n.nutrientName.toLowerCase().includes(name.toLowerCase()));
    return match ? parseFloat(match.value) : 0;
  };

  const loggedItem = {
    id: Date.now(),
    name: foodItem.description,
    servingSize,
    calories: getVal('energy') * factor,
    protein: getVal('protein') * factor,
    carbs: getVal('carbohydrate') * factor,
    fat: getVal('total lipid') * factor
  };

  mealLog.push(loggedItem);
  saveData('nutrifact-meal-log', mealLog);
  renderLog();
}

export function removeFromLog(itemId) {
  mealLog = mealLog.filter(item => item.id !== itemId);
  saveData('nutrifact-meal-log', mealLog);
  renderLog();
}

export function clearLog() {
  mealLog = [];
  saveData('nutrifact-meal-log', mealLog);
  renderLog();
}

export function renderLog() {
  const logList = document.getElementById('log-list');
  const totalDisplay = document.getElementById('total-calories');
  if (!logList) return;

  if (mealLog.length === 0) {
    logList.innerHTML = `
      <div class="empty-log-msg">
        <p>No foods logged today.</p>
        <span>Track your macros fast by adding foods above!</span>
      </div>
    `;
  } else {
    logList.innerHTML = mealLog.map(item => `
      <li class="log-item">
        <div class="log-item-info">
          <strong>${item.name}</strong>
          <span>${item.servingSize}g • ${item.calories.toFixed(0)} kcal</span>
        </div>
        <button class="remove-log-item" data-id="${item.id}" aria-label="Remove item">×</button>
      </li>
    `).join('');

    
    logList.querySelectorAll('.remove-log-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id);
        removeFromLog(id);
      });
    });
  }

  const totals = mealLog.reduce((acc, curr) => ({
    calories: acc.calories + curr.calories,
    protein: acc.protein + curr.protein,
    carbs: acc.carbs + curr.carbs,
    fat: acc.fat + curr.fat
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  if (totalDisplay) totalDisplay.textContent = totals.calories.toFixed(0);
  updateProgressBars(totals);
}
