const API_KEY = "759VFHQK5Y5LELB23N8MSP9T3";
const form = document.getElementById("weather-form");
const cityInput = document.getElementById("city-input");
const resultBox = document.getElementById("result");

form.addEventListener("submit", async(e) => {
    e.preventDefault();
    showLoading();
    const city = cityInput.value.trim();
    try {
        const data = await getWeather(city);
        if (data) {
            displayWeather(data);
        } else {
            showMessage("No data found.");
        }
    } catch {
        showMessage("Error fetching weather.");
    }
});

function showLoading() {
    resultBox.textContent = "Loading...";
    resultBox.classList.add("active");
}

function showMessage(msg) {
    resultBox.textContent = msg;
    resultBox.classList.add("active");
}

function displayWeather(data) {
    // Clear
    resultBox.textContent = "";

    // City
    const cityEl = document.createElement("div");
    cityEl.className = "weather-city";
    cityEl.textContent = data.city;

    // Condition
    const conditionEl = document.createElement("div");
    conditionEl.className = "weather-condition";
    conditionEl.textContent = data.condition;

    // Icon 
    const iconClass = getWeatherIconClass(data.condition);
    let iconEl = null;
    if (iconClass) {
        iconEl = document.createElement("i");
        iconEl.className = "weather-icon " + iconClass;
    }

    // Temperature
    const tempEl = document.createElement("div");
    tempEl.className = "weather-temp";
    tempEl.textContent = `${data.temp}°C`;

    // Add
    resultBox.appendChild(cityEl);
    resultBox.appendChild(conditionEl);
    if (iconEl) resultBox.appendChild(iconEl);
    resultBox.appendChild(tempEl);

    resultBox.classList.add("active");
}

function getWeatherIconClass(condition) {
    if (!condition) return "";
    const cond = condition.toLowerCase();
    if (cond.includes("rain")) return "fa-solid fa-cloud-showers-heavy";
    if (cond.includes("storm") || cond.includes("thunder")) return "fa-solid fa-bolt";
    if (cond.includes("snow")) return "fa-solid fa-snowflake";
    if (cond.includes("cloud")) return "fa-solid fa-cloud";
    if (cond.includes("clear") || cond.includes("sun")) return "fa-solid fa-sun";
    if (cond.includes("fog") || cond.includes("mist")) return "fa-solid fa-smog";
    return "";
}

async function getWeather(city) {
    const url = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/" + encodeURIComponent(city) + "?unitGroup=metric&key=" + API_KEY + "&contentType=json";

    const response = await fetch(url);
    if (!response.ok) {
        return null;
    }

    const json = await response.json();
    if (!json || !json.days || !json.days[0]) {
        return null;
    }

    const now = new Date();
    const currentHour = now.getHours();
    let hourObj = json.days[0].hours.find(h => {
        const [hHour] = h.datetime.split(":").map(Number);
        return hHour === currentHour;
    });

    if (!hourObj) hourObj = json.days[0].hours[0];
    
    return {
        city: json.address,
        temp: hourObj.temp,
        condition: hourObj.conditions
    };
}