// DOM elements
const cityInputEl = document.querySelector("#city-name");
const searchBtnEl = document.querySelector("#search-btn");
const clearBtnEl = document.querySelector("#clear-btn");
const currentWeatherData = document.querySelector("#current-weather-data");
const upcomingWeatherData = document.querySelector("#daily-weather-data");
const fiveDayForecastEl = document.querySelector("#five-day-forecast");
const searchedCitiesEl = document.querySelector("#searched-cities");

// Global variables
const WEATHER_API_BASE_URL = "https://api.openweathermap.org";
const WEATHER_API_KEY = "f23ee9deb4e1a7450f3157c44ed020e1";
const MAX_DAILY_FORECAST = 5;

// Event listener for search button
searchBtnEl.addEventListener("click", (event) => {
  event.preventDefault();

  const city = cityInputEl.value;

  // Clear previous data
  searchedCitiesEl.textContent = "";
  currentWeatherData.textContent = "";
  upcomingWeatherData.textContent = "";

  fetchWeatherData(city);
  showSearchedCities(city);
});

// Show searched cities on page load
showSearchedCities();

// Display searched cities
function showSearchedCities(city) {
  if (city) {
    let citiesArr = JSON.parse(localStorage.getItem("searchedCities")) || [];
    if (!citiesArr.includes(city)) {
      citiesArr.push(city);
      localStorage.setItem("searchedCities", JSON.stringify(citiesArr));
    } else {
      console.log("City already saved");
    }
  }

  const storedCities = JSON.parse(localStorage.getItem("searchedCities")) || [];

  storedCities.forEach((city) => {
    const cityBtnEl = document.createElement("button");
    cityBtnEl.textContent = city;
    cityBtnEl.classList.add("searched-city-button");
    searchedCitiesEl.append(cityBtnEl);

    // Add event listener to each city button
    cityBtnEl.addEventListener("click", (event) => {
      event.preventDefault();
      currentWeatherData.textContent = "";
      upcomingWeatherData.textContent = "";
      fiveDayForecastEl.textContent = "";
      fetchWeatherData(city);
    });

    // Set button styles
    cityBtnEl.setAttribute(
      "style",
      "width: 100%; border: none; border-radius: 5px; padding: 5px; margin-bottom: 10px; color: white; background-color: #895bff"
    );
  });
}

// Fetch weather data for a city
function fetchWeatherData(city) {
  const apiUrl = `${WEATHER_API_BASE_URL}/geo/1.0/direct?q=${city}&limit=5&appid=${WEATHER_API_KEY}`;
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      console.log(data, "<-----");

      // Pick the first location from the results
      const location = data[0];
      const lat = location.lat;
      const lon = location.lon;

      // Get the weather for the selected location
      const apiUrl = `${WEATHER_API_BASE_URL}/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly&appid=${WEATHER_API_KEY}`;

      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          console.log(data, "******");

          // Current weather data
          const currentWeather = data.current;

          const currentDate = dayjs().format("D/M/YYYY");
          const currentTemp = Math.floor(((currentWeather.temp - 32) * 5) / 9);
          const currentWindSpeed = currentWeather.wind_speed;
          const currentHumidity = currentWeather.humidity;

          // Display current weather forecast
          const currentLocation = document.createElement("h2");
          currentLocation.innerHTML = `${city} (${currentDate})`;
          currentWeatherData.append(currentLocation);

          // Display current weather icon
          const currentWeatherIcon = currentWeather.weather[0].icon;
          const currentWeatherIconURL = `http://openweathermap.org/img/wn/${currentWeatherIcon}.png`;
          const currentWeatherDescription =
            currentWeather.weather[0].description;

          const currentWeatherIconImg = document.createElement("img");
          currentWeatherIconImg.src = currentWeatherIconURL;
          currentWeatherIconImg.alt = currentWeatherDescription;
          currentLocation.append(currentWeatherIconImg);

          // Set styles for current weather section
          currentLocation.setAttribute(
            "style",
            "font-size: 2.2rem; font-weight: 700; margin: 10px 0;"
          );

          currentWeatherData.setAttribute(
            "style",
            "width: 95%; border: 2px solid; border-radius: 5px; margin: 10px 20px; padding-left: 7px; box-shadow: 7px 7px rgba(72, 1, 255, 0.4); background: linear-gradient(to right, #00c6ff, #0072ff)"
          );

          // Show current temperature, wind speed, and humidity
          const currentLocationTemp = document.createElement("p");
          const currentLocationWind = document.createElement("p");
          const currentLocationHumidity = document.createElement("p");

          currentLocationTemp.textContent = `Temp: ${currentTemp} °C`;
          currentLocationWind.textContent = `Wind: ${currentWindSpeed} MPH`;
          currentLocationHumidity.textContent = `Humidity: ${currentHumidity}%`;

          currentWeatherData.append(currentLocationTemp);
          currentWeatherData.append(currentLocationWind);
          currentWeatherData.append(currentLocationHumidity);

          // Display 5-day weather forecast
          const dailyWeather = data.daily;

          for (let i = 0; i < 5; i++) {
            const upcomingWeather = dailyWeather[i];
            const upcomingDate = dayjs()
              .add(i + 1, "day")
              .format("D/M/YYYY");

            // Display upcoming weather icon
            const upcomingWeatherIcon = dailyWeather[i].weather[0].icon;
            const upcomingWeatherIconURL = `http://openweathermap.org/img/wn/${upcomingWeatherIcon}.png`;
            const upcomingWeatherDescription =
              dailyWeather[i].weather[0].description;

            const upcomingWeatherIconImg = document.createElement("img");
            upcomingWeatherIconImg.src = upcomingWeatherIconURL;
            upcomingWeatherIconImg.alt = upcomingWeatherDescription;

            const upcomingTemp = Math.floor(
              ((upcomingWeather.temp.day - 32) * 5) / 9
            );
            const upcomingWindSpeed = upcomingWeather.wind_speed;
            const upcomingHumidity = upcomingWeather.humidity;

            // Show upcoming weather data
            const upcomingLocationDate = document.createElement("h3");
            const upcomingLocationTemp = document.createElement("p");
            const upcomingLocationWind = document.createElement("p");
            const upcomingLocationHumidity = document.createElement("p");

            upcomingLocationDate.textContent = `${upcomingDate}`;
            upcomingLocationTemp.textContent = `Temp: ${upcomingTemp} °C`;
            upcomingLocationWind.textContent = `Wind: ${upcomingWindSpeed} MPH`;
            upcomingLocationHumidity.textContent = `Humidity: ${upcomingHumidity}%`;

            const upcomingWeatherDivEl = document.createElement("div");

            // Append upcoming weather elements to the div
            upcomingWeatherDivEl.append(upcomingLocationDate);
            upcomingWeatherDivEl.append(upcomingWeatherIconImg);
            upcomingWeatherDivEl.append(upcomingLocationTemp);
            upcomingWeatherDivEl.append(upcomingLocationWind);
            upcomingWeatherDivEl.append(upcomingLocationHumidity);

            // Append the div to the upcoming weather data section
            upcomingWeatherData.append(upcomingWeatherDivEl);

            // Set styles for upcoming weather divs
            upcomingWeatherDivEl.setAttribute(
              "style",
              "padding: 5px 20px; margin: 10px 0; border: 2px solid; border-radius: 5px; box-shadow: 7px 7px rgba(72, 1, 255, 0.4); background: linear-gradient(to right, #00c6ff, #0072ff)"
            );
          }

          // Set styles for upcoming weather section
          upcomingWeatherData.setAttribute(
            "style",
            "width: 95%; margin: 10px 20px; padding-left: 7px"
          );

          // Add 5-day forecast heading
          const upcomingForecastHeading = document.createElement("h2");
          upcomingForecastHeading.textContent = "5-Day Forecast:";
          fiveDayForecastEl.append(upcomingForecastHeading);

          // Set styles for forecast heading
          upcomingForecastHeading.setAttribute(
            "style",
            "font-weight: 700; margin-left: 30px; margin-top: 30px"
          );
        });
    });
}

// Remove search history when clear button is clicked
clearBtnEl.addEventListener("click", (event) => {
  event.preventDefault();

  // Clear all displayed data
  searchedCitiesEl.textContent = "";
  currentWeatherData.textContent = "";
  upcomingWeatherData.textContent = "";
  fiveDayForecastEl.textContent = "";

  localStorage.clear();
});
