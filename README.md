
# NutriFact — Food & Macro Tracker 🥗

> Search any food. Know exactly what you're eating. Hit your goals every day.

NutriFact is a responsive web application that lets you search a massive database of food products, instantly view their full nutritional breakdown, filter and sort by macros, and log meals to track your daily intake against personal targets — all in a clean, fast, dark-mode-first interface.

---

## Table of Contents

- [Purpose](#purpose)
- [Live Demo](#live-demo)
- [API Used](#api-used)
- [Core Features](#core-features)
- [Bonus Features](#bonus-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup & Running Locally](#setup--running-locally)
- [Best Practices Followed](#best-practices-followed)

---

## Purpose

Tracking macros manually is tedious. Most apps are bloated, paywalled, or require account signups just to look up a food item.

NutriFact solves this by giving you:
- **Instant macro lookup** for any food — no login, no paywall
- **Smart filtering** so you can find high-protein, low-carb, or low-calorie foods in seconds
- **A daily meal log** that saves to your browser so your progress persists without a backend
- **A clean, distraction-free UI** that works on mobile, tablet, and desktop

This project is built for the WAP (Web Application Programming) course as a graded individual project, demonstrating JavaScript proficiency, public API integration, array higher-order functions, and responsive UI development.

---

## Live Demo

> 🔗 Deployment link will be added here once live.

---

## API Used

### USDA FoodData Central API

| Property | Details |
|---|---|
| Base URL | `https://api.nal.usda.gov/fdc/v1` |
| Authentication | API Key required (included in `api.js`) |
| Format | JSON |
| Docs | https://fdc.nal.usda.gov/api-guide.html |

**Why this API:**
- Access to the official USDA database of standard reference, branded, and foundation foods.
- Returns high-fidelity macro and micronutrient data.
- Supports robust full-text search and pagination.
- Includes detailed nutrient unit names and values.

**Key endpoints used:**

```
# Search foods by keyword
GET https://api.nal.usda.gov/fdc/v1/foods/search?query={query}&pageSize=24&api_key={API_KEY}
```

**Sample response fields used:**
```json
{
  "fdcId": 123456,
  "description": "Chicken Breast",
  "foodNutrients": [
    { "nutrientName": "Energy", "value": 165, "unitName": "KCAL" },
    { "nutrientName": "Protein", "value": 31, "unitName": "G" },
    { "nutrientName": "Carbohydrate, by difference", "value": 0, "unitName": "G" },
    { "nutrientName": "Total lipid (fat)", "value": 3.6, "unitName": "G" }
  ]
}
```

---

## Core Features

#### 1. Food Search
- Search bar to look up any food by name (e.g. "chicken breast", "brown rice", "whey protein").
- Results displayed as cards showing: food description, and primary macros (Calories, Protein, Carbs, Fat).
- Empty state and no-results message handled gracefully.
- **HOF used:** `map()` to transform API response into display-ready HTML elements.

#### 2. Filter by Macro Range
- Interactive sliders for:
  - Minimum Protein
  - Maximum Calories
  - Maximum Fat
- Filters apply instantly on the current search results using pure JavaScript filters.
- **HOF used:** `filter()` — `foods.filter(f => f.protein >= minProtein && ...)`

#### 3. Sort Results
- Sort dropdown with options:
  - Highest Protein
  - Lowest Calories
  - Lowest Fat
  - Alphabetical (A → Z)
- Sort applies on top of active filters dynamically.
- **HOF used:** `sort()` — `foods.sort((a, b) => b.protein - a.protein)`

#### 4. Food Detail View
- Click "Add" or any food card to open a detailed modal showing:
  - Full macro breakdown: protein, carbs, fat, fiber, sugar, sodium.
  - Energy in kcal and kJ (calculated).
  - Serving size selector (grams).
  - Macros recalculate dynamically in real-time as the serving size changes.

#### 5. Daily Meal Log
- Add items with custom serving sizes to today's meal log.
- Track individual entries and their specific contributions to your daily intake.
- Remove individual items from the log with a single click.
- **HOF used:** `reduce()` to sum up totals across all log entries.

#### 6. Personal Targets
- Set your daily targets for Calories, Protein, Carbs, and Fat.
- Dynamic progress bars show your current intake vs. your goals.
- Visual warnings if you exceed your daily calorie limit or fat target.
- Targets are saved to LocalStorage and persist across refreshes.

#### 7. Dark Mode Persistence
- A sleek, modern dark mode toggle.
- Theme preference is saved to LocalStorage, ensuring the app remembers your choice on next visit.

#### 8. Responsive Sidebar / Mobile Log
- On desktop, the meal log is a dedicated sidebar for quick viewing.
- On mobile, it collapses into an accessible bottom panel to save screen space while keeping tracking intuitive.

---

## Bonus Features

#### Debouncing on Search
- Prevents expensive API calls by waiting for the user to stop typing (1000ms delay).
- Improves responsiveness and respects API rate limits.

#### Skeleton Loading Screens
- While fetching data, "shimmering" skeleton cards are shown to provide immediate visual feedback.
- Eliminates jarring layout shifts during data transitions.

#### Favourite Foods
- Toggle "Star" on any food card to save it to your favourites.
- View all your favourite foods at once with a dedicated toggle.
- Data persists via LocalStorage for a truly personalized experience.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Markup | HTML5 (semantic elements) |
| Styling | CSS3 (Flexbox, Grid, Custom Properties) |
| Logic | Vanilla JavaScript (ES6+ Modules) |
| API | USDA FoodData Central (Fetch API) |
| Storage | LocalStorage (Web Storage API) |

No frameworks (React, Vue, jQuery) are used. This is a pure Vanilla JS application.

---

## Project Structure

```
nutrifact/
├── index.html              # Main app structure
├── css/
│   ├── reset.css           # Global reset
│   ├── variables.css       # Design tokens (colors, fonts)
│   ├── layout.css          # Core page structure
│   ├── components.css      # Reusable UI components
│   ├── dark-mode.css       # Theme overrides
│   └── responsive.css      # Mobile/Tablet breakpoints
├── js/
│   ├── api.js              # USDA API integration
│   ├── render.js           # DOM manipulation & templates
│   ├── filter.js           # Filter/Sort algorithms (HOFs)
│   ├── log.js              # Meal log management
│   ├── storage.js          # LocalStorage utilities
│   ├── targets.js          # Goal tracking & progress bars
│   ├── debounce.js         # Input optimization
│   └── app.js              # App initialization & events
└── assets/                 # SVGs and Icons
```

---

## Setup & Running Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/nsaky/nutrifact-macro-tracker.git
   cd nutrifact
   ```

2. **Run a local server:**
   The Fetch API requires an HTTP server to function correctly. You can use VS Code's **Live Server** extension or Python:
   ```bash
   python -m http.server 5500
   ```

3. **Open the app:**
   Navigate to `http://localhost:5500` in your browser.

---

## Best Practices Followed

- **Modular Architecture**: Logic is cleanly split across specialized modules (API, UI, Storage).
- **Strict HOF Usage**: Zero `for` or `while` loops; all data processing uses `map`, `filter`, `sort`, and `reduce`.
- **CSS Variable System**: Centralized design tokens for easy maintenance.
- **Zero-Dependency**: No external libraries or frameworks for maximum performance.
- **Accessibility**: ARIA labels, semantic tags, and keyboard-friendly interactions.

---

*Built for the WAP Individual Project — modern web development with zero dependencies.*
ancement** — core search and display works without JS-dependent features.

---

*Built for the WAP Individual Project — demonstrating JavaScript, API integration, array HOFs, and responsive UI development.*