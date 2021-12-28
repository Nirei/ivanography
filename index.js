"use strict";

const ROW_LENGTH = 20;
const COL_LENGTH = 10;
const GRID_SIZE = ROW_LENGTH * COL_LENGTH;

const CHAR_LIMIT = Math.floor(GRID_SIZE * 0.6);

const LEGAL_CHARACTERS = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "Ñ",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

const LOW_CONTRAST = [
  { foreground: "#ffffff", background: "#ffffff" },
  { foreground: "#ffffff", background: "#ffffff" },
  { foreground: "#ffffff", background: "#ffffff" },
  // green - orange
  { foreground: "#93c47d", background: "#e69138" },
  { foreground: "#e69138", background: "#93c47d" },
  // green - yellow
  { foreground: "#93c47d", background: "#ffd966" },
  { foreground: "#ffd966", background: "#93c47d" },
  // purple - blue
  { foreground: "#674ea7", background: "#3c78d8" },
  { foreground: "#3c78d8", background: "#674ea7" },
  // light purple - blue
  { foreground: "#6fa8dc", background: "#8e7cc3" },
  { foreground: "#8e7cc3", background: "#6fa8dc" },
  // light green - light orange
  { foreground: "#b6d7a8", background: "#f6b26b" },
  { foreground: "#f6b26b", background: "#b6d7a8" },
  // light blue - pink
  { foreground: "#c9daf8", background: "#ead1dc" },
  { foreground: "#ead1dc", background: "#c9daf8" },
];

const HIGH_CONTRAST = [
  // light orange - light purple
  { foreground: "#ffd966", background: "#8e7cc3" },
  { foreground: "#8e7cc3", background: "#ffd966" },
  // light blue - yellow
  { foreground: "#6fa8dc", background: "#ffd966" },
  { foreground: "#ffd966", background: "#6fa8dc" },
  // blue - pink
  { foreground: "#6fa8dc", background: "#ead1dc" },
  { foreground: "#ead1dc", background: "#6fa8dc" },
  // light green - purple
  { foreground: "#b6d7a8", background: "#8e7cc3" },
  { foreground: "#8e7cc3", background: "#b6d7a8" },
];

Array.prototype.shuffle = function () {
  for (let index = this.length - 1; index > 0; index -= 1) {
    const other = Math.floor(Math.random() * (index + 1));
    const temp = this[index];
    this[index] = this[other];
    this[other] = temp;
  }
};

function choice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function slot(character, colors) {
  return {
    character,
    colors,
  };
}

function* loadedChoice(array, load) {
  let buffer = [];

  while (true) {
    if (!buffer.length || Math.random() >= load) {
      buffer = array.filter(() => true); // God forgive me
      buffer.shuffle();
    }

    yield buffer.pop();
  }
}

function generateRandomSlotBuffer() {
  const array = [];

  const colorGenerator = loadedChoice(LOW_CONTRAST, 1);

  for (let i = 0; i < GRID_SIZE; i += 1) {
    array.push(slot(choice(LEGAL_CHARACTERS), colorGenerator.next().value));
  }

  return array;
}

function setCell(y, x, slot) {
  const td = document.getElementById("grid-body").children[y].children[x];
  td.style.color = slot.colors.foreground;
  td.style.backgroundColor = slot.colors.background;
  td.textContent = slot.character;
}

function cleanUp(input) {
  const noDiacritcs = input
    .replace(/á/g, "a")
    .replace(/é/g, "e")
    .replace(/í/g, "i")
    .replace(/ó/g, "o")
    .replace(/ú/g, "u")
    .replace(/ü/g, "u");

  const noPunctuation = noDiacritcs.replace(/[^a-zA-ZñÑ]/g, "");
  return noPunctuation.toUpperCase();
}

function updateCharLimit(current) {
  const charLimitIndicator = document.getElementById("char-limit");
  charLimitIndicator.innerText = `${current} / ${CHAR_LIMIT}`;
}

function handleInput(value) {
  const message = cleanUp(value).split("");

  updateCharLimit(message.length);

  const slotBuffer = generateRandomSlotBuffer();

  for (let i = 0; i < message.length; i += 1) {
    const chunk = Math.floor(GRID_SIZE / message.length);
    const index = i * chunk + Math.floor(Math.random() * chunk);
    slotBuffer[index] = slot(message[i], choice(HIGH_CONTRAST));
  }

  // Draw each slot on its corresponding cell
  slotBuffer.forEach((slot, index) => {
    const y = Math.floor(index / ROW_LENGTH);
    const x = index % ROW_LENGTH;

    setCell(y, x, slot);
  });
}

window.onload = () =>
  handleInput(document.getElementById("message-input").value);
