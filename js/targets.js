import { saveData, loadData } from './storage.js';

const defaultTargets = { calories: 2000, protein: 150, carbs: 250, fat: 70 };
let currentTargets = loadData('nutrifact-targets', defaultTargets);

// Module-level variable to store current totals for real-time target adjustment
let latestTotals = { calories: 0, protein: 0, carbs: 0, fat: 0 };

export function updateProgressBars(currentTotals) {
  // Store these totals so we can re-apply them when target inputs change
  latestTotals = { ...currentTotals };

  const bars = {
    calories: document.getElementById('progress-calories'),
    protein: document.getElementById('progress-protein'),
    carbs: document.getElementById('progress-carbs'),
    fat: document.getElementById('progress-fat')
  };

  const textSpans = {
    calories: document.getElementById('target-text-calories'),
    protein: document.getElementById('target-text-protein'),
    carbs: document.getElementById('target-text-carbs'),
    fat: document.getElementById('target-text-fat')
  };

  const warnings = {
    calories: document.getElementById('warn-calories'),
    protein: document.getElementById('warn-protein'),
    carbs: document.getElementById('warn-carbs'),
    fat: document.getElementById('warn-fat')
  };

  Object.keys(bars).forEach(key => {
    const bar = bars[key];
    const textSpan = textSpans[key];
    const warnEl = warnings[key];
    if (!bar) return;

    const total = latestTotals[key] || 0;
    const targetValue = currentTargets[key] || 1; 
    const percentage = Math.min((total / targetValue) * 100, 100);

    // Update Bar Width
    bar.style.width = `${percentage}%`;
    
    // Update Text Numerical Display
    if (textSpan) {
      const unit = key === 'calories' ? '' : 'g';
      textSpan.textContent = `${total.toFixed(0)}${unit} / ${targetValue}${unit}`;
    }

    // Update Colors
    bar.classList.remove('progress-good', 'progress-warn', 'progress-danger');
    if (percentage < 75) bar.classList.add('progress-good');
    else if (percentage <= 100) bar.classList.add('progress-warn');
    else bar.classList.add('progress-danger');

    // Handle Warnings Logic
    if (warnEl) {
      if (total > targetValue) {
        const diff = (total - targetValue).toFixed(0);
        const unit = key === 'calories' ? 'kcal' : 'g';
        warnEl.innerHTML = `⚠️ Over target by ${diff}${unit}`;
        warnEl.classList.remove('hidden');
        const ratio = (total / targetValue);
        warnEl.classList.toggle('warn-yellow', ratio < 1.15);
      } else {
        warnEl.classList.add('hidden');
      }
    }
  });
}

export function setupTargetListeners() {
  const inputs = {
    calories: document.getElementById('target-calories'),
    protein: document.getElementById('target-protein'),
    carbs: document.getElementById('target-carbs'),
    fat: document.getElementById('target-fat')
  };

  Object.keys(inputs).forEach(key => {
    const input = inputs[key];
    if (!input) return;
    input.value = currentTargets[key];
    input.addEventListener('input', (e) => {
      currentTargets[key] = parseFloat(e.target.value) || 0;
      saveData('nutrifact-targets', currentTargets);
      updateProgressBars(latestTotals);
    });
  });
}
