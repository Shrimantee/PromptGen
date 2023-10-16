let table;
let words = [];
let isFullScreen = false;
let cursorVisible = false;
let typedText = '';
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
}

function draw() {
  background(0); // Set background color to black
  textSize(42);
  fill(0, 255, 0); // Set text color to green
  textStyle(BOLD);
  textFont("Courier New");

  let currentWord = words[currentWordIndex];

  // Display the typed text with a blinking cursor
  text("Define: " + typedText, width / 2 - textWidth("Define: " + typedText) / 2, height / 2);

  // Add a blinking cursor
  if (frameCount % 30 < 15) { // Blink every 15 frames (adjust as needed)
    cursorVisible = true;
  } else {
    cursorVisible = false;
  }

  if (cursorVisible) {
    text("_", width / 2 + textWidth("Define: " + typedText) / 2, height / 2);
  }

  // Type the word letter by letter at a slower speed
  if (typedText.length < currentWord.length && frameCount % typingSpeed === 0) {
    typedText += currentWord[typedText.length];
  }

  // Check if it's time to display the next word
  if (typedText.length >= currentWord.length) {
    displayTimer++;

    // Check if it's time to display the next set of words
    if (displayTimer >= timeToDisplay) {
      // Reset the timer and clear the typed text
      displayTimer = 0;
      typedText = '';

      // Increment the word index
      currentWordIndex = (currentWordIndex + 1) % words.length;
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
  resizeCanvas(windowWidth, windowHeight); // Adjust the canvas size based on the window dimensions
}
