document.addEventListener("DOMContentLoaded", function () {
  f1_fetchSunData();
  // f5_addGridLines();
  // Fetch sun data every 30 seconds
  setInterval(f7_updatePeriodically, 1000); // 30,000 milliseconds = 30 seconds
});

let g_noonShift = 0; // noon shift in minutes, if solar_noon=11:30, noon_shift=-30
let g_nowHHMMSS = "";

function f1_fetchSunData() {
  f3_calcNoonShift(g_sunData.solar_noon);
  f2_generateSunPath(); // Draw the trajectory
  updateDateDay(g_sunData.timezone);
  // f6_adjustHorizonSky(f5_cvtHhmmToMinutes(data.current_time));
}

function f7_updatePeriodically() {
  let hhmm = getTimeWithOffset(g_sunData.timezone);
  let now_m = f5_cvtHhmmToMinutes(hhmm);

  f4_updateSunXY(now_m);
  f6_adjustHorizonSky(now_m);
}

function getTimeWithOffset(timezoneOffset) {
  let now = new Date();
  let localTime = new Date(now.getTime() + timezoneOffset * 1000);
  let hours = localTime.getUTCHours().toString().padStart(2, "0");
  let minutes = localTime.getUTCMinutes().toString().padStart(2, "0");
  let seconds = localTime.getUTCSeconds().toString().padStart(2, "0");
  g_nowHHMMSS = `${hours}:${minutes}:${seconds}`;
  return `${hours}:${minutes}`;
}

function updateDateDay(timezoneOffset) {
  let now = new Date();
  let localTime = new Date(now.getTime() + timezoneOffset * 1000);

  let year = localTime.getUTCFullYear();
  let month = (localTime.getUTCMonth() + 1).toString().padStart(2, "0"); // Months are 0-based
  let day = localTime.getUTCDate().toString().padStart(2, "0");

  let daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  let dayOfWeek = daysOfWeek[localTime.getUTCDay()];

  let formattedDate = `${year}-${month}-${day} ${dayOfWeek}`;

  // Set text content to the element with id "dateday"
  document.getElementById("id-dateday").textContent = formattedDate;
}

// Example: Call with UTC-5 (offset -18000 seconds)
updateDateDay(-18000);

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

// Add vertical reference lines at x = 0, 1/4T, 1/2T, 3/4T, 1T
// function f5_addGridLines() {
//   let svg = document.querySelector("svg");
//   let T = 24 * 60; // Full period (1440 minutes)
//   let svgWidth = 500; // SVG width in pixels
//   let positions = [0, 1 / 4, 1 / 2, 3 / 4, 1].map((p) => p * svgWidth);

//   positions.forEach((x) => {
//     let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
//     line.setAttribute("x1", x);
//     line.setAttribute("y1", 0);
//     line.setAttribute("x2", x);
//     line.setAttribute("y2", 200);
//     line.setAttribute("stroke", "#414144");
//     line.setAttribute("stroke-width", "1");
//     svg.appendChild(line);
//   });
// }

function f6_adjustHorizonSky(now_m) {
  let hor = document.getElementById("svg-hline");
  let sky = document.getElementById("svg-sky");
  let gnd = document.getElementById("svg-gnd");
  let sunrise = document.getElementById("svg-sunrise");
  let sunset = document.getElementById("svg-sunset");
  let sunnow = document.getElementById("svg-sunnow");
  const sunrise_m = f5_cvtHhmmToMinutes(g_sunData.sunrise); //get sunrise t-minutes
  const sunset_m = f5_cvtHhmmToMinutes(g_sunData.sunset); //get sunset t-minutes
  let sunriseXY = f8_calcSunXY(sunrise_m);
  let sunsetXY = f8_calcSunXY(sunset_m);
  let nowXY = f8_calcSunXY(now_m);
  // console.log("hor:", x, y);
  hor.setAttribute("y1", sunriseXY.y);
  hor.setAttribute("y2", sunriseXY.y);
  sky.setAttribute("height", sunriseXY.y);
  gnd.setAttribute("y", sunriseXY.y);
  gnd.setAttribute("height", 200 - sunriseXY.y);
  if (sunrise_m < now_m && now_m < sunset_m) {
    //change sky color, set to bright when between sunrise and sunset.
    sky.setAttribute("fill", "blue"); //is day time
  } else {
    sky.setAttribute("fill", "#1e2026"); //is night time
  }
  //Add sunset sunrise time to svg
  sunrise.textContent = g_sunData.sunrise;
  sunrise.setAttribute("x", sunriseXY.x);
  sunset.textContent = g_sunData.sunset;
  sunset.setAttribute("x", sunsetXY.x);
  //Add now time to svg
  sunnow.textContent = g_nowHHMMSS;
  sunnow.setAttribute("x", nowXY.x);
}
