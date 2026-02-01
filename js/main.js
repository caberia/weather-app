// main.js - Main entry point and initialization

import { fetchWeatherByCity } from './api.js';
import { processWeatherData, renderWeatherCard, updateDistanceDisplay } from './weather.js';
import { calculateDistance } from './utils.js';

// Configuration
const CONFIG = {
    cities: {
        left: 'Castelo Branco',  // Left pane city
        right: 'Lisbon'          // Right pane city - change to your desired city
    },
    refreshInterval: 15 * 60 * 1000  // 15 minutes in milliseconds
};

// Store weather data for both cities
let weatherData = {
    left: null,
    right: null
};

/**
 * Fetches and updates weather for both cities
 */
async function updateAllWeather() {
    console.log('Updating weather data...', new Date().toLocaleTimeString());
    
    try {
        // Fetch weather for both cities in parallel
        const [leftData, rightData] = await Promise.all([
            fetchWeatherByCity(CONFIG.cities.left),
            fetchWeatherByCity(CONFIG.cities.right)
        ]);
        
        // Process the weather data
        weatherData.left = processWeatherData(leftData);
        weatherData.right = processWeatherData(rightData);
        
        // Render weather cards
        renderWeatherCard(weatherData.left, 'left-weather-card');
        renderWeatherCard(weatherData.right, 'right-weather-card');
        
        // Calculate and update distance between cities
        const distance = calculateDistance(
            weatherData.left.coordinates.lat,
            weatherData.left.coordinates.lon,
            weatherData.right.coordinates.lat,
            weatherData.right.coordinates.lon
        );
        updateDistanceDisplay(distance);
        
        console.log('Weather updated successfully!');
        
    } catch (error) {
        console.error('Failed to update weather:', error);
        showError('Failed to load weather data. Please check your API key.');
    }
}

/**
 * Displays an error message to the user
 * @param {string} message - Error message
 */
function showError(message) {
    const leftCard = document.getElementById('left-weather-card');
    const rightCard = document.getElementById('right-weather-card');
    
    const errorHTML = `
        <div class="weather-error">
            <p>${message}</p>
        </div>
    `;
    
    if (leftCard) leftCard.innerHTML = errorHTML;
    if (rightCard) rightCard.innerHTML = errorHTML;
}

/**
 * Starts the auto-refresh timer
 */
function startAutoRefresh() {
    // Update immediately on load
    updateAllWeather();
    
    // Set up interval for automatic updates every 15 minutes
    setInterval(() => {
        updateAllWeather();
    }, CONFIG.refreshInterval);
    
    console.log(`Auto-refresh enabled: Weather will update every ${CONFIG.refreshInterval / 60000} minutes`);
}

/**
 * Updates local time display for both cities
 */
function updateLocalTimes() {
    // Update times every minute
    setInterval(() => {
        if (weatherData.left && weatherData.right) {
            // Re-render cards to update times
            renderWeatherCard(weatherData.left, 'left-weather-card');
            renderWeatherCard(weatherData.right, 'right-weather-card');
        }
    }, 60000); // Update every minute
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('Weather App initialized');
    startAutoRefresh();
    updateLocalTimes();
});
