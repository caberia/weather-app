import fs from 'fs/promises';
import path from 'path';

// Convert dt into HH:MM format
function formatUpdateTime(unixTimestamp) {
    const date = new Date(unixTimestamp * 1000);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

export async function callCasteloBranco() {
    try {
        // Find the file path relative to where you are running the script
        const filePath = path.resolve('weather_castelo_branco.json');
        
        // Read the file from your hard drive
        const data = await fs.readFile(filePath, 'utf8');
        
        // Parse the string into a JSON object
        const rawData = JSON.parse(data);
        return rawData;
    } catch (err) {
        console.error("Could not read the file. Make sure it exists in the root folder!", err);
    }
}

// To see the result in your console, we need to await the promise
const data = await callCasteloBranco();
console.log(data);
console.log(`Last updated: ${formatUpdateTime(data.dt)}`);