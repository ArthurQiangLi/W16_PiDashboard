document.addEventListener("DOMContentLoaded", function () {
  fetchSunData();
  generateSunPath(); // Draw the trajectory
  drawHorizonLine();
  addReferenceLines();
});

function fetchSunData() {
  fetch("/sun-data")
    .then((response) => response.json())
    .then((data) => {
      updateSunPosition(data.current_time, data.sunrise, data.sunset);
    });
}

// Function to map time to an (x, y) coordinate on the SVG
function getSunCoordinates(minutes) {
  let T = 24 * 60; // Full period (1440 minutes)
  let N = 30; // Phase shift (6 hours)
  let A = 50; // Amplitude (height of the curve)
  let C = 100; // Offset (baseline height)

  let x = (minutes / T) * 500; // Scale 1440 minutes to 500 pixels
  let y = A * Math.cos((2 * Math.PI * minutes) / T - (2 * Math.PI * N) / T) + C;

  return { x, y };
}

// Update the sun's position on the SVG
function updateSunPosition(now) {
  let sun = document.getElementById("sun");

  let nowTime = new Date(`2025-02-05T${now}`);
  let nowMinutes = nowTime.getHours() * 60 + nowTime.getMinutes();

  let { x, y } = getSunCoordinates(nowMinutes);

  // Update sun's position on the SVG
  sun.setAttribute("cx", x);
  sun.setAttribute("cy", y);
}

// Generate the sine wave trajectory and update the SVG path
function generateSunPath() {
  let T = 24 * 60; // Full period (1440 minutes)
  let path = document.getElementById("sun-path");
  let d = "M ";

  for (let t = 0; t <= T; t += 10) {
    let { x, y } = getSunCoordinates(t);
    d += `${x},${y} `;
  }

  path.setAttribute("d", d);
}

// function drawHorizonLine() {
//   let svg = document.querySelector("svg");
//   let horizonLine = document.createElementNS(
//     "http://www.w3.org/2000/svg",
//     "line"
//   );

//   horizonLine.setAttribute("x1", "0");
//   horizonLine.setAttribute("y1", "110");
//   horizonLine.setAttribute("x2", "500");
//   horizonLine.setAttribute("y2", "110"); // Full height of SVG
//   horizonLine.setAttribute("stroke", "blue");
//   horizonLine.setAttribute("stroke-width", "2");

//   svg.appendChild(horizonLine);
// }

// Draw the horizon line and fill colors above and below
function drawHorizonLine() {
  let svg = document.querySelector("svg");

  // Create background for sky (blue)
  let sky = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  sky.setAttribute("x", "0");
  sky.setAttribute("y", "0");
  sky.setAttribute("width", "500");
  sky.setAttribute("height", "100"); // Above horizon
  sky.setAttribute("fill", "blue");

  // Create background for ground (grey)
  let ground = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  ground.setAttribute("x", "0");
  ground.setAttribute("y", "100");
  ground.setAttribute("width", "500");
  ground.setAttribute("height", "100"); // Below horizon
  ground.setAttribute("fill", "grey");

  // Create the horizon line
  let horizonLine = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "line"
  );
  horizonLine.setAttribute("x1", "0");
  horizonLine.setAttribute("y1", "100");
  horizonLine.setAttribute("x2", "500");
  horizonLine.setAttribute("y2", "100");
  horizonLine.setAttribute("stroke", "black");
  horizonLine.setAttribute("stroke-width", "2");

  // Append elements to SVG (ensure correct order: sky → ground → horizon)
  svg.prepend(sky);
  svg.prepend(ground);
  svg.appendChild(horizonLine);
}

// Add vertical reference lines at x = 0, 1/4T, 1/2T, 3/4T, 1T
function addReferenceLines() {
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
    line.setAttribute("stroke", "red");
    line.setAttribute("stroke-width", "1");
    line.setAttribute("stroke-width", "1"); // Dashed lines for visibility
    svg.appendChild(line);
  });
}
