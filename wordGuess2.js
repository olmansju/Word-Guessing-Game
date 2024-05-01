const inputs = document.querySelector(".inputs"),
hintTag = document.querySelector(".hint span"),
guessLeft = document.querySelector(".guess-left span"),
wrongLetter = document.querySelector(".wrong-letter span"),
scoreDisplay = document.querySelector(".score span"),
highScoreDisplay = document.getElementById("high-score"),
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
    key.match(/^[A-Za-záéíóúüñÁÉÍÓÚÜÑ]+$/) &&
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

async function handleFileSelect(event) {
    const file = await event.target.files[0];
    const reader = new FileReader();

    reader.onload = await function(event) {
        const contents = event.target.result;
        const lines = contents.split('\n');

        // Assuming each line contains a word and a hint separated by a comma
        wordList = lines.map(line => {
            const [word, hint] = line.split(',');
            return { word: word.trim(), hint: hint.trim() };
        });
        
        console.log(wordList);
        //wordList = customWordList; // Update the global wordList variable
        randomWord(); 
    };

    reader.readAsText(file);
}
// Using a modal
const modal = document.getElementById("myModal");

// Open the modal
const openModalBtn = document.getElementById("open-modal-btn");

// Close the modal
const closeBtn = document.getElementsByClassName("close")[0];

const customWordInput = document.getElementById('custom-word-input');

openModalBtn.onclick = function() {
  modal.style.display = "block";
  customWordInput.focus(); // Set focus to the input field inside the modal ... not working ... 
}

// Close when user clicks on <span> (x)
closeBtn.onclick = function() {
  modal.style.display = "none";
}

// Close when user clicks anywhere outside of the modal
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// Function to add custom word
const addWordBtn = document.getElementById('add-word-btn');

addWordBtn.addEventListener('click', () => {
    const inputText = customWordInput.value.trim();
    const [word, hint] = inputText.split(',');
    if (word && hint) {
        wordList.push({ word: word.trim(), hint: hint.trim() });
        customWordInput.value = '';
        modal.style.display = "none";
    } else {
        alert('Please enter the word and hint separated by a comma.');
    }
});