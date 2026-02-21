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
 * Capitalizes first letter of each word
 * @param {string} str 
 * @returns {string}
 */
export function capitalize(str) {
    return str.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}
