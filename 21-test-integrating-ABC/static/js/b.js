function fetchData2() {
  fetch("/data1")
    .then((response) => response.json())
    .then((data) => {
      update_id1(data);
      update_id2(data);
      update_id3(data);
      update_id4(data);
      update_id5(data);
      update_id6(data);
      update_id7(data);
      update_id8(data);
      update_id9_10_11(data);

      updateSunData(data);
      // checkTheme(data.sunrise, data.sunset);
    });
}
setInterval(fetchData2, 60000);
fetchData2();

function update_id1(data) {
  const iconCode = data.weather[0].icon; // Extract the icon code
  const iconUrl = `static/icons/${data.weather[0].icon.replace("n", "d")}.png`;
  //`https://openweathermap.org/img/wn/${iconCode}@2x.png`; // Construct the full URL
  document.getElementById("id1-icon").src = iconUrl; // Set the image source
}

// Function to update the city name
function update_id2(data) {
  document.getElementById("id2-city").textContent = data.name;
}

// Function to update the weather description
function update_id3(data) {
  document.getElementById("id3-weather").textContent = data.weather[0].description;
}

function update_id4(data) {
  document.getElementById("id4-temp").textContent = Math.round(data.main.temp);
}

function update_id5(data) {
  document.getElementById("id5-feels").textContent = `Feels: ${data.main.feels_like.toFixed(0)}`;
}

function update_id6(data) {
  document.getElementById("id6-temp-mimmax").textContent = `H:${data.main.temp_max.toFixed(0)} L:${data.main.temp_min.toFixed(0)} Hm:${
    data.main.humidity
  }`;
}

function update_id7(data) {
  const precElement = document.getElementById("id7-prepi");
  if (data.rain && data.rain["1h"] !== undefined) {
    precElement.textContent = `Rain: ${data.rain["1h"]}mm/h`;
  } else if (data.snow && data.snow["1h"] !== undefined) {
    precElement.textContent = `Snow: ${data.sow["1h"]}mm/h`;
  } else {
    precElement.textContent = "No Precipitation";
  }
}

function update_id8(data) {
  document.getElementById("id8-clouds").textContent = `Clouds: ${data.clouds.all}%`;
}

function update_id9_10_11(data) {
  document.getElementById("id9-wind").textContent = `Wind: ${data.wind.speed}m/s`;
  if (data.wind.gust !== undefined) {
    document.getElementById("id10-gusts").textContent = `Gusts: ${data.wind.gust}m/s`;
  } else {
    document.getElementById("id10-gusts").textContent = `No Gusts`;
  }
  document.getElementById("id11-direction").textContent = `Direction: ${data.wind.deg}°`;
}

// Function to convert UTC timestamp to HHMM format considering timezone
function convertToLocalTime(timestamp, timezoneOffset) {
  const localTime = new Date((timestamp + timezoneOffset) * 1000);
  const hours = localTime.getUTCHours().toString().padStart(2, "0");
  const minutes = localTime.getUTCMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

// Function to update g_sunData from /data1
function updateSunData(data) {
  if (data.sys && data.sys.sunrise && data.sys.sunset) {
    const timezoneOffset = data.timezone;

    g_sunData.sunrise = convertToLocalTime(data.sys.sunrise, timezoneOffset);
    g_sunData.sunset = convertToLocalTime(data.sys.sunset, timezoneOffset);

    // Calculate Solar Noon (average of sunrise and sunset)
    const solarNoonTimestamp = (data.sys.sunrise + data.sys.sunset) / 2;
    g_sunData.solar_noon = convertToLocalTime(solarNoonTimestamp, timezoneOffset);

    g_sunData.timezone = timezoneOffset;
    // console.log(g_sunData);
  }
}
