export function processFoods(foodsArray, filterCriteria, sortType) {
  // Helper to safely extract a numeric macro value from the nutrients array
  const getNutrientValue = (nutrients, searchName) => {
    if (!nutrients) return 0;
    const match = nutrients.find(n => n.nutrientName && n.nutrientName.toLowerCase().includes(searchName.toLowerCase()));
    return match ? (parseFloat(match.value) || 0) : 0;
  };

  // 1. FILTERING
  const filteredFoods = foodsArray.filter(food => {
    const protein = getNutrientValue(food.foodNutrients, 'protein');
    const calories = getNutrientValue(food.foodNutrients, 'energy');
    const fat = getNutrientValue(food.foodNutrients, 'total lipid');

    return (
      protein >= filterCriteria.minProtein &&
      calories <= filterCriteria.maxCalories &&
      fat <= filterCriteria.maxFat
    );
  });

  // 2. SORTING
  // .sort() modifies exactly the array it's called on, but since .filter() already returns a fresh copy, we are safe.
  const sortedFoods = filteredFoods.sort((a, b) => {
    const getNutri = (food, name) => getNutrientValue(food.foodNutrients, name);
    
    switch (sortType) {
      case 'high-protein':
        return getNutri(b, 'protein') - getNutri(a, 'protein');
      case 'low-calorie':
        return getNutri(a, 'energy') - getNutri(b, 'energy');
      case 'low-fat':
        return getNutri(a, 'total lipid') - getNutri(b, 'total lipid');
      case 'alphabetical':
        const nameA = (a.description || '').toLowerCase();
        const nameB = (b.description || '').toLowerCase();
        return nameA.localeCompare(nameB);
      case 'default':
      default:
        return 0; // retain default API ordering
    }
  });

  return sortedFoods;
}
