const cityInput = document.getElementById('city-input');
const searchForm = document.getElementById('search-form');
const searchBtn = document.getElementById('search-btn');
const loadingState = document.getElementById('loading-state');
const errorState = document.getElementById('error-state');
const weatherContent = document.getElementById('weather-content');
const errorTitle = document.getElementById('error-title');
const errorMessage = document.getElementById('error-message');
const errorDismiss = document.getElementById('error-dismiss');
const appBackground = document.getElementById('app-background');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const favoritesSection = document.getElementById('favorites-section');
const favoritesList = document.getElementById('favorites-list');
const favBtn = document.getElementById('fav-btn');
const favIcon = document.getElementById('fav-icon');
const tempFilter = document.getElementById('temp-filter');
const conditionFilter = document.getElementById('condition-filter');
const sortSelect = document.getElementById('sort-select');

let currentDailyForecast = null;
let currentCityLocation = null;
let favorites = JSON.parse(localStorage.getItem('weather_favorites')) || [];
let isLightTheme = localStorage.getItem('weather_theme') === 'light';
const weatherDescriptions = {
    0: { text: 'Clear Sky', emoji: '☀️' },
    1: { text: 'Mainly Clear', emoji: '🌤️' },
    2: { text: 'Partly Cloudy', emoji: '⛅' },
    3: { text: 'Overcast', emoji: '☁️' },
    45: { text: 'Foggy', emoji: '🌫️' },
    48: { text: 'Rime Fog', emoji: '🌫️' },
    51: { text: 'Light Drizzle', emoji: '🌦️' },
    53: { text: 'Moderate Drizzle', emoji: '🌦️' },
    55: { text: 'Dense Drizzle', emoji: '🌧️' },
    56: { text: 'Freezing Drizzle', emoji: '🌧️' },
    57: { text: 'Heavy Freezing Drizzle', emoji: '🌧️' },
    61: { text: 'Light Rain', emoji: '🌧️' },
    63: { text: 'Moderate Rain', emoji: '🌧️' },
    65: { text: 'Heavy Rain', emoji: '⛈️' },
    66: { text: 'Freezing Rain', emoji: '🌨️' },
    67: { text: 'Heavy Freezing Rain', emoji: '🌨️' },
    71: { text: 'Light Snowfall', emoji: '🌨️' },
    73: { text: 'Moderate Snowfall', emoji: '❄️' },
    75: { text: 'Heavy Snowfall', emoji: '❄️' },
    77: { text: 'Snow Grains', emoji: '🌨️' },
    80: { text: 'Light Showers', emoji: '🌦️' },
    81: { text: 'Moderate Showers', emoji: '🌧️' },
    82: { text: 'Violent Showers', emoji: '⛈️' },
    85: { text: 'Light Snow Showers', emoji: '🌨️' },
    86: { text: 'Heavy Snow Showers', emoji: '❄️' },
    95: { text: 'Thunderstorm', emoji: '⛈️' },
    96: { text: 'Thunderstorm with Hail', emoji: '⛈️' },
    99: { text: 'Severe Thunderstorm', emoji: '⛈️' }
};

function getWeatherInfo(code) {
    return weatherDescriptions[code] || { text: 'Unknown', emoji: '🌡️' };
}

function showLoading() {
    loadingState.classList.remove('hidden');
    errorState.classList.add('hidden');
    weatherContent.classList.add('hidden');
}

function showError(title, message) {
    loadingState.classList.add('hidden');
    errorState.classList.remove('hidden');
    weatherContent.classList.add('hidden');
    errorTitle.textContent = title;
    errorMessage.textContent = message;
}

function showWeather() {
    loadingState.classList.add('hidden');
    errorState.classList.remove('hidden');
    weatherContent.classList.remove('hidden');
    errorState.classList.add('hidden');
}

function applyTheme(temperature, weatherCode) {
    appBackground.className = 'app-background';
    if ([51,53,55,56,57,61,63,65,66,67,71,73,75,77,80,81,82,85,86,95,96,99].includes(weatherCode)) {
        appBackground.classList.add('theme-rain');
    } else if (temperature <= 10) {
        appBackground.classList.add('theme-cold');
    } else if (temperature >= 30) {
        appBackground.classList.add('theme-hot');
    } else {
        appBackground.classList.add('theme-mild');
    }
}

function updateThemeUI() {
    if (isLightTheme) {
        document.body.classList.add('light-theme');
        themeIcon.textContent = '🌙';
    } else {
        document.body.classList.remove('light-theme');
        themeIcon.textContent = '☀️';
    }
}
updateThemeUI();

themeToggle.addEventListener('click', () => {
    isLightTheme = !isLightTheme;
    localStorage.setItem('weather_theme', isLightTheme ? 'light' : 'dark');
    updateThemeUI();
});

function getDayName(dateString) {
    let date = new Date(dateString + 'T00:00:00');
    let today = new Date();
    today.setHours(0, 0, 0, 0);

    let tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.getTime() === today.getTime()) return 'Today';
    if (date.getTime() === tomorrow.getTime()) return 'Tomorrow';

    return date.toLocaleDateString('en-US', { weekday: 'short' });
}

function getPM25Level(val) {
    if (val <= 12) return { label: 'Good', cls: 'good' };
    if (val <= 35) return { label: 'Moderate', cls: 'moderate' };
    if (val <= 55) return { label: 'Unhealthy', cls: 'unhealthy' };
    return { label: 'Hazardous', cls: 'hazardous' };
}

function getPM10Level(val) {
    if (val <= 54) return { label: 'Good', cls: 'good' };
    if (val <= 154) return { label: 'Moderate', cls: 'moderate' };
    if (val <= 254) return { label: 'Unhealthy', cls: 'unhealthy' };
    return { label: 'Hazardous', cls: 'hazardous' };
}

function getCOLevel(val) {
    if (val <= 4400) return { label: 'Good', cls: 'good' };
    if (val <= 9400) return { label: 'Moderate', cls: 'moderate' };
    if (val <= 12400) return { label: 'Unhealthy', cls: 'unhealthy' };
    return { label: 'Hazardous', cls: 'hazardous' };
}

function setRingProgress(ringClass, value, maxValue) {
    let ring = document.querySelector('.' + ringClass);
    if (!ring) return;

    let circumference = 2 * Math.PI * 52;
    let ratio = Math.min(value / maxValue, 1);
    let offset = circumference - (ratio * circumference);

    ring.style.strokeDasharray = circumference;
    ring.style.strokeDashoffset = circumference;

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            ring.style.strokeDashoffset = offset;
        });
    });

    let level;
    if (ringClass === 'pm25-ring') level = getPM25Level(value);
    else if (ringClass === 'pm10-ring') level = getPM10Level(value);
    else level = getCOLevel(value);

    if (level.cls === 'good') ring.style.stroke = '#34d399';
    else if (level.cls === 'moderate') ring.style.stroke = '#fbbf24';
    else if (level.cls === 'unhealthy') ring.style.stroke = '#fb923c';
    else ring.style.stroke = '#ef4444';
}

async function getCoordinates(cityName) {
    let url = `${ENV.GEOCODING_URL}?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`;
    let response = await fetch(url);

    if (!response.ok) {
        throw new Error('Failed to connect to geocoding service');
    }

    let data = await response.json();

    if (!data.results || data.results.length === 0) {
        throw new Error(`City "${cityName}" not found. Please check the spelling and try again.`);
    }

    let place = data.results[0];
    return {
        lat: place.latitude,
        lon: place.longitude,
        name: place.name,
        country: place.country || '',
        admin: place.admin1 || ''
    };
}

async function getWeatherData(lat, lon) {
    let params = [
        `latitude=${lat}`,
        `longitude=${lon}`,
        'current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m',
        'daily=weather_code,temperature_2m_max,temperature_2m_min',
        'timezone=auto',
        'forecast_days=6'
    ].join('&');

    let response = await fetch(`${ENV.WEATHER_URL}?${params}`);

    if (!response.ok) {
        throw new Error('Weather data unavailable. Please try again later.');
    }

    return await response.json();
}

async function getAirQuality(lat, lon) {
    let params = [
        `latitude=${lat}`,
        `longitude=${lon}`,
        'current=pm2_5,pm10,carbon_monoxide'
    ].join('&');

    let response = await fetch(`${ENV.AIR_QUALITY_URL}?${params}`);

    if (!response.ok) {
        throw new Error('Air quality data unavailable.');
    }

    return await response.json();
}

function renderCurrentWeather(weather, location) {
    let current = weather.current;
    let temp = Math.round(current.temperature_2m);
    let weatherInfo = getWeatherInfo(current.weather_code);

    let displayName = location.name;
    if (location.admin) displayName += `, ${location.admin}`;
    if (location.country) displayName += `, ${location.country}`;

    currentCityLocation = displayName;
    document.getElementById('city-name').textContent = displayName;
    document.getElementById('city-coords').textContent = `${location.lat.toFixed(2)}°N, ${location.lon.toFixed(2)}°E`;
    document.getElementById('current-temp').textContent = temp;
    document.getElementById('weather-condition').textContent = weatherInfo.text;
    document.getElementById('weather-emoji').textContent = weatherInfo.emoji;
    document.getElementById('wind-speed').textContent = `${current.wind_speed_10m} km/h`;
    document.getElementById('humidity-val').textContent = `${current.relative_humidity_2m}%`;

    applyTheme(temp, current.weather_code);
    updateFavoriteButton();
    favBtn.classList.remove('hidden');
}

function updateForecastUI() {
    if (!currentDailyForecast) return;
    let container = document.getElementById('forecast-grid');

    let daysArray = currentDailyForecast.time.map((time, index) => {
        return {
            dateStr: time,
            dayName: getDayName(time),
            maxTemp: Math.round(currentDailyForecast.temperature_2m_max[index]),
            minTemp: Math.round(currentDailyForecast.temperature_2m_min[index]),
            weatherCode: currentDailyForecast.weather_code[index],
            index: index
        };
    }).slice(1, 6);

    let tempFilterVal = tempFilter.value;
    let condFilterVal = conditionFilter.value;

    let filteredDays = daysArray.filter(day => {
        let keepTemp = true;
        if (tempFilterVal === 'hot') keepTemp = day.maxTemp > 20;
        else if (tempFilterVal === 'cold') keepTemp = day.maxTemp < 10;
        else if (tempFilterVal === 'mild') keepTemp = day.maxTemp >= 10 && day.maxTemp <= 20;

        let keepCond = true;
        let info = getWeatherInfo(day.weatherCode).text.toLowerCase();
        if (condFilterVal === 'clear') keepCond = info.includes('clear') || info.includes('sun');
        else if (condFilterVal === 'clouds') keepCond = info.includes('cloud') || info.includes('overcast');
        else if (condFilterVal === 'rain') keepCond = info.includes('rain') || info.includes('drizzle') || info.includes('shower');
        else if (condFilterVal === 'snow') keepCond = info.includes('snow');

        return keepTemp && keepCond;
    });

    let sortVal = sortSelect.value;
    filteredDays.sort((a, b) => {
        if (sortVal === 'date-asc') return a.index - b.index;
        if (sortVal === 'date-desc') return b.index - a.index;
        if (sortVal === 'temp-desc') return b.maxTemp - a.maxTemp;
        if (sortVal === 'temp-asc') return a.maxTemp - b.maxTemp;
        return 0;
    });

    container.innerHTML = filteredDays.map(day => {
        let weatherInfo = getWeatherInfo(day.weatherCode);
        return `
            <div class="forecast-card">
                <p class="forecast-day">${day.dayName}</p>
                <span class="forecast-emoji">${weatherInfo.emoji}</span>
                <div class="forecast-temps">
                    <span class="forecast-max">${day.maxTemp}°</span>
                    <span class="forecast-min">${day.minTemp}°</span>
                </div>
            </div>
        `;
    }).join('');

    if (filteredDays.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary);">No forecast matches your filters.</p>';
    }
}

function renderForecast(weather) {
    currentDailyForecast = weather.daily;
    updateForecastUI();
}

[tempFilter, conditionFilter, sortSelect].forEach(select => {
    select.addEventListener('change', updateForecastUI);
});

function renderFavorites() {
    if (favorites.length === 0) {
        favoritesSection.classList.add('hidden');
        return;
    }
    favoritesSection.classList.remove('hidden');
    favoritesList.innerHTML = favorites.map(city => `
        <div class="favorite-pill" data-city="${city}">
            <span class="fav-city-name">${city}</span>
            <span class="fav-remove" data-city="${city}">✕</span>
        </div>
    `).join('');
}

function updateFavoriteButton() {
    if (!currentCityLocation) return;
    if (favorites.includes(currentCityLocation)) {
        favIcon.textContent = '❤️';
    } else {
        favIcon.textContent = '🤍';
    }
}

favBtn.addEventListener('click', () => {
    if (!currentCityLocation) return;
    if (favorites.includes(currentCityLocation)) {
        favorites = favorites.filter(c => c !== currentCityLocation);
    } else {
        favorites.push(currentCityLocation);
    }
    localStorage.setItem('weather_favorites', JSON.stringify(favorites));
    updateFavoriteButton();
    renderFavorites();
});

favoritesList.addEventListener('click', (e) => {
    if (e.target.classList.contains('fav-remove')) {
        let city = e.target.getAttribute('data-city');
        favorites = favorites.filter(c => c !== city);
        localStorage.setItem('weather_favorites', JSON.stringify(favorites));
        updateFavoriteButton();
        renderFavorites();
    } else if (e.target.closest('.favorite-pill')) {
        let city = e.target.closest('.favorite-pill').getAttribute('data-city');
        cityInput.value = city;
        searchCity(city);
    }
});

renderFavorites();

function renderAirQuality(aqData) {
    let current = aqData.current;

    let pm25 = current.pm2_5 != null ? Math.round(current.pm2_5 * 10) / 10 : 0;
    let pm10 = current.pm10 != null ? Math.round(current.pm10 * 10) / 10 : 0;
    let co = current.carbon_monoxide != null ? Math.round(current.carbon_monoxide) : 0;

    document.getElementById('pm25-value').textContent = pm25;
    document.getElementById('pm10-value').textContent = pm10;
    document.getElementById('co-value').textContent = co;

    let pm25Level = getPM25Level(pm25);
    let pm10Level = getPM10Level(pm10);
    let coLevel = getCOLevel(co);

    let pm25Badge = document.getElementById('pm25-badge');
    pm25Badge.textContent = pm25Level.label;
    pm25Badge.className = `aqi-badge ${pm25Level.cls}`;

    let pm10Badge = document.getElementById('pm10-badge');
    pm10Badge.textContent = pm10Level.label;
    pm10Badge.className = `aqi-badge ${pm10Level.cls}`;

    let coBadge = document.getElementById('co-badge');
    coBadge.textContent = coLevel.label;
    coBadge.className = `aqi-badge ${coLevel.cls}`;

    setRingProgress('pm25-ring', pm25, 75);
    setRingProgress('pm10-ring', pm10, 300);
    setRingProgress('co-ring', co, 15000);
}

async function searchCity(cityName) {
    if (!cityName.trim()) {
        showError('Empty Search', 'Please enter a city name to search.');
        return;
    }

    showLoading();

    try {
        let location = await getCoordinates(cityName);

        let [weather, airQuality] = await Promise.all([
            getWeatherData(location.lat, location.lon),
            getAirQuality(location.lat, location.lon)
        ]);

        renderCurrentWeather(weather, location);
        renderForecast(weather);
        renderAirQuality(airQuality);
        showWeather();

    } catch (err) {
        let title = 'Something Went Wrong';
        let msg = err.message;

        if (err.message.includes('not found')) {
            title = 'City Not Found';
        } else if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
            title = 'Network Error';
            msg = 'Please check your internet connection and try again.';
        }

        showError(title, msg);
    }
}

let debounceTimer;
cityInput.addEventListener('input', function() {
    clearTimeout(debounceTimer);
    let val = cityInput.value.trim();
    if (val.length < 3) return;
    debounceTimer = setTimeout(() => {
        searchCity(val);
    }, 600);
});

searchForm.addEventListener('submit', function (e) {
    e.preventDefault();
    clearTimeout(debounceTimer);
    searchCity(cityInput.value);
});

errorDismiss.addEventListener('click', function () {
    errorState.classList.add('hidden');
    cityInput.focus();
});

function loadInitialData() {
    if ("geolocation" in navigator) {
        // Show loading state while waiting for user permission and data
        showLoading();
        
        navigator.geolocation.getCurrentPosition(async (position) => {
            try {
                let lat = position.coords.latitude;
                let lon = position.coords.longitude;
                
                // Use a free open API for reverse geocoding to get the city name from coordinates
                let reverseGeoUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
                let geoRes = await fetch(reverseGeoUrl);
                let geoData = await geoRes.json();
                
                let location = {
                    lat: lat,
                    lon: lon,
                    name: geoData.city || geoData.locality || 'Your Location',
                    country: geoData.countryName || '',
                    admin: geoData.principalSubdivision || ''
                };

                let [weather, airQuality] = await Promise.all([
                    getWeatherData(lat, lon),
                    getAirQuality(lat, lon)
                ]);

                renderCurrentWeather(weather, location);
                renderForecast(weather);
                renderAirQuality(airQuality);
                showWeather();

            } catch (error) {
                console.error("Error during geolocation fetch:", error);
                searchCity('New Delhi');
            }
        }, (error) => {
            console.warn("Geolocation denied or unavailable.", error);
            searchCity('New Delhi');
        }, { timeout: 10000 });
    } else {
        searchCity('New Delhi');
    }
}

// Initialize the app
loadInitialData();
