let table;
let words = [];
let numRows = 3; // Number of rows of text
let xPos = [];
let yPos = [];
let wordIndices = [];
let isFullScreen = false;
let cursorVisible = [];
let typedText = [];
let currentWordIndex = 0;
let typingSpeed = 5; // Change the typing speed (1 character per frame)
let timeToDisplay = 100; // Time (in frames) to display each word
let displayTimer = 0;

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

  // Initialize the positions, word indices, cursor visibility, and typed text
  for (let i = 0; i < numRows; i++) {
    xPos.push(random(width - textWidth(words[0]))); // Random x position within the canvas width
    yPos.push(random(height - textAscent() - textDescent())); // Random y position within the canvas height
    wordIndices.push(currentWordIndex);
    cursorVisible.push(false);
    typedText.push('');
    currentWordIndex = (currentWordIndex + 1) % words.length;
  }
}

function draw() {
  background(0); // Set background color to black
  textSize(42);
  fill(0, 255, 0); // Set text color to green
  textStyle(BOLD);
  textFont("Courier New");
  for (let i = 0; i < numRows; i++) {
    let currentX = xPos[i];
    let currentY = yPos[i];

    // Display the typed text with a blinking cursor
    let currentTypedText = typedText[i];
    text(currentTypedText, currentX, currentY);

    // Add a blinking cursor
    if (frameCount % 30 < 15) { // Blink every 15 frames (adjust as needed)
      cursorVisible[i] = true;
    } else {
      cursorVisible[i] = false;
    }

    if (cursorVisible[i]) {
      text("_", currentX + textWidth(currentTypedText), currentY);
    }

    // Type the word letter by letter at a slower speed
    if (currentTypedText.length < words[wordIndices[i]].length && frameCount % typingSpeed === 0) {
      typedText[i] += words[wordIndices[i]][currentTypedText.length];
    }

    // Check if it's time to display the next word
    if (currentTypedText.length >= words[wordIndices[i]].length) {
      displayTimer++;

      // Check if it's time to display the next set of words
      if (displayTimer >= timeToDisplay) {
        // Reset the timer and clear the typed text
        displayTimer = 0;
        typedText[i] = '';

        // Randomly select the next word index and position
        wordIndices[i] = currentWordIndex;
        currentWordIndex = (currentWordIndex + 1) % words.length;
        xPos[i] = random(width -100 - textWidth(words[0]));
        yPos[i] = random(height -100 - textAscent() - textDescent());
      }
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
  resizeCanvas(windowWidth - 100, windowHeight - 100); // Adjust the canvas size based on the window dimensions
}
