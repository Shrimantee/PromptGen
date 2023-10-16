let table;
let data = [];
let numRows = 4; // Number of rows of text
let textObjects = [];
let isFullScreen = false;
let maxTextX = 0;
let scrollingSpeed = 4; // Adjust the scrolling speed as needed
let gridSize = 15; // Size of the grid squares including the gap
let displayTimer = 0;
let displayInterval = 300; // Time (in frames) to display each set of data

function preload() {
  table = loadTable('definitions.csv', 'csv');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(30);

  // Read all rows from the CSV file
  for (let row of table.rows) {
    let wordDefinition = row.arr; // Split row into an array
    let word = wordDefinition[0].trim();
    let definitions = wordDefinition.slice(1); // Get all columns except the first (word)

    data.push({ word: word, definitions: definitions });
  }

  // Calculate the vertical spacing between rows
  let verticalSpacing = windowHeight / (numRows + 1);

  for (let i = 0; i < numRows; i++) {
    let randomIndex = floor(random(data.length));
    let xPos = width;
    let yPos = (i + 1) * verticalSpacing; // Uniform distribution along the height

    textObjects.push({ x: xPos, y: yPos, dataIdx: randomIndex, lineIndex: 0 });
  }
}

function draw() {
  // Create a pixel-like background
  background(0);
  stroke(50); // Color of grid lines

  for (let x = 0; x < width; x += gridSize) {
    for (let y = 0; y < height; y += gridSize) {
      noStroke();
      // Draw rounded rectangles with a gap
      fill(0, 100, 160, random(20, 40));
      let rectSize = gridSize - 2; // Adjust the gap as needed
      rect(x + 1, y + 1, rectSize, rectSize, 5); // Adding 1 to create a gap
    }
  }

  textSize(24);
  fill(0, 200, 255); // Techy blue color
  textStyle(BOLD);
  textFont("Consolas"); // A monospace font for a techy look

  for (let i = 0; i < textObjects.length; i++) {
    let obj = textObjects[i];
    let word = data[obj.dataIdx].word;
    let definitions = data[obj.dataIdx].definitions;

    let textToDisplay = `${word} - ${definitions[obj.lineIndex]}`;

    text(textToDisplay, obj.x, obj.y);

    // Calculate the width of the combined word and definition
    let textWidthCombined = textWidth(textToDisplay);

    // Update the maximum x-position
    maxTextX = max(maxTextX, obj.x + textWidthCombined);

    obj.x -= scrollingSpeed;

    // Check if the text is off-screen
    if (obj.x < -textWidthCombined) {
      obj.x = width; // Reset position off-screen
      obj.dataIdx = floor(random(data.length)); // Randomly select a new word
      obj.lineIndex = 0; // Reset to the first line of definitions
    }

    // Move to the next line of definitions
    if (obj.x < width - maxTextX + textWidth(word) && obj.lineIndex < definitions.length - 1) {
      obj.lineIndex++;
    }
  }

  // Increment the display timer
  displayTimer++;

  // Check if it's time to display the next set of data
  if (displayTimer >= displayInterval) {
    displayTimer = 0; // Reset the timer
    resetTextObjects(); // Reset the text objects to display a new set of data
  }

  // Check if all text has moved out of the screen
  if (maxTextX < 0) {
    maxTextX = 0;
    resetTextObjects();
  }
}

function resetTextObjects() {
  for (let i = 0; i < textObjects.length; i++) {
    textObjects[i].x = width;
    textObjects[i].dataIdx = floor(random(data.length)); // Randomly select a new word
    textObjects[i].lineIndex = 0; // Reset to the first line of definitions
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
