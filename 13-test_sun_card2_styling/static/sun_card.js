document.addEventListener("DOMContentLoaded", function () {
  fetchSunData();
});

function fetchSunData() {
  fetch("/sun-data")
    .then((response) => response.json())
    .then((data) => {
      updateSunPosition(data.current_time, data.sunrise, data.sunset);
    });
}

function updateSunPosition(now, sunrise, sunset) {
  let sun = document.getElementById("sun");
  let sunPath = document.getElementById("sun-path");

  let nowTime = new Date(`2025-02-05T${now}`);
  let sunriseTime = new Date(`2025-02-05T${sunrise}`);
  let sunsetTime = new Date(`2025-02-05T${sunset}`);

  let T = 24 * 60; // Full period (1440 minutes)
  let N = 30; // Phase shift (6 hours)
  let A = 50; // Amplitude (height of the curve)
  let C = 100; // Offset (baseline height)

  let nowMinutes = nowTime.getHours() * 60 + nowTime.getMinutes();

  // Calculate x position (mapping time to SVG width)
  let x = (nowMinutes / T) * 500; // Scale 1440 minutes to 500 pixels

  // Calculate y position using the sine wave formula
  let y =
    A * Math.cos((2 * Math.PI * nowMinutes) / T - (2 * Math.PI * N) / T) + C;

  // Update sun's position on the SVG
  sun.setAttribute("cx", x);
  sun.setAttribute("cy", y);
}
