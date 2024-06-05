// DOM elements
const cityInputEl = document.querySelector("#city-name");
const searchBtnEl = document.querySelector("#search-btn");

// Global variables
const WEATHER_API_BASE_URL = "https://api.openweathermap.org";
const WEATHER_API_KEY = "f23ee9deb4e1a7450f3157c44ed020e1";
const MAX_DAILY_FORECAST = 5;

searchBtnEl.addEventListener("click", (event) => {
  event.preventDefault();

  const city = cityInputEl.value;
  doSomething(city);
});

// Lookup the location to get the Lat/Lon
function doSomething(city) {
  const apiUrl = `${WEATHER_API_BASE_URL}/geo/1.0/direct?q=${city}&limit=5&appid=${WEATHER_API_KEY}`;
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      //   console.log(data, "<-----");

      // Pick the First location from the results
      const location = data[0];
      const lat = location.lat;
      const lon = location.lon;

      //   console.log("location:", location, "lat:", lat, "lon:", lon);

      // Get the Weather for the cached location
      const apiUrl = `${WEATHER_API_BASE_URL}/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly&appid=${WEATHER_API_KEY}`;

      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          //   console.log(data.current, "<=====");
          const currentWeather = data.current;
          const currentTemp = Math.floor(((currentWeather.temp - 32) * 5) / 9);
          const currentHumidity = currentWeather.humidity;
          const currentWindSpeed = currentWeather.wind_speed;
          // Show the Current Weather Forecast
          console.log(
            "Temp:",
            Math.floor(((currentWeather.temp - 32) * 5) / 9),
            "Humidity:",
            currentWeather.humidity,
            "Wind:",
            currentWeather.wind_speed
          );

          // Show the 5 Day Weather Forecast
        });
    });
}
