const inputs = document.querySelector(".inputs"),
hintTag = document.querySelector(".hint span"),
guessLeft = document.querySelector(".guess-left span"),
wrongLetter = document.querySelector(".wrong-letter span"),
scoreDisplay = document.querySelector(".score span"),
highScoreDisplay = document.getElementById("high-score"), // Added high score display
resetBtn = document.querySelector(".reset-btn"),
typingInput = document.querySelector(".typing-input");

let word,
  maxGuesses,
  incorrectLetters = [],
  correctLetters = [],
  score = 0;

// Load high score from local storage if available
let highScore = localStorage.getItem("highScore") || 0;
highScoreDisplay.innerText = highScore;

function randomWord() {
  let ranItem = wordList[Math.floor(Math.random() * wordList.length)];
  word = ranItem.word;
  maxGuesses = word.length >= 5 ? 10 : 8;
  correctLetters = [];
  incorrectLetters = [];
  hintTag.innerText = ranItem.hint;
  guessLeft.innerText = maxGuesses;
  wrongLetter.innerText = incorrectLetters;
  scoreDisplay.innerText = score;
  let html = "";
  for (let i = 0; i < word.length; i++) {
    html += `<input type="text" disabled>`;
    inputs.innerHTML = html;
  }
}

randomWord();

function initGame(e) {
  let key = e.target.value.toLowerCase();
  if (
    key.match(/^[A-Za-z]+$/) &&
    !incorrectLetters.includes(` ${key}`) &&
    !correctLetters.includes(key)
  ) {
    if (word.includes(key)) {
      for (let i = 0; i < word.length; i++) {
        if (word[i] == key) {
          correctLetters += key;
          inputs.querySelectorAll("input")[i].value = key;
          score += 1;
        }
      }
    } else {
      maxGuesses--;
      incorrectLetters.push(` ${key}`);
      score -= 1;
    }
    guessLeft.innerText = maxGuesses;
    wrongLetter.innerText = incorrectLetters;
    scoreDisplay.innerText = score;
  }
  typingInput.value = "";
  setTimeout(() => {
    if (correctLetters.length === word.length) {
      alert(`Congrats! You found the word ${word.toUpperCase()}`);
      if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore); // Update high score in local storage
        highScoreDisplay.innerText = highScore; // Update high score display
      }
      return randomWord();
    } else if (maxGuesses < 1) {
      alert("Game over! You don't have remaining guesses");
      for (let i = 0; i < word.length; i++) {
        inputs.querySelectorAll("input")[i].value = word[i];
      }
    }
  }, 100);
}

resetBtn.addEventListener("click", randomWord);
typingInput.addEventListener("input", initGame);
inputs.addEventListener("click", () => typingInput.focus());
document.addEventListener("keydown", () => typingInput.focus());

//Upload a text file with your own vocabulary words (format "word, hint" with an enter between lines)
const fileInput = document.getElementById('file-input');

fileInput.addEventListener('change', handleFileSelect);

function handleFileSelect(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        const contents = event.target.result;
        const lines = contents.split('\n');

        // Assuming each line contains a word and a hint separated by a comma
        const wordList = lines.map(line => {
            const [word, hint] = line.split(',');
            return { word: word.trim(), hint: hint.trim() };
        });

        // Now you have the wordList array with words and hints
        // You can use this array to initialize your game or perform any other actions
        console.log(wordList);
    };

    reader.readAsText(file);
}