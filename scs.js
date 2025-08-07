import { Stopwatch } from "./Stopwatch.js";
import { ScrambleGenerator } from "./scrambleGenerator.js";

const StopwatchDisplay = document.getElementById("Stopwatch");

const Circle1 = document.getElementById("Circle1");
const Circle2 = document.getElementById("Circle2");
const Title = document.getElementById("NxN");
const AO5 = document.getElementById("AO5");
const AO12 = document.getElementById("AO12");

const StopwatchInstance = new Stopwatch({
  DisplayElement: StopwatchDisplay,
  CircleElements: [Circle1, Circle2]
});

const Times = 
[
  "Time1",
  "Time2",
  "Time3",
  "Time4",
  "Time5",
  "Time6",
  "Time7",
  "Time8",
  "Time9",
  "Time10",
  "Time11",
  "Time12"
]

const PossibleMoves3x3 = ["R", "R'", "R2", "L", "L'", "L2", "U", "U'", "U2", "D", "D'", "D2", "F", "F'", "F2", "B", "B'", "B2", "M", "M'", "M2", "E", "E'", "E2", "S", "S'", "S2"];
const PossibleMoves2x2 = ["R", "R'", "R2", "L", "L'", "L2", "U", "U'", "U2", "D", "D'", "D2", "F", "F'", "F2", "B", "B'", "B2"];
const ScrambleGen = (Title.textContent === "3x3") 
  ? new ScrambleGenerator(PossibleMoves3x3) 
  : (Title.textContent === "2x2") 
    ? new ScrambleGenerator(PossibleMoves2x2) 
    : new ScrambleGenerator([]);

const ScrambleBtn = document.getElementById("ScrambleBtn");
const Result = document.getElementById("Result");

ScrambleBtn.addEventListener("click", () => {
  const scramble = ScrambleGen.generateScramble();
  Result.textContent = scramble;
});

document.getElementById("ResetBtn").addEventListener("click", () => StopwatchInstance.Reset());
document.getElementById("StartBtn").addEventListener("click", () => StopwatchInstance.Start());
document.getElementById("StopBtn").addEventListener("click", () => StopwatchInstance.Stop());

// Helper to convert "MM:SS:CS" to milliseconds
const timeToMs = (timeStr) => {
  const parts = timeStr.split(':'); // MM:SS:CS
  if (parts.length !== 3) return 0;
  const mins = parseInt(parts[0], 10);
  const secs = parseInt(parts[1], 10);
  const cs = parseInt(parts[2], 10);
  return (mins * 60 * 1000) + (secs * 1000) + (cs * 10);
};

// Helper to convert ms back to "MM:SS:CS"
const msToTime = (ms) => {
  const minutes = Math.floor(ms / 60000);
  ms %= 60000;
  const seconds = Math.floor(ms / 1000);
  ms = Math.floor(ms % 1000 / 10);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${ms.toString().padStart(2, '0')}`;
};

// Calculate Average of middle times (drop fastest and slowest)
const calculateAO = (timesArray) => {
  const msTimes = timesArray.map(timeToMs).sort((a, b) => a - b);
  if (msTimes.length <= 2) return "00:00:00";
  const middleTimes = msTimes.slice(1, msTimes.length - 1);
  const sum = middleTimes.reduce((a, b) => a + b, 0);
  const avg = Math.round(sum / middleTimes.length);
  return msToTime(avg);
};

// New helper: update colors of time elements
function updateTimesColor() {
  for (const id of Times) {
    const elem = document.getElementById(id);
    if (elem.textContent === "00:00:00") {
      elem.style.color = "transparent";  // transparent for zero times
    } else {
      elem.style.color = "black";        // black for valid times
    }
  }
}

StopwatchInstance.onStop = (finalTime) => {
  for (let i = 0; i < Times.length; i++) {
    const Time = Times[i];
    const TimeElem = document.getElementById(Time);
    if (TimeElem.textContent === "00:00:00") {
      TimeElem.textContent = finalTime;
      break;
    }
  }

  const firstFiveTimes = Times.slice(0, 5).map(id => document.getElementById(id).textContent);
  if (firstFiveTimes.every(t => t !== "00:00:00")) {
    AO5.textContent = calculateAO(firstFiveTimes);
  } else {
    AO5.textContent = "ao5"; // reset text if not full
  }

  const allTimes = Times.map(id => document.getElementById(id).textContent);
  if (allTimes.every(t => t !== "00:00:00")) {
    AO12.textContent = calculateAO(allTimes);
  } else {
    AO12.textContent = "ao12"; // reset text if not full
  }

  updateTimesColor();  // update colors after change
};

document.getElementById("ResetRunBtn").onclick = function () {
  for (let i = 0; i < Times.length; i++) {
    const Time = Times[i];
    const TimeElem = document.getElementById(Time);
    TimeElem.textContent = "00:00:00";
  }
  AO5.textContent = "ao5";
  AO12.textContent = "ao12";

  updateTimesColor();  // update colors after reset
};

// Initialize colors on page load in case of default values
updateTimesColor();
