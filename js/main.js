// main.js - Main entry point and initialization

import { processWeatherData, renderWeatherCard } from './weather.js';

/**
 * Loads weather data from local JSON files and renders cards
 */
async function loadWeatherData() {
    try {
        // Fetch both JSON files in parallel
        const [casteloRes, ankaraRes] = await Promise.all([
            fetch('./weather_castelo_branco.json'),
            fetch('./weather_ankara.json')
        ]);

        const casteloData = await casteloRes.json();
        const ankaraData = await ankaraRes.json();

        // Process the raw data
        const leftWeather = processWeatherData(casteloData);
        const rightWeather = processWeatherData(ankaraData);

        // Render weather cards
        renderWeatherCard(leftWeather, 'left-weather-card', 'Hissedilen:');
        renderWeatherCard(rightWeather, 'right-weather-card', 'Sensação Térmica:');

        // Display hardcoded distance
        const DISTANCE = 3423;
        const distanceElement = document.querySelector('.distance-display');
        if (distanceElement) {
            distanceElement.textContent = `${DISTANCE}kms`;
        }

        console.log('Weather data loaded successfully!');
    } catch (error) {
        console.error('Failed to load weather data:', error);
    }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('Weather App initialized');
    loadWeatherData();
});
