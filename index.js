let colorOrder = []; // 0 = yellow, 1 = blue, 2 = green, 3 = red

let gameIndex = 0;
let gameStarted = false;
let userTurn = false;

const header = $("h1");
const buttons = $(".btn-container button");

const highScore = $(".score :first-child");
const score = $(".score :last-child");

$(document).on("keydown", (ev) => {
  if (!gameStarted) {
    startGame();
    gameStarted = true;
    return;
  }
  if (ev.key === "r") {
    restartLighting();
  }
});

$(document).on("click", () => {
  if (!gameStarted) {
    startGame();
    gameStarted = true;
    return;
  }
});

for (let i = 0; i < buttons.length; i++) {
  $(buttons[i]).on("click", () => {
    userGuess(i);
  });
}

highScore.attr("score", localStorage.getItem("highscore") || 0);

function startGame() {
  header.text("🏴 Currently lighting... 🏴");
  score.attr("score", 0);
  colorOrder.push(getRandomColor());
  startLighting();
}

function getRandomColor() {
  return Math.floor(Math.random() * 4);
}

function startLighting() {
  if (gameIndex >= colorOrder.length || userTurn) return;
  currentIndex = colorOrder[gameIndex];
  buttonLight(currentIndex);
  setTimeout(startLighting, 500);
  gameIndex++;

  if (gameIndex >= colorOrder.length) {
    changeUser(true);
    header.text("🏴 Click the right button! 🏴");
    return;
  }
}

function userGuess(guess) {
  if (!userTurn) return;

  buttonLight(guess);
  if (guess != colorOrder[gameIndex]) {
    header.text("💀 You pressed to wrong button! 💀");
    if (colorOrder.length - 1 > localStorage.getItem("highscore")) {
      localStorage.setItem("highscore", colorOrder.length - 1);
      highScore.attr("score", colorOrder.length - 1);
    }
    setTimeout(() => {
      restartGame();
    }, 1500);
    return;
  }

  gameIndex++;
  if (gameIndex >= colorOrder.length) {
    changeUser(false);
    score.attr("score", colorOrder.length);
    colorOrder.push(getRandomColor());
    setTimeout(startLighting, 500);
    header.text("🏴 Currently lighting... 🏴");
    return;
  }
}

function buttonLight(index) {
  buttons[index].classList.add("light");

  setTimeout(() => {
    buttons[index].classList.remove("light");
  }, 200);
}

function changeUser(user) {
  gameIndex = 0;
  userTurn = user;
}

function restartGame() {
  header.text("Press any button to start💯");
  changeUser(false);
  colorOrder = [];
  gameStarted = false;
  score.attr("score", 0);
}

function restartLighting() {
  if (!userTurn) return;
  header.text("🏴 Currently lighting... 🏴");
  changeUser(false);
  startLighting();
}
