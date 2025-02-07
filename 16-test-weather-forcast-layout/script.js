document.addEventListener("DOMContentLoaded", function () {
  const weatherGrid = document.getElementById("weatherGrid");

  // Hardcoded JSON data with 40 data points (5 days × 8 time slots)
  const data = {
    cnt: 40,
    list: [
      { dt_txt: "2025-02-07 00:00:00", temp: -1.5, icon: "04n" },
      { dt_txt: "2025-02-07 03:00:00", temp: -2.4, icon: "03n" },
      { dt_txt: "2025-02-07 06:00:00", temp: -7.2, icon: "13n" },
      { dt_txt: "2025-02-07 09:00:00", temp: -5.1, icon: "04n" },
      { dt_txt: "2025-02-07 12:00:00", temp: 0.3, icon: "01d" },
      { dt_txt: "2025-02-07 15:00:00", temp: 2.1, icon: "02d" },
      { dt_txt: "2025-02-07 18:00:00", temp: -0.5, icon: "03d" },
      { dt_txt: "2025-02-07 21:00:00", temp: -3.8, icon: "04d" },

      { dt_txt: "2025-02-08 00:00:00", temp: -2.0, icon: "04n" },
      { dt_txt: "2025-02-08 03:00:00", temp: -3.1, icon: "03n" },
      { dt_txt: "2025-02-08 06:00:00", temp: -6.7, icon: "13n" },
      { dt_txt: "2025-02-08 09:00:00", temp: -4.8, icon: "04n" },
      { dt_txt: "2025-02-08 12:00:00", temp: 1.0, icon: "01d" },
      { dt_txt: "2025-02-08 15:00:00", temp: 3.2, icon: "02d" },
      { dt_txt: "2025-02-08 18:00:00", temp: 0.1, icon: "03d" },
      { dt_txt: "2025-02-08 21:00:00", temp: -2.9, icon: "04d" },

      { dt_txt: "2025-02-09 00:00:00", temp: -3.1, icon: "04n" },
      { dt_txt: "2025-02-09 03:00:00", temp: -4.0, icon: "03n" },
      { dt_txt: "2025-02-09 06:00:00", temp: -8.2, icon: "13n" },
      { dt_txt: "2025-02-09 09:00:00", temp: -6.5, icon: "04n" },
      { dt_txt: "2025-02-09 12:00:00", temp: 0.8, icon: "01d" },
      { dt_txt: "2025-02-09 15:00:00", temp: 3.5, icon: "02d" },
      { dt_txt: "2025-02-09 18:00:00", temp: 1.0, icon: "03d" },
      { dt_txt: "2025-02-09 21:00:00", temp: -1.0, icon: "04d" },

      { dt_txt: "2025-02-10 00:00:00", temp: -4.3, icon: "04n" },
      { dt_txt: "2025-02-10 03:00:00", temp: -5.6, icon: "03n" },
      { dt_txt: "2025-02-10 06:00:00", temp: -9.1, icon: "13n" },
      { dt_txt: "2025-02-10 09:00:00", temp: -7.3, icon: "04n" },
      { dt_txt: "2025-02-10 12:00:00", temp: 0.5, icon: "01d" },
      { dt_txt: "2025-02-10 15:00:00", temp: 4.2, icon: "02d" },
      { dt_txt: "2025-02-10 18:00:00", temp: 1.5, icon: "03d" },
      { dt_txt: "2025-02-10 21:00:00", temp: -2.5, icon: "04d" },

      { dt_txt: "2025-02-11 00:00:00", temp: -5.0, icon: "04n" },
      { dt_txt: "2025-02-11 03:00:00", temp: -6.3, icon: "03n" },
      { dt_txt: "2025-02-11 06:00:00", temp: -10.0, icon: "13n" },
      { dt_txt: "2025-02-11 09:00:00", temp: -8.0, icon: "04n" },
      { dt_txt: "2025-02-11 12:00:00", temp: 0.0, icon: "01d" },
      { dt_txt: "2025-02-11 15:00:00", temp: 5.0, icon: "02d" },
      { dt_txt: "2025-02-11 18:00:00", temp: 2.0, icon: "03d" },
      { dt_txt: "2025-02-11 21:00:00", temp: -3.0, icon: "04d" },
    ],
  };

  const forecasts = data.list;
  const times = ["0", "3", "6", "9", "12", "15", "18", "21"];
  const uniqueDates = [...new Set(forecasts.map((entry) => entry.dt_txt.split(" ")[0].slice(5)))];

  weatherGrid.innerHTML = "";

  // First empty top-left cell
  weatherGrid.appendChild(createGridItem("", "header"));

  // First row: Time headers
  times.forEach((time) => {
    weatherGrid.appendChild(createGridItem(time, "header"));
  });

  // Populate each row
  uniqueDates.forEach((date) => {
    // First column: Date
    weatherGrid.appendChild(createGridItem(date, "header"));

    // Fill in weather data
    times.forEach((time) => {
      const forecast = forecasts.find((entry) => entry.dt_txt.includes(`${date} ${time}:00:00`));
      if (forecast) {
        const content = `
                    <img class="icon" src="https://openweathermap.org/img/wn/${forecast.icon}@2x.png" alt="weather">
                    ${forecast.temp}°C
                `;
        weatherGrid.appendChild(createGridItem(content));
      } else {
        weatherGrid.appendChild(createGridItem("N/A"));
      }
    });
  });

  function createGridItem(content, extraClass = "") {
    const div = document.createElement("div");
    div.className = `grid-item ${extraClass}`;
    div.innerHTML = content;
    return div;
  }
});
