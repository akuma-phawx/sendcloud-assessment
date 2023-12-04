// Import styles
import "../styles/main.scss";

// Define type for a single highway data point
interface HighwayData {
  kmh: number;
  kilometers: number;
}

// Define type for the range data
interface RangeData {
  temp: number;
  wheelsize: number;
  ac: string;
  hwy: HighwayData[];
}

// Define type for the vehicle model data array
type VehicleModelData = RangeData[];

// Store the loaded data
let data100D: VehicleModelData = [];
let dataP100D: VehicleModelData = [];

// Load data from JSON files
function loadData(): void {
  fetch("/data/metric-100D.json")
    .then((response) => response.json())
    .then((data: VehicleModelData) => {
      data100D = data;
    })
    .catch((error) => console.error("Error loading 100D data:", error));

  fetch("/data/metric-P100D.json")
    .then((response) => response.json())
    .then((data: VehicleModelData) => {
      dataP100D = data;
    })
    .catch((error) => console.error("Error loading P100D data:", error));
}

// Function to get the AC status
function getAcStatus(): string {
  const acToggle = document.getElementById("acToggle") as HTMLInputElement;
  return acToggle.checked ? "on" : "off";
}

// Function to find the range based on selected criteria
function findRange(
  data: VehicleModelData,
  temp: number,
  wheelSize: number,
  acStatus: string,
  speed: number
): number | undefined {
  const matchingData = data.find(
    (d) => d.temp === temp && d.wheelsize === wheelSize && d.ac === acStatus
  );
  return matchingData?.hwy.find((s) => s.kmh === speed)?.kilometers;
}

// Function to update the range display
function updateRangeDisplay(): void {
  const temperatureInput = document.getElementById(
    "temperature"
  ) as HTMLInputElement;
  const speedInput = document.getElementById("speed") as HTMLInputElement;
  const selectedWheelSize =
    document
      .querySelector(".wheel-size.selected")
      ?.textContent?.trim()
      .replace('"', "") || "19";

  const acStatus = getAcStatus();
  const temperature = parseInt(temperatureInput.value, 10);
  const wheelSize = parseInt(selectedWheelSize, 10);
  const speed = parseInt(speedInput.value, 10);

  // Calculate range for 100D
  const range100D = findRange(
    data100D,
    temperature,
    wheelSize,
    acStatus,
    speed
  );
  if (range100D !== undefined) {
    const rangeDisplay100D = document.getElementById("100d-kms") as HTMLElement;
    rangeDisplay100D.textContent = `${range100D}`;
  }

  // Calculate range for P100D
  const rangeP100D = findRange(
    dataP100D,
    temperature,
    wheelSize,
    acStatus,
    speed
  );
  if (rangeP100D !== undefined) {
    const rangeDisplayP100D = document.getElementById(
      "p100d-kms"
    ) as HTMLElement;
    rangeDisplayP100D.textContent = `${rangeP100D}`;
  }
}

// DOMContentLoaded event listener
document.addEventListener("DOMContentLoaded", () => {
  // Load data initially
  loadData();

  // Update the range display after a short delay to ensure data has loaded
  setTimeout(updateRangeDisplay, 1000); // Adjust this delay based on your fetch performance

  // Event listeners for speed and temperature controls
  const buttonUpSpeed = document.querySelector(
    ".button-up-speed"
  ) as HTMLButtonElement;
  const buttonDownSpeed = document.querySelector(
    ".button-down-speed"
  ) as HTMLButtonElement;
  const buttonUpTemperature = document.querySelector(
    ".button-up-temperature"
  ) as HTMLButtonElement;
  const buttonDownTemperature = document.querySelector(
    ".button-down-temperature"
  ) as HTMLButtonElement;
  const wheels = document.querySelectorAll(".wheel-size");
  const acToggle = document.getElementById("acToggle") as HTMLInputElement;

  // Add event listeners to all control buttons
  buttonUpSpeed.addEventListener("click", () => {
    updateSpeed(10);
    updateRangeDisplay();
  });
  buttonDownSpeed.addEventListener("click", () => {
    updateSpeed(-10);
    updateRangeDisplay();
  });
  buttonUpTemperature.addEventListener("click", () => {
    updateTemperature(10);
    updateRangeDisplay();
  });
  buttonDownTemperature.addEventListener("click", () => {
    updateTemperature(-10);
    updateRangeDisplay();
  });
  // Event listener for AC toggle
  acToggle.addEventListener("change", () => {
    updateRangeDisplay(); // Call updateRangeDisplay when AC state changes
  });
  // Add click event listeners to wheel size buttons
  wheels.forEach((wheel) => {
    wheel.addEventListener("click", function (this: HTMLElement) {
      // Remove 'selected' class from all wheels
      wheels.forEach((w) => w.classList.remove("selected"));
      // Add 'selected' class to the clicked wheel
      this.classList.add("selected");
      updateRangeDisplay();
    });
  });

  // Update Speed Function
  function updateSpeed(change: number): void {
    const speedInput = document.getElementById("speed") as HTMLInputElement;
    let currentSpeed = parseInt(speedInput.value, 10);
    let newSpeed = currentSpeed + change;
    newSpeed = Math.max(70, newSpeed); // Minimum speed
    newSpeed = Math.min(140, newSpeed); // Maximum speed
    speedInput.value = newSpeed.toString();
  }

  // Update Temperature Function
  function updateTemperature(change: number): void {
    const temperatureInput = document.getElementById(
      "temperature"
    ) as HTMLInputElement;
    let currentTemperature = parseInt(temperatureInput.value, 10);
    let newTemperature = currentTemperature + change;
    newTemperature = Math.max(-10, newTemperature); // Minimum temperature
    newTemperature = Math.min(40, newTemperature); // Maximum temperature
    temperatureInput.value = newTemperature.toString();
  }
});
