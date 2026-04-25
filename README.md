
# NutriFact — Food & Macro Tracker 🥗

> Search any food. Know exactly what you're eating. Hit your goals every day.

NutriFact is a responsive web application that lets you search a database of 3 million+ food products, instantly view their full nutritional breakdown, filter and sort by macros, and log meals to track your daily intake against personal targets — all in a clean, fast, dark-mode-first interface.

---

## Table of Contents

- [Purpose](#purpose)
- [Live Demo](#live-demo)
- [API Used](#api-used)
- [Planned Features](#planned-features)
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
- Instant macro lookup for any food — no login, no paywall
- Smart filtering so you can find high-protein, low-carb, or low-calorie foods in seconds
- A daily meal log that saves to your browser so your progress persists without a backend
- A clean, distraction-free UI that works on mobile, tablet, and desktop

This project is built for the WAP (Web Application Programming) course as a graded individual project, demonstrating JavaScript proficiency, public API integration, array higher-order functions, and responsive UI development.

---

## Live Demo

[nutrifact-ten.vercel.app](https://nutrifact-ten.vercel.app)

---

## API Used

### USDA FoodData Central API

| Property | Details |
|---|---|
| Base URL | `https://api.nal.usda.gov/fdc/v1` |
| Authentication | API Key required (provided in `js/api.js`) |
| Format | JSON |
| Docs | [fdc.nal.usda.gov/api-guide.html](https://fdc.nal.usda.gov/api-guide.html) |
| License | Public Domain (U.S. Government) |

**Why this API:**
- Access to the most authoritative source of food nutrient data in the US
- Returns complete macro and micronutrient data per product
- Supports full-text search and pagination out of the box
- Robust and reliable performance

**Key endpoints used:**

```
# Search foods by keyword
GET https://api.nal.usda.gov/fdc/v1/foods/search?query={query}&pageSize=24&api_key={API_KEY}
```

**Sample response fields used:**
```json
{
  "description": "Chicken Breast",
  "foodNutrients": [
    { "nutrientName": "Energy", "value": 165, "unitName": "KCAL" },
    { "nutrientName": "Protein", "value": 31, "unitName": "G" },
    { "nutrientName": "Carbohydrate, by difference", "value": 0, "unitName": "G" },
    { "nutrientName": "Total lipid (fat)", "value": 3.6, "unitName": "G" }
  ],
  "fdcId": 123456
}
```

---

## Planned Features

### Core Features

#### 1. Food Search
- Search bar to look up any food by name (e.g. "chicken breast", "brown rice", "whey protein")
- Results displayed as cards showing: food name, image, calories, protein, carbs, fat per 100g
- Empty state and no-results message handled gracefully
- **HOF used:** `map()` to transform raw API response into display-ready card objects

#### 2. Filter by Macro Range
- Slider or input-based filters for:
  - Minimum protein per 100g (e.g. show only foods with ≥ 20g protein)
  - Maximum calories per 100g (e.g. show only foods under 200 kcal)
  - Maximum fat per 100g
- Filters apply instantly on the currently loaded results without re-fetching
- **HOF used:** `filter()` — e.g. `foods.filter(f => f.protein >= minProtein && f.calories <= maxCalories)`

#### 3. Sort Results
- Sort dropdown with options:
  - Highest protein first
  - Lowest calories first
  - Lowest fat first
  - Alphabetical (A → Z)
- Sort applies on top of active filters
- **HOF used:** `sort()` — e.g. `foods.sort((a, b) => b.protein - a.protein)`

#### 4. Food Detail View
- Click any food card to open a detailed modal/panel showing:
  - Full macro breakdown: protein, carbs, fat, fiber, sugar, sodium
  - Energy in kcal and kJ
  - Serving size selector (per 100g / per custom grams)
  - Macros recalculate dynamically when serving size is changed
- Add to Meal Log button in the detail view

#### 5. Daily Meal Log
- Add any food (with custom serving size in grams) to today's meal log
- Log shows each entry: food name, grams, and macros for that serving
- Running daily totals displayed at the top: total kcal, protein, carbs, fat
- Remove individual entries from the log
- Log persists via LocalStorage — survives page refresh
- **HOF used:** `reduce()` to sum up macros across all log entries

#### 6. Personal Targets
- Set your daily targets: calories, protein, carbs, fat
- Progress bar for each macro showing current vs target
- Targets saved to LocalStorage
- Visual indicator (green/amber/red) based on how close you are to each target

#### 7. Dark Mode / Light Mode Toggle
- Toggle button in the navbar
- Preference saved to LocalStorage so it persists across sessions
- Smooth CSS transition between themes

#### 8. Fully Responsive UI
- Mobile-first layout
- Food cards grid: 1 column on mobile, 2 on tablet, 3–4 on desktop
- Meal log collapses into a bottom panel on mobile
- Tested on 320px, 768px, 1024px, 1440px breakpoints

---

### Bonus Features

#### Debouncing on Search Input
- Instead of firing an API call on every keystroke, debounce the search input by 500ms
- Prevents unnecessary API calls and improves performance
- Implementation: custom `debounce()` utility function wrapping the fetch call

#### Loading Indicators / Skeleton Screens
- While API call is in progress, show skeleton card placeholders instead of a blank screen
- Prevents layout shift and gives the user immediate visual feedback
- Loading spinner shown inside the "Add to log" button while adding

#### LocalStorage Persistence
- Meal log entries persist across page reloads
- Daily macro targets persist
- Dark/light mode preference persists
- Favourited foods persist (if favourites feature is added)

#### Favourite Foods
- Star/heart button on each food card to mark as favourite
- Dedicated "Favourites" tab showing all saved foods
- Favourites stored in LocalStorage
- **HOF used:** `filter()` to display only favourited items, `find()` to toggle favourite status

---

## Tech Stack

| Layer | Technology |
|---|---|
| Markup | HTML5 (semantic elements) |
| Styling | CSS3 (Flexbox, Grid, CSS Variables, Media Queries) |
| Logic | Vanilla JavaScript (ES6+) |
| API calls | Fetch API (native, no libraries) |
| Data persistence | LocalStorage (Web Storage API) |
| Version control | Git + GitHub |
| Deployment | GitHub Pages / Netlify / Vercel |

No frameworks (React, Vue, etc.) are used. No jQuery. Pure HTML, CSS, and JavaScript.

Optional: Tailwind CSS may be used for utility classes if styling becomes a bottleneck — but vanilla CSS is the first approach.

---

## Project Structure

```
nutrifact/
│
├── index.html              # Main HTML file — app shell
│
├── css/
│   ├── reset.css           # CSS reset / normalize
│   ├── variables.css       # CSS custom properties (colors, spacing, fonts)
│   ├── layout.css          # Grid, flexbox, page structure
│   ├── components.css      # Cards, modals, buttons, inputs
│   ├── dark-mode.css       # Dark mode overrides
│   └── responsive.css      # Media queries for all breakpoints
│
├── js/
│   ├── api.js              # All fetch calls — search, get product, category
│   ├── render.js           # DOM rendering — cards, modal, log entries
│   ├── filter.js           # Filter and sort logic using HOFs
│   ├── log.js              # Meal log — add, remove, calculate totals
│   ├── storage.js          # LocalStorage read/write helpers
│   ├── targets.js          # Daily targets logic and progress bars
│   ├── debounce.js         # Debounce utility function
│   └── app.js              # Entry point — event listeners, init
│
└── assets/
    ├── logo.svg            # App logo
    ├── favicon.ico         # Browser favicon
    ├── favicon.png         # High-res favicon
    └── placeholder.svg     # Fallback image for foods with no photo
```

---

## Setup & Running Locally

### Prerequisites
- A modern browser (Chrome, Firefox, Edge, Safari)
- A code editor (VS Code recommended)
- Git installed
- A local server (VS Code Live Server extension, or any HTTP server)

### Steps

1. **Clone the repository**
```bash
git clone https://github.com/nsaky/nutrifact-macro-tracker.git
cd nutrifact
```

2. **Open in VS Code**
```bash
code .
```

3. **Run with Live Server**
- Install the "Live Server" extension in VS Code
- Right-click `index.html` → "Open with Live Server"
- App opens at `http://127.0.0.1:5500`

   Alternatively, use Python's built-in server:
```bash
# Python 3
python -m http.server 5500
# then open http://localhost:5500
```

4. **API key included**
   The USDA FoodData Central API key is already configured in `js/api.js`. The app works immediately after cloning.

### Important Notes
- The app must be served over HTTP (not opened as `file://`) for the Fetch API to work correctly.
- LocalStorage works on `localhost` and deployed URLs. It does not persist across different origins.

---

## Best Practices Followed

- **Clean code** — consistent 2-space indentation, `camelCase` for variables, `SCREAMING_SNAKE_CASE` for constants
- **DRY principle** — shared logic (fetch, normalise, storage) extracted into reusable modules
- **Separation of concerns** — API logic, rendering, filtering, and storage in separate files
- **Error handling** — all `fetch` calls wrapped in `try/catch`, with user-facing error messages
- **No traditional loops** — all array operations use HOFs (`map`, `filter`, `sort`, `reduce`, `find`, `forEach`)
- **Responsive-first** — CSS written mobile-first, progressively enhanced for larger screens
- **Semantic HTML** — `<main>`, `<section>`, `<article>`, `<nav>`, `<header>`, `<footer>` used correctly
- **Accessibility** — `aria-label` on icon buttons, sufficient colour contrast, keyboard-navigable modals
- **Progressive enhancement** — core search and display works without JS-dependent features.

---

*Built for the WAP Individual Project — demonstrating JavaScript, API integration, array HOFs, and responsive UI development.*