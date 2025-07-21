const API_KEY = "759VFHQK5Y5LELB23N8MSP9T3";
const form = document.getElementById("weather-form");
const cityInput = document.getElementById("city-input");
const resultBox = document.getElementById("result");

form.addEventListener("submit", async(e) => {
    e.preventDefault();
    resultBox.textContent = "Loading...";
    const city = cityInput.value.trim();
    try {
        const data = await getWeather(city);
        if (data) {
            resultBox.textContent = data.city + ": " + data.temp + "°C, " + data.condition;
        } else {
            resultBox.textContent = "No data found."
        }
    } catch {
        resultBox.textContent = "Error fetching weather."
    }
});

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
        const apiHour = new Date(h.datetime).getHours();
        return apiHour === currentHour;
    });

    if (!hourObj) hourObj = json.days[0].hours[0];

    return {
        city: json.address,
        temp: hourObj.temp,
        condition: hourObj.conditions
    };
}