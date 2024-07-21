const container = document.querySelector(".container");
const search = document.querySelector(".search-box button");
const weatherBox = document.querySelector(".weather-box");
const weatherDetails = document.querySelector(".weather-details");
const error404 = document.querySelector(".not-found");
const searchInput = document.querySelector(".search-box input");
const weeklyForecast = document.querySelector(".weekly-forecast");

search.addEventListener("click", fetchWeather);
searchInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    fetchWeather();
  }
});

function fetchWeather() {
  const APIKey = "98740f4ebc0d63bc0f8ba70090e5a091";
  const city = searchInput.value.trim();

  // Clear input field
    searchInput.value = '';

  // Reset visibility
  weatherBox.style.visibility = "hidden";
  weatherDetails.style.visibility = "hidden";
  error404.style.visibility = "hidden";
  weeklyForecast.innerHTML = ''; // Clear previous forecast data

  if (city === "") return;

  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`
  )
    .then((response) => response.json())
    .then((json) => {
      if (json.cod === "404") {
        error404.style.visibility = "visible";
        return;
      }

      error404.style.visibility = "hidden";
      weatherBox.style.visibility = "visible";
      weatherDetails.style.visibility = "visible";

      const image = document.querySelector(".weather-box img");
      const temperature = document.querySelector(".weather-box .temperature");
      const description = document.querySelector(".weather-box .description");
      const humidity = document.querySelector(
        ".weather-details .humidity span"
      );
      const wind = document.querySelector(".weather-details .wind span");

      switch (json.weather[0].main) {
        case "Clear":
          image.src = "images/clear.png";
          break;
        case "Rain":
          image.src = "images/rain.png";
          break;
        case "Snow":
          image.src = "images/snow.png";
          break;
        case "Clouds":
          image.src = "images/cloud.png";
          break;
        case "Mist":
          image.src = "images/mist.png";
          break;
        default:
          image.src = "images/cloud.png";
          break;
      }

      temperature.innerHTML = `${parseInt(json.main.temp)}<sup>°C</sup>`;
      description.innerHTML = `${json.weather[0].description}`;
      humidity.innerHTML = `${json.main.humidity}%`;
      wind.innerHTML = `${parseInt(json.wind.speed)}Km/h`;

      // GSAP Animations for current weather
      gsap.fromTo(".weather-box img", { opacity: 0, y: -50 }, { opacity: 1, y: 0, duration: 1 });
      gsap.fromTo(".temperature", { opacity: 0, y: -50 }, { opacity: 1, y: 0, duration: 1, delay: 0.1 });
      gsap.fromTo(".description", { opacity: 0, y: -50 }, { opacity: 1, y: 0, duration: 1, delay: 0.2 });
      gsap.fromTo(".humidity", { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: 1, delay: 0.4 });
      gsap.fromTo(".wind", { opacity: 0, x: 50 }, { opacity: 1, x: 0, duration: 1, delay: 0.6 });

      // Fetch weekly forecast data
      fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${APIKey}`
      )
        .then((response) => response.json())
        .then((forecastJson) => {
          const forecastData = forecastJson.list;

          // Display weekly forecast
          forecastData.forEach((forecast, index) => {
            if (index % 8 === 0) { // Display every 24 hours (3-hour intervals, so 8 times for daily)
              const date = new Date(forecast.dt * 1000);
              const day = date.toLocaleDateString("en-US", { weekday: "short" });
              const temp = parseInt(forecast.main.temp);
              const weatherIcon = getWeatherIcon(forecast.weather[0].main);

              const forecastItem = document.createElement("div");
              forecastItem.classList.add("forecast-item");
              forecastItem.innerHTML = `
                <div>${day}</div>
                <div><img src="${weatherIcon}" alt="${forecast.weather[0].main}"></div>
                <div>${temp}°C</div>
              `;
              weeklyForecast.appendChild(forecastItem);

              // GSAP Animations for forecast items
              gsap.fromTo(forecastItem, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, delay: index * 0.01 });
            }
          });
        });
    });
}

function getWeatherIcon(weatherMain) {
  switch (weatherMain) {
    case "Clear":
      return "images/clear.png";
    case "Rain":
      return "images/rain.png";
    case "Snow":
      return "images/snow.png";
    case "Clouds":
      return "images/cloud.png";
    case "Mist":
      return "images/mist.png";
    default:
      return "images/cloud.png";
  }
}

