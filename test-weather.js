const weatherService = require('./services/weatherService');

async function testWeather() {
    try {
        console.log('Testing weather API...');
        await weatherService.fetchWeatherForAllLocations();
        console.log('Weather API test successful!');
        process.exit(0);
    } catch (err) {
        console.error('Weather API test failed: ', err);
        process.exit(1);
    }
}

testWeather();