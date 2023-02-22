let apiKey = "3499ef150985eccadd080ff408a018df";

let weather = {
  paris: {
    temp: 19.7,
    humidity: 80,
  },
  tokyo: {
    temp: 17.3,
    humidity: 50,
  },
  lisbon: {
    temp: 30.2,
    humidity: 20,
  },
  "san francisco": {
    temp: 20.9,
    humidity: 100,
  },
  oslo: {
    temp: -5,
    humidity: 20,
  },
};

function weatherInCity(city) {
  city = city.toLowerCase();
  if (weather.hasOwnProperty(city)) {
    let capitalizedCity = city.charAt(0).toUpperCase() + city.slice(1);
    let tempInFahrenheit = convertCelsiusToFahrenheit(weather[city].temp);
    let roundedTemp = Math.round(weather[city].temp);
    return `It is currently ${roundedTemp}°C (${tempInFahrenheit}°F) in ${capitalizedCity} with a humidity of ${weather[city].humidity}%`;
  } else {
    return `Sorry, we don't know the weather for this city, try going to https://www.google.com/search?q=weather+${city}`;
  }
}

function convertCelsiusToFahrenheit(tempInCelcius) {
  let tempInFahrenheit = tempInCelcius * (9 / 5) + 32;
  return Math.round(tempInFahrenheit);
}
function convertFahrenheitToCelcius(tempInFahrenheit) {
  let tempInCelcius = ((tempInFahrenheit - 32) * 5) / 9;
  return Math.round(tempInCelcius);
}

let tempDisplayInCelcius = true;

function injectFahrenheitTemp() {
  if (!tempDisplayInCelcius) {
    // short circuit
    return;
  }

  // find the temp in celcius from the page
  let temperatureDisplay = document.querySelector("#today-temperature");
  // grab that number
  let temperatureInCelcius = temperatureDisplay.innerHTML;
  // use our existing function to convert that number
  let temperatureInFahrenheit =
    convertCelsiusToFahrenheit(temperatureInCelcius);
  console.log(temperatureInFahrenheit);
  // inject the new value into the display
  temperatureDisplay.innerHTML = temperatureInFahrenheit;
  //toggle
  tempDisplayInCelcius = !tempDisplayInCelcius;
}

function injectCelciusTemp() {
  if (tempDisplayInCelcius) {
    return;
  }
  let temperatureDisplay = document.querySelector("#today-temperature");
  let temperatureInFahrenheit = temperatureDisplay.innerHTML;
  let temperatureInCelcius = convertFahrenheitToCelcius(
    temperatureInFahrenheit
  );
  console.log(temperatureInCelcius);
  temperatureDisplay.innerHTML = temperatureInCelcius;
  //toggle
  tempDisplayInCelcius = !tempDisplayInCelcius;
}

let fahrenheitConversionLink = document.querySelector("#fahrenheit-link");
fahrenheitConversionLink.addEventListener("click", injectFahrenheitTemp);

let celciusConversionLink = document.querySelector("#celcius-link");
celciusConversionLink.addEventListener("click", injectCelciusTemp);

let city = prompt("What city are you in?");
alert(weatherInCity(city));

let now = new Date();
let currentTime = now.toTimeString();
let currentTimeDisplay = currentTime.slice(0, 5);

let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let currentDayDisplay = days[now.getDay()];

let injectDay = document.querySelector("#current-day");
injectDay.innerHTML = `${currentDayDisplay}`;

let injectTime = document.querySelector("#current-time");
injectTime.innerHTML = `${currentTimeDisplay}`;

function updateTemperatureInCity(response) {
  console.log(response);
  let temperatureInCity = document.querySelector("#today-temperature");
  console.log(temperatureInCity);
  let roundedTemp = Math.round(response.data.main.temp);
  temperatureInCity.innerHTML = `${roundedTemp} `;
}

function displaySearchedCityData(event) {
  event.preventDefault();
  let searchedCity = document.querySelector("#city-display");
  let city = document.querySelector("#city-text");
  console.log(city.value);
  searchedCity.innerHTML = city.value;
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&appid=${apiKey}&units=${units}`;
  console.log(apiUrl);
  axios.get(apiUrl).then(updateTemperatureInCity);
}

let form = document.querySelector("form");
form.addEventListener("submit", displaySearchedCityData);

//currentLocationButton

function updateTemperature(response) {
  let temperature = Math.round(response.data.main.temp);
  let temperatureInCurrentLocation =
    document.querySelector("#today-temperature");
  temperatureInCurrentLocation.innerHTML = `${temperature} `;
}

function updatePlace(response) {
  let place = response.data.name;
  let placeDisplay = document.querySelector("#city-display");
  console.log(place);
  placeDisplay.innerHTML = `${place}`;
}

function updateDescription(response) {
  let descriptionDisplay = document.querySelector("#weather-description");
  let description = response.data.weather[0].description;
  console.log(description);
  descriptionDisplay.innerHTML = `${description}`;
}

function handleApiResponse(response) {
  updateTemperature(response);
  updatePlace(response);
  updateDescription(response);
}

function getWeatherInLocation(position) {
  let apiKey = "3499ef150985eccadd080ff408a018df";
  let apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;
  console.log(apiURL);
  axios.get(apiURL).then(handleApiResponse);
}

function errorCallback() {
  console.log("Couln't retrieve position");
}

function displayCurrentLocationData() {
  navigator.geolocation.getCurrentPosition(getWeatherInLocation, errorCallback);
}

let currentLocationButton = document.querySelector("#current-location-button");
currentLocationButton.addEventListener("click", displayCurrentLocationData);
