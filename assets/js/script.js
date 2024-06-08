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

searchBtnEl.addEventListener("click", (event) => {
  event.preventDefault();

  const city = cityInputEl.value;

  searchedCitiesEl.textContent = "";
  currentWeatherData.textContent = "";
  upcomingWeatherData.textContent = "";

  fetchWeatherData(city);
  showSearchedCities(city);
});

showSearchedCities();

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

  const storedCities = JSON.parse(localStorage.getItem("searchedCities"));

  storedCities.forEach((city) => {
    const cityBtnEl = document.createElement("button");
    cityBtnEl.textContent = city;
    cityBtnEl.classList.add("searched-city-button");
    searchedCitiesEl.append(cityBtnEl);

    cityBtnEl.addEventListener("click", (event) => {
      event.preventDefault();
      currentWeatherData.textContent = "";
      upcomingWeatherData.textContent = "";
      fiveDayForecastEl.textContent = "";
      fetchWeatherData(city);
    });

    searchedCitiesEl.setAttribute("style", "width: 100%");

    cityBtnEl.setAttribute(
      "style",
      "width: 100%; border: none; border-radius: 5px; padding: 5px; margin-bottom: 10px; color: white; background-color: #895bff"
    );
  });
}

// Lookup the location to get the Lat/Lon
function fetchWeatherData(city) {
  const apiUrl = `${WEATHER_API_BASE_URL}/geo/1.0/direct?q=${city}&limit=5&appid=${WEATHER_API_KEY}`;
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      console.log(data, "<-----");

      // Pick the First location from the results
      const location = data[0];
      const lat = location.lat;
      const lon = location.lon;

      // Get the Weather for the cached location
      const apiUrl = `${WEATHER_API_BASE_URL}/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly&appid=${WEATHER_API_KEY}`;

      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          console.log(data), "******";

          // Current weather data
          const currentWeather = data.current;

          const currentDate = dayjs().format("D/M/YYYY");
          const currentTemp = Math.floor(((currentWeather.temp - 32) * 5) / 9);
          const currentWindSpeed = currentWeather.wind_speed;
          const currentHumidity = currentWeather.humidity;

          // ------------------ Show the Current Weather Forecast ------------------

          // Show the current location and date
          const currentLocation = document.createElement("h2");

          currentLocation.innerHTML = `${city} (${currentDate})`;
          currentWeatherData.append(currentLocation);

          // Display the current weather Icon

          const currentWeatherIcon = currentWeather.weather[0].icon;
          const currentWeatherIconURL = `http://openweathermap.org/img/wn/${currentWeatherIcon}.png`;
          const currentWeatherDescription =
            currentWeather.weather[0].description;

          const currentWeatherIconImg = document.createElement("img");
          currentWeatherIconImg.src = currentWeatherIconURL;
          currentWeatherIconImg.alt = currentWeatherDescription;

          currentLocation.append(currentWeatherIconImg);

          currentLocation.setAttribute(
            "style",
            "font-size: 2.2rem; font-weight: 700; margin: 10px 0;"
          );

          currentWeatherData.setAttribute(
            "style",
            "width: 95%; border: 2px solid; border-radius: 5px; margin: 10px 20px; padding-left: 7px; box-shadow: 7px 7px rgba(72, 1, 255, 0.4); background: linear-gradient(to right, #00c6ff, #0072ff)"
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

          // Next 5 days weather data
          const dailyWeather = data.daily;

          // Loop over the daily weather array
          for (let i = 0; i < 5; i++) {
            const upcomingWeather = dailyWeather[i];
            const upcomingDate = dayjs()
              .add(i + 1, "day")
              .format("D/M/YYYY");

            // Display the upcoming days weather Icon

            const upcomingWeatherIcon = dailyWeather[i].weather[0].icon;
            const upcomingWeatherIconURL = `http://openweathermap.org/img/wn/${upcomingWeatherIcon}.png`;
            const upcomingWeatherDescription =
              dailyWeather[i].weather[0].description;

            const upcomingWeatherIconImg = document.createElement("img");
            upcomingWeatherIconImg.src = upcomingWeatherIconURL;
            upcomingWeatherIconImg.alt = upcomingWeatherDescription;

            currentLocation.append(upcomingWeatherIconImg);

            const upcomingTemp = Math.floor(
              ((upcomingWeather.temp.day - 32) * 5) / 9
            );
            const upcomingWindSpeed = upcomingWeather.wind_speed;
            const upcomingHumidity = upcomingWeather.humidity;

            // Show the upcoming locations temp, wind, & humidity
            const upcomingLocationDate = document.createElement("h3");
            const upcomingLocationTemp = document.createElement("p");
            const upcomingtLocationWind = document.createElement("p");
            const upcomingLocationHumidity = document.createElement("p");

            upcomingLocationDate.textContent = `${upcomingDate}`;
            upcomingLocationTemp.textContent = `Temp: ${upcomingTemp} °C`;
            upcomingtLocationWind.textContent = `Wind: ${upcomingWindSpeed} MPH`;
            upcomingLocationHumidity.textContent = `Humidity: ${upcomingHumidity}%`;

            const upcomingWeatherDivEl = document.createElement("div");

            upcomingWeatherDivEl.append(upcomingLocationDate);
            upcomingWeatherDivEl.append(upcomingWeatherIconImg);
            upcomingWeatherDivEl.append(upcomingLocationTemp);
            upcomingWeatherDivEl.append(upcomingtLocationWind);
            upcomingWeatherDivEl.append(upcomingLocationHumidity);

            upcomingWeatherData.append(upcomingWeatherDivEl);

            upcomingWeatherDivEl.setAttribute(
              "style",
              "padding: 5px 20px; margin: 10px 0; border: 2px solid; border-radius: 5px; box-shadow: 7px 7px rgba(72, 1, 255, 0.4); background: linear-gradient(to right, #00c6ff, #0072ff)"
            );
          }

          upcomingWeatherData.setAttribute(
            "style",
            "width: 95%; margin: 10px 20px; padding-left: 7px"
          );

          // 5-day forecast heading
          const upcomingForecastHeading = document.createElement("h2");
          upcomingForecastHeading.textContent = "5-Day Forecast:";
          fiveDayForecastEl.append(upcomingForecastHeading);

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

  searchedCitiesEl.textContent = "";
  currentWeatherData.textContent = "";
  upcomingWeatherData.textContent = "";
  fiveDayForecastEl.textContent = "";

  localStorage.clear();
});
