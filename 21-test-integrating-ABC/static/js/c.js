function fetchData2() {
  fetch("/data2")
    .then((response) => response.json())
    .then((data) => {
      updateBoxC(data);
    });
}
setInterval(fetchData2, 55000);
fetchData2();

// Hardcoded JSON data with 40 data points (5 days × 8 time slots)
const data = {
  cnt: 40,
  list: [
    { dt_txt: "2025-02-07 00:00:00", temp: -1, icon: "04n" },
    { dt_txt: "2025-02-07 03:00:00", temp: -2, icon: "03n" },
    { dt_txt: "2025-02-07 06:00:00", temp: -3, icon: "13n" },
  ],
};
function updateBoxC(data) {
  const weatherGrid = document.getElementById("weatherGrid");
  const forecasts40 = data.list;
  const times8 = ["00", "03", "06", "09", "12", "15", "18", "21"];
  const uniqueDates5 = [...new Set(forecasts40.map((entry) => entry.dt_txt.split(" ")[0].slice(5)))]; // Output: ["02-07", "02-08", "02-09", "02-10", "02-11"]

  weatherGrid.innerHTML = "";

  // First empty top-left cell
  weatherGrid.appendChild(createGridItem("", "topleft"));

  // First row 2~9: Time headers
  times8.forEach((time) => {
    weatherGrid.appendChild(createGridItem(time, "head"));
  });

  uniqueDates5.forEach((date) => {
    // Populate each row
    weatherGrid.appendChild(createGridItem(date, "head2")); // First column: Date

    // Fill in 8 forecastes, because 'times' length is 8.
    times8.forEach((time) => {
      const forecast = forecasts40.find((entry) => entry.dt_txt.includes(`${date} ${time}:00:00`));
      if (forecast) {
        const content = `
                      <img class="grid-item icon" src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" alt="weather">
                      ${forecast.main.temp}°
                  `;
        weatherGrid.appendChild(createGridItem(content, "cell"));
      } else {
        weatherGrid.appendChild(createGridItem("N/A", "cell"));
      }
    });
  });
}

function createGridItem(content, extraClass = "") {
  const div = document.createElement("div");
  div.className = `grid-item ${extraClass}`;
  div.innerHTML = content;
  return div;
}
