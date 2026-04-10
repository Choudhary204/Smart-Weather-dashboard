🌦️ Smart City Weather Dashboard

Description

Smart City Weather Dashboard is a modern web application that provides real-time weather updates along with **Air Quality (AQI insights)** and smart lifestyle suggestions like *“What to Wear”*.

The app uses the **Open-Meteo API** for weather data and its **Air Quality API** to fetch pollution data, making it a complete environmental dashboard.

---

Features

🌍 Core Features

Search by City** – Get weather data for any location
5-Day Forecast** – Plan ahead with weather predictions
Real-Time Weather

  * Temperature
  * Wind speed
  * Weather conditions

---

Air Quality (AQI) Features

* Displays pollution data:

  * PM2.5
  * PM10
  * Carbon Monoxide (CO)
* Health suggestions:

  *  Wear mask if pollution is high
  *  Avoid outdoor activities in poor air

---

## Smart Suggestions

* Carry umbrella if rain probability > 20%
* Wear jacket if temperature is low
*  Stay hydrated in hot weather

---

## Advanced Features

* Geolocation Support** (auto-detect user location)
* Dynamic UI**

  * Blue → Cold
  * Orange → Hot
* Dynamic Weather Icons**

---

## Tech Stack

* Frontend:** HTML, CSS, JavaScript / 
* APIs Used:

  * Weather API (Open-Meteo)
  * Air Quality API (Open-Meteo)
* Concepts:

  * Fetch API
  * Async/Await
  * API Integration
  * DOM Manipulation / React Hooks

---

##  APIs Used

## Weather API

```bash id="x1a9p2"
https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true&hourly=temperature_2m,precipitation&daily=temperature_2m_max,temperature_2m_min
```

## Air Quality API

```bash id="n8k3f1"
https://air-quality-api.open-meteo.com/v1/air-quality?latitude={lat}&longitude={lon}&hourly=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,ozone
```

---

# Data Fetched from API

# Weather Data

* Temperature
* Wind speed & direction
* Rain probability
* Daily min/max temperature
* Weather codes (for icons & UI)

## Air Quality Data

* PM2.5
* PM10
* CO (Carbon Monoxide)
* NO₂ (Nitrogen Dioxide)
* O₃ (Ozone)

---

## How It Works

1. User enters city or enables location
2. App converts city → latitude & longitude
3. Fetches:

   * Weather data from Open-Meteo
   * Air quality data from Air Quality API
4. Displays:

   * Weather conditions
   * AQI insights
   * Smart suggestions

---

## 💻 API Integration Example

### Weather Fetch

```js id="w3k9d0"
fetch(`https://api.open-meteo.com/v1/forecast?latitude=19.07&longitude=72.87&current_weather=true`)
  .then(res => res.json())
  .then(data => console.log(data.current_weather));
```

### AQI Fetch

```js id="p4d8k2"
fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=19.07&longitude=72.87&hourly=pm2_5,pm10`)
  .then(res => res.json())
  .then(data => console.log(data.hourly));
```

---

## 📂 Project Structure

```id="s8x2n1"
/weather-dashboard
│── index.html
│── style.css
│── script.js
│── assets/
```

---

# UI Ideas

* Dark theme 🌙
* Glassmorphism cards
* Gradient backgrounds based on weather
* AQI color indicators:

  * Green → Good
  * Yellow → Moderate
  * Red → Poor

---

## Future Improvements

* 📊 Weather + AQI charts
* 🌎 Multiple city comparison
* 🔔 Weather alerts
* 🌙 Dark mode toggle

---

## 🧠 Key Learning Outcomes

* Working with multiple APIs
* Handling asynchronous data
* Converting raw data into meaningful insights
* Building user-friendly UI

---

#👨‍💻 Author

Sonu Choudhary

---

#⭐ Acknowledgements

* Open-Meteo API
* Public APIs GitHub Repository

---

## 📜 License

This project is open-source and available under the MIT License.
