// utils.js - Utility functions

/**
 * Formats temperature with degree symbol
 * @param {number} temp - Temperature value
 * @returns {string} Formatted temperature
 */
export function formatTemperature(temp) {
    return `${Math.round(temp)}°`;
}

/**
 * Formats time from Unix timestamp to local time string
 * @param {number} timestamp - Unix timestamp
 * @param {number} timezoneOffset - Timezone offset in seconds
 * @returns {string} Formatted time (e.g., "09:41 AM")
 */
export function formatLocalTime(timestamp, timezoneOffset) {
    const date = new Date((timestamp + timezoneOffset) * 1000);
    const utcHours = date.getUTCHours();
    const utcMinutes = date.getUTCMinutes();
    
    const period = utcHours >= 12 ? 'PM' : 'AM';
    const hours12 = utcHours % 12 || 12;
    const minutesStr = utcMinutes.toString().padStart(2, '0');
    
    return `${hours12}:${minutesStr} ${period}`;
}

/**
 * Gets the current local time for a timezone offset
 * @param {number} timezoneOffset - Timezone offset in seconds
 * @returns {string} Formatted current time
 */
export function getCurrentLocalTime(timezoneOffset) {
    const now = Math.floor(Date.now() / 1000);
    return formatLocalTime(now, timezoneOffset);
}

/**
 * Calculates distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    return Math.round(R * c);
}

/**
 * Converts degrees to radians
 * @param {number} degrees 
 * @returns {number} Radians
 */
function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

/**
 * Formats distance with 'kms' suffix
 * @param {number} distance - Distance in kilometers
 * @returns {string} Formatted distance
 */
export function formatDistance(distance) {
    return `${distance}kms`;
}

/**
 * Capitalizes first letter of each word
 * @param {string} str 
 * @returns {string}
 */
export function capitalize(str) {
    return str.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}
