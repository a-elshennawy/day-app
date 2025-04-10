// loader
function hideLoader() {
  document.querySelector(".loader").style.transition = "opacity 1s";
  document.querySelector(".loader").style.opacity = "0";

  setTimeout(() => {
    document.querySelector(".loader").style.display = "none";
  }, 1000);
}

// keys
const WEATHER_KEY = "6f3637406b955c7a35f0056578b09762";
const TIME_KEY = "PUJYO2LMQ6YZ";
const cityInput = document.getElementById("city");

// get location
async function getUserLocation() {
  if (navigator.geolocation) {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          let lat = position.coords.latitude;
          let lon = position.coords.longitude;
          await getWeatherData(lat, lon);
          resolve();
        },
        async () => {
          await getCityCoords("cairo");
          resolve();
        }
      );
    });
  } else {
    await getCityCoords("cairo");
  }
}

// get city coords
async function getCityCoords(city) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_KEY}&units=metric&lang=en`
  );
  const data = await response.json();
  let lat = data.coord.lat;
  let lon = data.coord.lon;
  document.getElementById("city").value = data.name;
  await getWeatherData(lat, lon);
}

// get weather data
async function getWeatherData(lat, lon) {
  const weatherResponse = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_KEY}&units=metric&lang=en`
  );
  const weatherData = await weatherResponse.json();
  document.getElementById("cityindicate").innerHTML = weatherData.name;
  document.getElementById(
    "temp"
  ).innerHTML = `<img src="img/icons8-temperature-16.png" alt="" /> ${weatherData.main.temp} °C`;
  document.getElementById(
    "airPressure"
  ).innerHTML = `<img src="img/icons8-air-pressure-16.png" alt="" /> ${weatherData.main.pressure} mmHG`;
  document.getElementById(
    "windSpeed"
  ).innerHTML = `<img src="img/icons8-wind-16.png" alt="" /> ${weatherData.wind.speed} km/h`;
  document.getElementById(
    "weatherDesc"
  ).innerHTML = `<img src="img/icons8-pin-16.png" alt="" /> ${weatherData.weather[0].description}`;

  const forecastResponse = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_KEY}`
  );
  const forecastData = await forecastResponse.json();
  const dailyForecasts = forecastData.list.filter((entry) =>
    entry.dt_txt.includes("12:00:00")
  );
  document.getElementById("weatherForecast").innerHTML = dailyForecasts
    .map((day) => {
      let data = new Date(day.dt_txt);
      let formattedDate = `${data.getDate()} / ${data.getMonth() + 1}`;
      let temp = day.main.temp.toFixed(1);
      let desc = day.weather[0].description;
      return `<div class="forecastItem col-2"> <span><img src="img/icons8-date-16.png" alt="" /> ${formattedDate}</span> <br> <span><img src="img/icons8-temperature-16.png" alt="" /> ${temp}°C</span> <br> <span><img src="img/icons8-pin-16.png" alt="" /> ${desc}</div></span>`;
    })
    .join("");

  const timeResponse = await fetch(
    `https://api.timezonedb.com/v2.1/get-time-zone?key=${TIME_KEY}&format=json&by=position&lat=${lat}&lng=${lon}`
  );
  const timeData = await timeResponse.json();
  let dateTime = new Date(timeData.formatted);
  let hours = dateTime.getHours();
  let minutes = dateTime.getMinutes();
  let AmPm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  let formattedTime = `${hours} : ${minutes
    .toString()
    .padStart(2, "0")} ${AmPm}`;
  document.getElementById(
    "currTime"
  ).innerHTML = `<img src="img/icons8-clock-32.png" alt=""/> ${formattedTime} `;

  const prayerResponse = await fetch(
    `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=5`
  );
  const data = await prayerResponse.json();

  let hijriDate = data.data.date.hijri;
  let hijriFormatted = `${hijriDate.day} ${hijriDate.month.en} ${hijriDate.year}`;

  let miladiDate = data.data.date.gregorian;
  let miladiFormatted = `${miladiDate.day} ${miladiDate.month.en} ${miladiDate.year}`;

  document.getElementById(
    "hijriDate"
  ).innerHTML = `<img src="img/icons8-date-16.png" alt="" /> ${hijriFormatted}`;

  document.getElementById(
    "miladiDate"
  ).innerHTML = `<img src="img/icons8-date-16.png" alt="" /> ${miladiFormatted}`;

  const icons = [
    "img/icons8-dawn-16.png",
    "img/icons8-sunrise-16.png",
    "img/icons8-midday-16.png",
    "img/icons8-afternoon-16.png",
    "img/icons8-sunset-16.png",
    "img/icons8-night-16.png",
  ];
  document.getElementById("prayer").innerHTML = [
    "Fajr",
    "Sunrise",
    "Dhuhr",
    "Asr",
    "Maghrib",
    "Isha",
  ]
    .map((prayer, index) => {
      let [hours, minutes] = data.data.timings[prayer].split(":");
      let AmPm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      return `<div class="prayerItem col-4"><img src="${icons[index]}" alt="${prayer}" /> ${prayer} <br> ${hours}:${minutes} ${AmPm}</div>`;
    })
    .join("");
}

// City search
document
  .getElementById("city")
  .addEventListener("keypress", async function (event) {
    if (event.key === "Enter") {
      await getCityCoords(this.value);
    }
  });

// Arise 💀
(async function init() {
  await getUserLocation(); // API done ?
  hideLoader(); // Hide loader
})();
