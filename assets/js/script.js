// DOM elements
const cityInputEl = document.querySelector("#city-name");
const searchBtnEl = document.querySelector("#search-btn");
const currentWeatherData = document.querySelector("#current-weather-data");

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
          //   console.log(data);

          // Current weather data
          const currentWeather = data.current;

          const currentDate = dayjs().format("D/M/YYYY");
          const currentTemp = Math.floor(((currentWeather.temp - 32) * 5) / 9);
          const currentWindSpeed = currentWeather.wind_speed;
          const currentHumidity = currentWeather.humidity;

          // Next 5 days weather data
          const dailyWeather = data.daily;
          console.log(dailyWeather);

          // ------------------ Show the Current Weather Forecast ------------------

          //   Show the current location and date
          const currentLocation = document.createElement("h2");
          currentLocation.textContent = `${city} (${currentDate})`;
          currentWeatherData.append(currentLocation);

          currentLocation.setAttribute(
            "style",
            "font-size: 2.2rem; font-weight: 700; margin: 10px 0;"
          );

          //   *** Place at the end ***
          currentWeatherData.setAttribute(
            "style",
            "border: 2px solid; border-radius: 5px; width: 90%; margin: 10px 20px; padding-left: 7px; box-shadow: 7px 7px #4801ff;"
          );

          //   Show the current locations temp, wind, & humidity
          const currentLocationTemp = document.createElement("p");
          const currentLocationWind = document.createElement("p");
          const currentLocationHumidity = document.createElement("p");

          currentLocationTemp.textContent = `Temp: ${currentTemp} °C`;
          currentLocationWind.textContent = `Wind: ${currentWindSpeed} MPH`;
          currentLocationHumidity.textContent = `Humidity: ${currentHumidity}%`;

          currentWeatherData.append(currentLocationTemp);
          currentWeatherData.append(currentLocationWind);
          currentWeatherData.append(currentLocationHumidity);

          // ------------------ Show the 5 Day Weather Forecast --------------------
        });
    });
}
