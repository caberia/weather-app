// api.js - OpenWeatherMap API module

const API_KEY = 'YOUR_API_KEY_HERE'; // Replace with your OpenWeatherMap API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

/**
 * Fetches current weather data for a city
 * @param {string} city - City name
 * @returns {Promise<Object>} Weather data
 */
export async function fetchWeatherByCity(city) {
    try {
        const response = await fetch(
            `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
        );
        
        if (!response.ok) {
            throw new Error(`Weather API error: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching weather:', error);
        throw error;
    }
}

/**
 * Fetches current weather data by coordinates
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<Object>} Weather data
 */
export async function fetchWeatherByCoords(lat, lon) {
    try {
        const response = await fetch(
            `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        
        if (!response.ok) {
            throw new Error(`Weather API error: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching weather:', error);
        throw error;
    }
}

/**
 * Fetches weather for multiple cities
 * @param {string[]} cities - Array of city names
 * @returns {Promise<Object[]>} Array of weather data
 */
export async function fetchWeatherForCities(cities) {
    const promises = cities.map(city => fetchWeatherByCity(city));
    return Promise.all(promises);
}
