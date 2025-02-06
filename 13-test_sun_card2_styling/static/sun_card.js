document.addEventListener("DOMContentLoaded", function () {
  f1_fetchSunData();
  f5_addGridLines();
  // Fetch sun data every 30 seconds
  setInterval(f4_updateSunXY, 5000); // 30,000 milliseconds = 30 seconds
});

let g_sunData = {}; // Global variable
let g_noonShift = 0; // noon shift in minutes, if solar_noon=11:30, noon_shift=-30

function f1_fetchSunData() {
  fetch("/sun-data")
    .then((response) => response.json())
    .then((data) => {
      g_sunData = data; // Store data globally
      f3_calcNoonShift(g_sunData.solar_noon);
      f2_generateSunPath(); // Draw the trajectory
      f6_adjustHorizon();
      f4_updateSunXY();
    });
}

// Function to map time to an (x, y) coordinate on the SVG
function calcSunXY(minutes) {
  let T = 24 * 60; // Full period (1440 minutes)
  let N = g_noonShift; // Phase shift
  let A = 50; // Amplitude (height of the curve)
  let C = 100; // Offset (baseline height)

  let x = (minutes / T) * 500; // Scale 1440 minutes to 500 pixels
  let y = A * Math.cos((2 * Math.PI * minutes) / T - (2 * Math.PI * N) / T) + C;

  return { x, y };
}

// Update the sun's position on the SVG
function f4_updateSunXY() {
  let sun = document.getElementById("svg-sun");

  // Get current time in "HH:MM" format
  let now = new Date();
  console.log("updateing at ", now);
  let hhmm = now.toTimeString().slice(0, 5); // "HH:MM"
  let nowMinutes = f4_cvt_HHMM_Minutes(hhmm);

  let { x, y } = calcSunXY(nowMinutes);

  // Update sun's position on the SVG
  sun.setAttribute("cx", x);
  sun.setAttribute("cy", y);
}

function f4_cvt_HHMM_Minutes(HHMM_str) {
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
  const m = f4_cvt_HHMM_Minutes(solar_noon);
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
    let { x, y } = calcSunXY(t);
    d += `${x},${y} `;
  }

  path.setAttribute("d", d);
}

// Add vertical reference lines at x = 0, 1/4T, 1/2T, 3/4T, 1T
function f5_addGridLines() {
  let svg = document.querySelector("svg");
  let T = 24 * 60; // Full period (1440 minutes)
  let svgWidth = 500; // SVG width in pixels
  let positions = [0, 1 / 4, 1 / 2, 3 / 4, 1].map((p) => p * svgWidth);

  positions.forEach((x) => {
    let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x);
    line.setAttribute("y1", 0);
    line.setAttribute("x2", x);
    line.setAttribute("y2", 200);
    line.setAttribute("stroke", "#414144");
    line.setAttribute("stroke-width", "1");
    svg.appendChild(line);
  });
}

function f6_adjustHorizon() {
  let hor = document.getElementById("svg-hline");
  let sky = document.getElementById("svg-sky");
  let gnd = document.getElementById("svg-gnd");
  const minutes = f4_cvt_HHMM_Minutes(g_sunData.sunrise);
  let { x, y } = calcSunXY(minutes);
  // console.log("hor:", x, y);
  hor.setAttribute("y1", y);
  hor.setAttribute("y2", y);
  sky.setAttribute("height", y);
  gnd.setAttribute("y", y);
  gnd.setAttribute("height", 200 - y);
}
