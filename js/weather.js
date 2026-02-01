// weather.js - Weather data processing and UI rendering

import { formatTemperature, getCurrentLocalTime, capitalize } from './utils.js';

/**
 * Weather icon mappings based on OpenWeatherMap condition codes
 */
const weatherIcons = {
    // Thunderstorm
    '2xx': 'cloud-lightning',
    // Drizzle
    '3xx': 'cloud-drizzle',
    // Rain
    '5xx': 'cloud-rain',
    // Snow
    '6xx': 'cloud-snow',
    // Atmosphere (mist, fog, etc.)
    '7xx': 'cloud-fog',
    // Clear
    '800': 'sun',
    // Clouds
    '801': 'cloud-sun',
    '8xx': 'cloud',
};

/**
 * Gets the appropriate weather icon SVG based on weather condition code
 * @param {number} conditionCode - OpenWeatherMap condition code
 * @returns {string} SVG icon markup
 */
export function getWeatherIcon(conditionCode) {
    const code = conditionCode.toString();
    let iconType = 'cloud';
    
    if (code.startsWith('2')) {
        iconType = 'cloud-lightning';
    } else if (code.startsWith('3')) {
        iconType = 'cloud-drizzle';
    } else if (code.startsWith('5')) {
        iconType = 'cloud-rain';
    } else if (code.startsWith('6')) {
        iconType = 'cloud-snow';
    } else if (code.startsWith('7')) {
        iconType = 'cloud-fog';
    } else if (code === '800') {
        iconType = 'sun';
    } else if (code === '801') {
        iconType = 'cloud-sun';
    } else {
        iconType = 'cloud';
    }
    
    return getIconSVG(iconType);
}

/**
 * Returns SVG markup for weather icons
 * @param {string} type - Icon type
 * @returns {string} SVG markup
 */
function getIconSVG(type) {
    const icons = {
        'sun': `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`,
        'cloud': `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>`,
        'cloud-sun': `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="M20 12h2"/><path d="m19.07 4.93-1.41 1.41"/><path d="M15.947 12.65a4 4 0 0 0-5.925-4.128"/><path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z"/></svg>`,
        'cloud-rain': `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M16 14v6"/><path d="M8 14v6"/><path d="M12 16v6"/></svg>`,
        'cloud-drizzle': `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M8 19v1"/><path d="M8 14v1"/><path d="M16 19v1"/><path d="M16 14v1"/><path d="M12 21v1"/><path d="M12 16v1"/></svg>`,
        'cloud-snow': `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M8 15h.01"/><path d="M8 19h.01"/><path d="M12 17h.01"/><path d="M12 21h.01"/><path d="M16 15h.01"/><path d="M16 19h.01"/></svg>`,
        'cloud-lightning': `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973"/><path d="m13 12-3 5h4l-3 5"/></svg>`,
        'cloud-fog': `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M16 17H7"/><path d="M17 21H9"/></svg>`,
    };
    
    return icons[type] || icons['cloud'];
}

/**
 * Processes raw API data into a clean weather object
 * @param {Object} data - Raw API response
 * @returns {Object} Processed weather data
 */
export function processWeatherData(data) {
    return {
        city: data.name,
        country: data.sys.country,
        temperature: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        description: capitalize(data.weather[0].description),
        conditionCode: data.weather[0].id,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        coordinates: {
            lat: data.coord.lat,
            lon: data.coord.lon
        },
        timezone: data.timezone,
        localTime: getCurrentLocalTime(data.timezone)
    };
}

/**
 * Renders weather data to a weather card element
 * @param {Object} weatherData - Processed weather data
 * @param {string} cardId - ID of the weather card element
 */
export function renderWeatherCard(weatherData, cardId) {
    const card = document.getElementById(cardId);
    if (!card) {
        console.error(`Weather card element not found: ${cardId}`);
        return;
    }
    
    card.innerHTML = `
        <div class="weather-header">
            <h4 class="city-name">${weatherData.city}</h4>
            <p class="local-time">${weatherData.localTime}</p>
        </div>

        <div class="weather-hero">
            <div class="weather-hero-1">
                <div class="weather-hero-2">
                    ${getWeatherIcon(weatherData.conditionCode)}
                    <span class="temperature">${formatTemperature(weatherData.temperature)}</span>
                </div>
                <div class="weather-hero-3">
                    <p class="description">${weatherData.description}</p>
                </div>
            </div>
        </div>
        <div class="feels-like-container">
            <p class="feels-like">Feels like ${formatTemperature(weatherData.feelsLike)}</p>
        </div>
    `;
}

/**
 * Updates the distance display between two cities
 * @param {number} distance - Distance in kilometers
 */
export function updateDistanceDisplay(distance) {
    const distanceElement = document.querySelector('.distance-display');
    if (distanceElement) {
        distanceElement.textContent = `${distance}kms`;
    }
}
