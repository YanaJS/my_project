function getDate(date) {
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let thisYear = date.getFullYear();
  let thisMonth = months[date.getMonth()];
  let todayDate = date.getDate();

  return `${thisMonth} ${todayDate}, ${thisYear}`;
}

function setDateOnHtmlElement(currentDate) {
  let currentDateEle = document.querySelector("#date");
  currentDateEle.innerHTML = getDate(currentDate);
}

let currentDate = new Date();
setDateOnHtmlElement(currentDate);

function setTime(time) {
  let hours = time.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = time.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[time.getDay()];

  return `${day} ${hours}:${minutes}`;
}

let nowTime = new Date();
let currentTime = document.querySelector("#time");
currentTime.innerHTML = setTime(nowTime);

function search(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-input");
  let city = searchInput.value;
  requestApiByCity(city);
}

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", search);

function getCurrentTemperature(response) {
  let api_description = response.data.weather[0].description;
  //tempInCelsius = response.data.main.temp;
  let api_temp = Math.round(response.data.main.temp);
  let api_icon = response.data.weather[0].icon;
  let api_icon_alt = response.data.weather[0].description;
  let api_city = response.data.name;
  let api_wind = response.data.wind.speed;
  let api_humidity = response.data.main.humidity;
  let api_sunrise = response.data.sys.sunrise;
  let api_sunset = response.data.sys.sunset;
  initCurrentCityArea(
    api_description,
    api_temp,
    api_icon,
    api_icon_alt,
    api_city,
    api_wind,
    api_humidity,
    api_sunrise,
    api_sunset
  );
}

function initCurrentCityArea(
  weatherDescription,
  temperature,
  icon,
  icon_alt,
  city,
  wind,
  humidity,
  sunrise,
  sunset
) {
  let description = document.querySelector("#temp-description");
  description.innerHTML = weatherDescription;
  let temp = document.querySelector("#temp");
  temp.innerHTML = temperature;
  let icon_ele = document.querySelector("#icon");
  icon_ele.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${icon}@2x.png`
  );
  icon_ele.setAttribute("alt", `${icon_alt}`);
  let city_ele = document.querySelector("#city-name");
  city_ele.innerText = city;
  let getWind = Math.round(wind);
  let wind_ele = document.querySelector("#wind");
  wind_ele.innerHTML = `${getWind}`;
  let getHumidity = Math.round(humidity);
  let humidity_ele = document.querySelector("#humidity");
  humidity_ele.innerHTML = `${getHumidity}`;
  const sunrise_time = new Date(sunrise * 1e3);
  let getSunrise = sunrise_time.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
  let sunrise_ele = document.querySelector("#sunrise");
  sunrise_ele.innerHTML = `🌅 Sunrise: ${getSunrise}`;
  const sunset_time = new Date(sunset * 1e3);
  let getSunset = sunset_time.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
  let sunset_ele = document.querySelector("#sunset");
  sunset_ele.innerHTML = `🌆 Sunset: ${getSunset}`;
}

function requestApiByCity(city) {
  let units = "metric";
  let apiKey = "809c5ab3e78d894a60211d95bd8050e5";
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather";
  let weatherApiUrlByCity = `${apiEndpoint}?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(weatherApiUrlByCity).then(getCurrentTemperature);
}

function requestApiByCoords(lat, lon) {
  let units = "metric";
  let apiKey = "809c5ab3e78d894a60211d95bd8050e5";
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather";
  let weatherApiUrlByCoords = `${apiEndpoint}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;
  axios.get(weatherApiUrlByCoords).then(getCurrentTemperature);
}

requestApiByCity("Tokyo");

function getCurrentCoords() {
  navigator.geolocation.getCurrentPosition(success, error);
}

function success(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  requestApiByCoords(lat, lon);
}

function error(err) {
  alert(`You didn't give permission to use your location.`);
}

let btnLocation = document.querySelector("#current-location");
btnLocation.addEventListener("click", getCurrentCoords);

//My approach:
function cToF(event) {
  event.preventDefault();
  let cTemp = document.querySelector("#temp").innerText;
  tempInC.classList.remove("active");
  tempInF.classList.add("active");
  cTemp = Number(cTemp);
  let cToFahr = (cTemp * 9) / 5 + 32;
  cToFahr = Math.round(cToFahr);
  document.querySelector("#temp").innerHTML = `${cToFahr}`;
}

function fToC(event) {
  event.preventDefault();
  let fTemp = document.querySelector("#temp").innerText;
  tempInC.classList.add("active");
  tempInF.classList.remove("active");
  fTemp = Number(fTemp);
  let fToCel = ((fTemp - 32) * 5) / 9;
  fToCel = Math.round(fToCel);
  document.querySelector("#temp").innerHTML = `${fToCel}`;
}

//let tempInCelsius = null;

let tempInF = document.querySelector("#fahrenheit");
tempInF.addEventListener("click", cToF);

let tempInC = document.querySelector("#celsius");
tempInC.addEventListener("click", fToC);
