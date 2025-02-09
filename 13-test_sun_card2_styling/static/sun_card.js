document.addEventListener("DOMContentLoaded", function () {
  f1_fetchSunData();
  setInterval(f7_updatePeriodically, 1000); // in ms
});

let g_sunData = {}; // Global variable
let g_noonShift = 0; // noon shift in minutes, if solar_noon=11:30, noon_shift=-30
let g_HorizonY = 100;

function f1_fetchSunData() {
  fetch("/sun-data")
    .then((response) => response.json())
    .then((data) => {
      g_sunData = data; // Store data globally
      f3_calcNoonShift(g_sunData.solar_noon);
      f2_generateSunPath(); // Draw the trajectory
      // f6_adjustHorizonSky(f5_cvtHhmmToMinutes(data.current_time));
    });
}

function f7_updatePeriodically() {
  let now = new Date();
  let hhmm = now.toTimeString().slice(0, 5); // "HH:MM"
  let nowMinutes = f5_cvtHhmmToMinutes(hhmm);

  f4_updateSunXY(nowMinutes);
  f6_adjustHorizonSky(nowMinutes);
  f5_adjustHourlyGridLines();
}

// Function to map time to an (x, y) coordinate on the SVG
function f8_calcSunXY(minutes) {
  let T = 24 * 60; // Full period (1440 minutes)
  let N = g_noonShift; // Phase shift
  let A = 50; // Amplitude (height of the curve)
  let C = 100; // Offset (baseline height)

  let x = (minutes / T) * 500; // Scale 1440 minutes to 500 pixels
  let y = A * Math.cos((2 * Math.PI * minutes) / T - (2 * Math.PI * N) / T) + C;

  return { x, y };
}

// Update the sun's position on the SVG
function f4_updateSunXY(nowMinutes) {
  let sun = document.getElementById("svg-sun");

  let { x, y } = f8_calcSunXY(nowMinutes);

  // Update sun's position on the SVG
  sun.setAttribute("cx", x);
  sun.setAttribute("cy", y);
}

function f5_cvtHhmmToMinutes(HHMM_str) {
  if (typeof HHMM_str !== "string" || !HHMM_str.includes(":")) {
    console.error("Invalid input:", HHMM_str);
    return 0;
  }
  const [hours, minutes] = HHMM_str.split(":").map(Number); // Split the input string into hours and minutes
  // Convert input time to total minutes
  const totalMinutes = hours * 60 + minutes;
  return totalMinutes;
}

//if solar_noon is 12:30, then Phase shift is 30 (in minutes), if 11:30, then -30
function f3_calcNoonShift(solar_noon) {
  const m = f5_cvtHhmmToMinutes(solar_noon);
  const noonMinutes = 12 * 60;
  g_noonShift = m - noonMinutes;
  return g_noonShift;
}

// Generate the sine wave trajectory and update the SVG path
function f2_generateSunPath() {
  let T = 24 * 60; // Full period (1440 minutes)
  let path = document.getElementById("sun-path");
  let d = "M ";

  for (let t = 0; t <= T; t += 10) {
    let { x, y } = f8_calcSunXY(t);
    d += `${x},${y} `;
  }

  path.setAttribute("d", d);
}

function f5_adjustHourlyGridLines() {
  let minor = document.getElementById("hourly-line");
  let major = document.getElementById("major-hour-line");
  minor.setAttribute("y1", g_HorizonY + 2);
  minor.setAttribute("y2", g_HorizonY + 5);
  major.setAttribute("y1", g_HorizonY + 2);
  major.setAttribute("y2", g_HorizonY + 5);
}

function f6_adjustHorizonSky(now_m) {
  let hor = document.getElementById("svg-hline");
  let sky = document.getElementById("svg-sky");
  let gnd = document.getElementById("svg-gnd");
  let sunrise = document.getElementById("svg-sunrise");
  let sunset = document.getElementById("svg-sunset");
  const sunrise_m = f5_cvtHhmmToMinutes(g_sunData.sunrise); //get sunrise t-minutes
  const sunset_m = f5_cvtHhmmToMinutes(g_sunData.sunset); //get sunset t-minutes
  let sunriseXY = f8_calcSunXY(sunrise_m);
  let sunsetXY = f8_calcSunXY(sunset_m);
  // console.log("hor:", x, y);
  g_HorizonY = sunriseXY.y;
  hor.setAttribute("y1", sunriseXY.y);
  hor.setAttribute("y2", sunriseXY.y);
  sky.setAttribute("height", sunriseXY.y);
  gnd.setAttribute("y", sunriseXY.y);
  gnd.setAttribute("height", 200 - sunriseXY.y);
  if (sunrise_m < now_m && now_m < sunset_m) {
    //change sky color, set to bright when between sunrise and sunset.
    sky.setAttribute("fill", "#223d5d"); //is day time
  } else {
    sky.setAttribute("fill", "#1e2026"); //is night time
  }
  //Add sunset sunrise time to svg
  sunrise.textContent = g_sunData.sunrise;
  sunrise.setAttribute("x", sunriseXY.x);
  sunset.textContent = g_sunData.sunset;
  sunset.setAttribute("x", sunsetXY.x);
}
