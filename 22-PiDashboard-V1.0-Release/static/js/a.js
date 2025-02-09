document.addEventListener("DOMContentLoaded", function () {
  setInterval(f7_updatePeriodically, 1000); //in ms
});

let g_cnt = 0;

function f7_updatePeriodically() {
  let [nowHHMM, nowHHMMSS] = f53_getNowHHMMWithTimezone(g_sunData.timezone);
  let now_m = f50_cvtHhmmToMinutes(nowHHMM);
  let noonShift_m = f52_calcNoonShift(g_sunData.solar_noon);

  if (g_cnt == 0) {
    f11_updateDateHead(g_sunData.timezone);
    f02_updateSunPathCurve(noonShift_m); // Draw the trajectory
    f03_adjustHorizonSky_TimeAxis(now_m, noonShift_m, g_sunData.sunrise, g_sunData.sunset);
  }
  g_cnt++;
  if (g_cnt >= 60) {
    g_cnt = 0;
  }

  f01_updateSunXYandClock(now_m, noonShift_m, nowHHMMSS);
}

// f50+ functions ########################################################################

function f50_cvtHhmmToMinutes(HHMM_str) {
  if (typeof HHMM_str !== "string" || !HHMM_str.includes(":")) {
    console.error("Invalid input:", HHMM_str);
    return 0;
  }
  const [hours, minutes] = HHMM_str.split(":").map(Number); // Split the input string into hours and minutes
  // Convert input time to total minutes
  const totalMinutes = hours * 60 + minutes;
  return totalMinutes;
}
// Function to map minute(0~1440) to an (x, y) coordinate on the SVG
function f51_calcSunXY(minutes, noonshift_m) {
  let T = 24 * 60; // Full period (1440 minutes)
  let N = noonshift_m; // Phase shift
  let A = 50; // Amplitude (height of the curve)
  let C = 100; // Offset (baseline height)

  let x = (minutes / T) * 500; // Scale 1440 minutes to 500 pixels
  let y = A * Math.cos((2 * Math.PI * (minutes - N)) / T) + C;

  return { x, y };
}
//if solar_noon is 12:30, then Phase shift is 30 (in minutes), if 11:30, then -30
function f52_calcNoonShift(solar_noon /* HH:MM */) {
  const m = f50_cvtHhmmToMinutes(solar_noon);
  const noonMinutes = 12 * 60;
  const noonshift = m - noonMinutes;
  return noonshift;
}

function f53_getNowHHMMWithTimezone(timezoneOffset) {
  let now = new Date();
  let localTime = new Date(now.getTime() + timezoneOffset * 1000);
  let hours = localTime.getUTCHours().toString().padStart(2, "0");
  let minutes = localTime.getUTCMinutes().toString().padStart(2, "0");
  let seconds = localTime.getUTCSeconds().toString().padStart(2, "0");
  let nowHHMMSS = `${hours}:${minutes}:${seconds}`;
  let nowHHMM = `${hours}:${minutes}`;
  return [nowHHMM, nowHHMMSS];
}

// updating functions ########################################################################

// Update the sun's position on the SVG
function f01_updateSunXYandClock(now_m, noonshift_m, nowHHMMSS) {
  // Update sun's position on the SVG
  let sun = document.getElementById("svg-sun");
  let { x, y } = f51_calcSunXY(now_m, noonshift_m);
  sun.setAttribute("cx", x);
  sun.setAttribute("cy", y);
  //update the moving clock.
  let sunnow = document.getElementById("svg-sunnow");
  sunnow.textContent = nowHHMMSS;
  sunnow.setAttribute("x", Math.min(x, 380)); //no more than 380 to the right, make sure text is not cut-off.
}

// Generate the sine wave trajectory and update the SVG path
function f02_updateSunPathCurve(noonshift_m) {
  let T = 24 * 60; // Full period (1440 minutes)
  let path = document.getElementById("sun-path");
  let d = "M ";

  for (let t = 0; t <= T; t += 10) {
    let { x, y } = f51_calcSunXY(t, noonshift_m);
    d += `${x},${y} `;
  }
  path.setAttribute("d", d);
}

function f03_adjustHorizonSky_TimeAxis(now_m, noonshift_m, sunriseHHMM, sunsetHHMM) {
  let hor = document.getElementById("svg-hline");
  let sky = document.getElementById("svg-sky");
  let gnd = document.getElementById("svg-gnd");
  let sunrise = document.getElementById("svg-sunrise");
  let sunset = document.getElementById("svg-sunset");
  const sunrise_m = f50_cvtHhmmToMinutes(sunriseHHMM); //get sunrise t-minutes
  const sunset_m = f50_cvtHhmmToMinutes(sunsetHHMM); //get sunset t-minutes
  let sunriseXY = f51_calcSunXY(sunrise_m, noonshift_m);
  let sunsetXY = f51_calcSunXY(sunset_m, noonshift_m);
  let horizonY = sunriseXY.y;

  //console.log("## hor:", sunriseXY.y);
  hor.setAttribute("y1", sunriseXY.y);
  hor.setAttribute("y2", sunriseXY.y);
  sky.setAttribute("height", sunriseXY.y);
  gnd.setAttribute("y", sunriseXY.y);
  gnd.setAttribute("height", 200 - sunriseXY.y);
  if (sunrise_m < now_m && now_m < sunset_m) {
    //change sky color, set to bright when between sunrise and sunset.
    sky.setAttribute("fill", "blue"); //is day time
  } else {
    sky.setAttribute("fill", "navy"); //is night time
  }
  //Add sunset sunrise time to svg
  sunrise.textContent = sunriseHHMM;
  sunrise.setAttribute("x", sunriseXY.x);
  sunset.textContent = sunsetHHMM;
  sunset.setAttribute("x", sunsetXY.x);

  //update time axis
  let minor = document.getElementById("svg-minorline");
  let major = document.getElementById("svg-majorline");
  minor.setAttribute("y1", horizonY + 1);
  minor.setAttribute("y2", horizonY + 6);
  major.setAttribute("y1", horizonY + 1);
  major.setAttribute("y2", horizonY + 6);

  document.querySelectorAll(".hour-text").forEach((text) => {
    text.setAttribute("y", horizonY + 13);
  });
}

function f11_updateDateHead(timezoneOffset) {
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
