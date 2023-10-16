let table;
let data = [];
let numRows = 3; // Number of rows of text
let textObjects = [];
let isFullScreen = false;
let maxTextX = 0;
let displayTimer = 0;
let displayInterval = 200; // Time (in frames) to display each set of data
let typingSpeed = 3; // Typing speed (1 character per frame)
let gridSize = 15; // Size of the grid squares including the gap
let textWrapWidth = 800; // Maximum width for wrapping text
let availableIndices = []; // Array to store available data indices
let wordCount = 0;
let alpha = 255;
function preload() {
  table = loadTable('DictionaryDefinitions.csv', 'csv');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(30);

  // Read all rows from the CSV file
  for (let row of table.rows) {
    let wordDefinition = row.arr; // Split row into an array
    let word = wordDefinition[0].trim();
    let definitions = wordDefinition.slice(1).map(d => d.trim()).join('\n'); // Join columns with a new line

    data.push({ word: word, definitions: definitions });
  }

  // Create an array of shuffled indices
  availableIndices = shuffleArray(data.length);

  // Calculate the vertical spacing between rows
  let verticalSpacing = windowHeight / (numRows + 1);

  for (let i = 0; i < numRows; i++) {
    let randomIndex = getAvailableIndex();
    let xPos = width * 0.1;
    let yPos = (i + 1) * verticalSpacing; // Start from the top of the screen
    textObjects.push({ x: xPos, y: yPos, dataIdx: randomIndex, lineIndex: 0, typedText: '' });
  }
}

function getAvailableIndex() {
  if (availableIndices.length === 0) {
    // If all indices are used, shuffle and reset
    availableIndices = shuffleArray(data.length);
  }
  return availableIndices.pop();
}

function shuffleArray(length) {
  // Create an array of indices and shuffle them
  let indices = [];
  for (let i = 0; i < length; i++) {
    indices.push(i);
  }
  return shuffle(indices);
}

function draw() {
  // Create a pixel-like background
  background(0);
  stroke(50); // Color of grid lines

  for (let x = 0; x < width; x += gridSize) {
    for (let y = 0; y < height; y += gridSize) {
      noStroke();
      // Draw rounded rectangles with a gap
      fill(0, 100, 160, random(30, 40));
      let rectSize = gridSize - 2; // Adjust the gap as needed
      rect(x + 1, y + 1, rectSize, rectSize, 5); // Adding 1 to create a gap
    }
  }
  textWrapWidth = width;

  for (let i = 0; i < textObjects.length; i++) {
    let obj = textObjects[i];
    let word = data[obj.dataIdx].word;
    let definitions = data[obj.dataIdx].definitions;

    if (obj.typedText.length < word.length) {
      // Type the word letter by letter
      obj.typedText += word[obj.typedText.length];
    }

    let typedWord = obj.typedText;
    textSize(15);
    fill(0, 200, 255); // Techy blue color
    textStyle(BOLD);
    textFont("Consolas");
    let textToDisplay = `${typedWord}`; // Separate columns by a new line
    text(textToDisplay, obj.x, obj.y);

    let typedDefinitions = definitions.substring(0, obj.lineIndex * typingSpeed);

    textToDisplay = `\n${typedDefinitions}`; // Separate columns by a new line
    textToDisplay = wrapText(textToDisplay, textWrapWidth);

    textSize(10);
    fill(150, 150, 155,alpha); // Techy blue color
    //textStyle(BOLD);
    textFont("Consolas");

    text(textToDisplay, obj.x, obj.y);

    // Calculate the width of the combined word and definition
    let textWidthCombined = textWidth(textToDisplay);

    // Update the maximum x-position
    maxTextX = max(maxTextX, obj.x);

    // Move to the next line of definitions
    if (obj.y < height && obj.lineIndex < definitions.length / typingSpeed) {
      obj.lineIndex++;
    }
  }

  // Increment the display timer
  displayTimer++;

  // Check if it's time to display the next set of data
  if (displayTimer >= displayInterval) {
    displayTimer = 0; // Reset the timer
    wordCount+= 1;

    console.log(wordCount);
    if(wordCount % 5 == 0){
      resetTextObjects(1); // Reset the text objects to display a new set of data
      alpha = 150;
    } else{
      resetTextObjects(0); // Reset the text objects to display a new set of data
      alpha = 255;
    }
  }
  
}

function resetTextObjects(doRandom) {
 
    console.log(textObjects.length)
    if(doRandom){
      textObjects = [];
      for (let i = 0; i < 200; i++) {
        let randomIndex = getAvailableIndex();
        let xPos = random(-width, width); // Random x-position within a range
        let yPos = random(0, height); // Random y-position within a range
        textObjects.push({ x: xPos, y: yPos, dataIdx: randomIndex, lineIndex: 0, typedText: '' });
      // textObjects[i].x = random(0, width);
      // textObjects[i].y = random(0, height); // Start from the top
      }
    }
    else{
      textObjects =[]

      for (let i = 0; i < 3; i++) {
        
      // textObjects[i].dataIdx = getAvailableIndex(); // Get a new available index
      // textObjects[i].lineIndex = 0; // Reset to the first line of definitions
      // let typedText = '';
      let xPos = width*0.1;
      let yPos = (i + 1) * (height / (numRows + 1)); // Start from the top
      textObjects.push({ x: xPos, y: yPos, dataIdx: getAvailableIndex(), lineIndex: 0, typedText: '' });

    }
  }
}

function wrapText(text, maxWidth) {
  let words = text.split(' ');
  let lines = [];
  let currentLine = '';

  for (let word of words) {
    let testLine = currentLine === '' ? word : `${currentLine} ${word}`;
    let testWidth = textWidth(testLine);

    if (testWidth <= maxWidth) {
      currentLine = testLine;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }

  if (currentLine !== '') {
    lines.push(currentLine);
  }

  return lines.join('\n');
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