
const API_KEY = "EJBN3beZtZEUC6Tes0XoPFo1bjrETd7jUdiEO8Pw";
const BASE_URL = "https://api.nal.usda.gov/fdc/v1";

export async function searchFoods(query) {
  if (!query || query.trim() === '') {
    return [];
  }

  try {
    const response = await fetch(`${BASE_URL}/foods/search?query=${encodeURIComponent(query)}&pageSize=24&api_key=${API_KEY}`, {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.status === 503) {
      console.warn("USDA FoodData Central API is temporarily unavailable (503). Please try again in a moment.");
      return null;
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("USDA API Response Data:", data);
    return data;
  } catch (error) {
    if (error.name === 'TypeError') {
      console.warn("Network or CORS error: The API might be down or overloaded.");
    } else {
      console.error("Error fetching data from USDA FoodData Central API:", error);
    }
    return null; 
  }
}
