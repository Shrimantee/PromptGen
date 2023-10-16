let table;
let words = [];
let numRows = 4; // Number of rows of text
let speeds = [];
let x = [];
let y = [];
let wordIndices = [];
let isFullScreen = false;
let directions = [];
let cursorVisible = [];
let textSizes = [];

function preload() {
  table = loadTable('Words.csv', 'csv', 'header');
}

function setup() {
  createCanvas(windowWidth, windowHeight); // Use window dimensions
  frameRate(30);

  // Load words from the CSV file
  for (let row of table.rows) {
    words.push(row.get('Word'));
  }

  // Initialize the positions, speeds, directions, text sizes, and cursor visibility for each row randomly
  for (let i = 0; i < numRows; i++) {
    x.push(random(width)); // Random x position within the canvas width
    y.push((i + 1) * (height / (numRows + 1))); // Evenly spaced vertically

    // Randomly select an index for words to display in each row
    wordIndices.push(floor(random(words.length)));

    // Randomly select the direction (left to right or right to left)
    directions.push(random(1) > 0.5 ? 1 : -1);

    // Randomize the speed (positive for left to right, negative for right to left)
    speeds.push(random(4, 8) * directions[i]);

    // Initialize cursor visibility to true (visible)
    cursorVisible.push(true);

    // Randomize text sizes
    textSizes.push(floor(random(52, 92)));
  }
}

function draw() {
  background(0); // Set background color to black
  fill(255); // Set text color to white
  textStyle(BOLD);
  textFont("Courier New");
  for (let i = 0; i < numRows; i++) {
    // Display the current word in each row with randomized text size
    let currentWord = words[wordIndices[i]];
    textSize(textSizes[i]);
    text(currentWord, x[i], y[i]);

    // Move the word in the current direction
    x[i] += speeds[i];

    // Check if the word is off-screen in the current direction
    if ((speeds[i] > 0 && x[i] > width) || (speeds[i] < 0 && x[i] < -textWidth(currentWord))) {
      // Reset the x position to the opposite side
      x[i] = (speeds[i] > 0) ? -textWidth(currentWord) : width;

      // Randomly select a new word index for the row
      wordIndices[i] = floor(random(words.length));

      // Randomize the direction and speed for the next cycle
      directions[i] = random(1) > 0.5 ? 1 : -1;
      speeds[i] = random(4, 8) * directions[i];

      // Randomize text size for the next cycle
      textSizes[i] = floor(random(52, 72));
    }

    // Display the cursor (blinking)
    if (frameCount % 30 < 15) { // Blink every 15 frames (adjust as needed)
      if (cursorVisible[i]) {
        // Set the cursor fill color to white
        fill(255);

        // Calculate the cursor position at the end of the word
        let cursorX = x[i] + textWidth(currentWord);
        let cursorY = y[i] + textSizes[i] / 2 ; // Adjust cursor position as needed
        text("_", cursorX, y[i]);
      }
    } else {
      cursorVisible[i] = true;
    }
  }
}

function keyPressed() {
  if (key === 'F' || key === 'f') {
    if (isFullScreen) {
      fullscreen(false);
    } else {
      fullscreen(true);
    }
    isFullScreen = !isFullScreen;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
