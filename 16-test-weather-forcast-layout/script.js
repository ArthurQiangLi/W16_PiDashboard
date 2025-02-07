document.addEventListener("DOMContentLoaded", function () {
  const weatherGrid = document.getElementById("weatherGrid");

  // Hardcoded JSON data with 40 data points (5 days × 8 time slots)
  const data = {
    cnt: 40,
    list: [
      { dt_txt: "2025-02-07 00:00:00", temp: -1, icon: "04n" },
      { dt_txt: "2025-02-07 03:00:00", temp: -2, icon: "03n" },
      { dt_txt: "2025-02-07 06:00:00", temp: -3, icon: "13n" },
      { dt_txt: "2025-02-07 09:00:00", temp: -4, icon: "04n" },
      { dt_txt: "2025-02-07 12:00:00", temp: -5, icon: "01d" },
      { dt_txt: "2025-02-07 15:00:00", temp: -6, icon: "02d" },
      { dt_txt: "2025-02-07 18:00:00", temp: -7, icon: "03d" },
      { dt_txt: "2025-02-07 21:00:00", temp: -8, icon: "04d" },

      { dt_txt: "2025-02-08 00:00:00", temp: 1, icon: "04n" },
      { dt_txt: "2025-02-08 03:00:00", temp: 2, icon: "03n" },
      { dt_txt: "2025-02-08 06:00:00", temp: 3, icon: "13n" },
      { dt_txt: "2025-02-08 09:00:00", temp: 4, icon: "04n" },
      { dt_txt: "2025-02-08 12:00:00", temp: 5, icon: "01d" },
      { dt_txt: "2025-02-08 15:00:00", temp: 6, icon: "02d" },
      { dt_txt: "2025-02-08 18:00:00", temp: 7, icon: "03d" },
      { dt_txt: "2025-02-08 21:00:00", temp: 8, icon: "04d" },

      { dt_txt: "2025-02-09 00:00:00", temp: 0.1, icon: "04n" },
      { dt_txt: "2025-02-09 03:00:00", temp: 0.2, icon: "03n" },
      { dt_txt: "2025-02-09 06:00:00", temp: 0.3, icon: "13n" },
      { dt_txt: "2025-02-09 09:00:00", temp: 0.4, icon: "04n" },
      { dt_txt: "2025-02-09 12:00:00", temp: 0.6, icon: "01d" },
      { dt_txt: "2025-02-09 15:00:00", temp: 0.6, icon: "02d" },
      { dt_txt: "2025-02-09 18:00:00", temp: 0.7, icon: "03d" },
      { dt_txt: "2025-02-09 21:00:00", temp: 0.8, icon: "04d" },

      { dt_txt: "2025-02-10 00:00:00", temp: -1.1, icon: "04n" },
      { dt_txt: "2025-02-10 03:00:00", temp: -1.2, icon: "03n" },
      { dt_txt: "2025-02-10 06:00:00", temp: -1.3, icon: "13n" },
      { dt_txt: "2025-02-10 09:00:00", temp: -1.4, icon: "04n" },
      { dt_txt: "2025-02-10 12:00:00", temp: -1.5, icon: "01d" },
      { dt_txt: "2025-02-10 15:00:00", temp: -1.6, icon: "02d" },
      { dt_txt: "2025-02-10 18:00:00", temp: -1.7, icon: "03d" },
      { dt_txt: "2025-02-10 21:00:00", temp: -1.8, icon: "04d" },

      { dt_txt: "2025-02-11 00:00:00", temp: 10.1, icon: "04n" },
      { dt_txt: "2025-02-11 03:00:00", temp: 20.2, icon: "03n" },
      { dt_txt: "2025-02-11 06:00:00", temp: 30.3, icon: "13n" },
      { dt_txt: "2025-02-11 09:00:00", temp: 40.4, icon: "04n" },
      { dt_txt: "2025-02-11 12:00:00", temp: 50.5, icon: "01d" },
      { dt_txt: "2025-02-11 15:00:00", temp: 60.6, icon: "02d" },
      { dt_txt: "2025-02-11 18:00:00", temp: 70.7, icon: "03d" },
      { dt_txt: "2025-02-11 21:00:00", temp: 80.8, icon: "04d" },
    ],
  };

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
                    <img class="icon" src="https://openweathermap.org/img/wn/${forecast.icon}@2x.png" alt="weather">
                    ${forecast.temp}°
                `;
        weatherGrid.appendChild(createGridItem(content, "cell"));
      } else {
        weatherGrid.appendChild(createGridItem("N/A", "cell"));
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
