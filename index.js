// Optional toggle function for nav on small screens
function toggleNavbar() {
    const nav = document.getElementById('navbar-collapse');
    if (nav.style.display === "flex") {
    nav.style.display = "none";
    } else {
        nav.style.display = "flex";
    }
}

const NumberInfo = document.getElementById("NumberInfo");
const Guess = document.getElementById("Guess");
const StartBtn = document.getElementById("StartBtn");
let Answer = Math.floor(Math.random() * 100) + 1;
let UserGuess;

StartBtn.onclick = function () {
    StartBtn.textContent = "Guess";
    UserGuess = Number(Guess.value);
    if (UserGuess > Answer) {
        NumberInfo.textContent = "It's smaller";
    }
    else if (UserGuess < Answer) {
        NumberInfo.textContent = "It's bigger";
    }
    else if (UserGuess == Answer) {
        NumberInfo.textContent = `You won! the answer was ${Answer}`
    }
}