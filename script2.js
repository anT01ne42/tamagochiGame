/** tamagotchiGame
 toine

 edits:
 Was missing 'let'/'const' and semicolons on declarations
 Bad frenglish
 Redundancy, checking for non-existing elements in DOM and potential loop without cancellation
 */

//get stats (health, hunger, sleep) + their styles
let getHealth = document.getElementById('mtrH');
let getHunger = document.getElementById('mtrF');
let getSleep = document.getElementById('mtrS');
let getStyleH = getHealth.style;
let getStyleF = getHunger.style;
let getStyleS = getSleep.style;
//get feed and sleep buttons
let getBtnF = document.getElementById('btnF')
let getBtnS = document.getElementById('btnS')
//mess
let Message = document.getElementById('feedback');
//get creature image
let getPet = document.getElementById('petImage');

//function to update pet image and alt text based on state
function updatePetImage(state) {
    //stores current state of getPetState function
    getPet.dataset.state = state;

    switch(state) {
        case 'normal':
            getPet.src = "creaturenutre.svg";
            getPet.alt = "Happy face made of spiral eyes and a smile.";
            break;
        case 'hungry':
            getPet.src = "creatureohno.svg";
            getPet.alt = "Sad face made of spiral eyes and a frown.";
            break;
        case 'sleeping':
            getPet.src = "creaturezzz.svg";
            getPet.alt = "Sleeping face.";
            break;
        case 'dead':
            getPet.src = "creatureded.svg";
            getPet.alt = "Crossed eyes looking like big 'X'.";
            break;
        default:
            console.error("Unknown pet state:", state);
    }
}

//get current pet state
function getPetState() {
    return getPet.dataset.state || 'normal';
}
//get the kill button (testing purposes)
//const getOxygen = document.getElementById('killBtn');
//head or tail game
let getCoin = document.getElementById('resultIMG');
const playGameBtn = document.getElementById('playGameBtn');
const headOrTailGame = document.getElementById('headOrTailGame');
const backBtn = document.getElementById('backBtn');

//get starting prompt + pets name
const namePrompt = document.getElementById('namePrompt');
const petNameInput = document.getElementById('petName');
const startGameButton = document.getElementById('startGame');
const petNameDisplay = document.querySelector('h1');

//hide game initially
document.querySelector('.game').style.visibility = 'hidden';

//pet's stats are health and food. max stats and current stats. + intervals of time for losing each stats.
let statsMax = 30
let intervalH = 3000
let intervalF = 5000
let intervalS = 10000

let statsF = statsMax
let statsH = statsMax
let statsS = statsMax

let alive = true
let healthInterval, hungerInterval, sleepInterval;

//when food falls below threshold, pet starts losing health
let threshold = statsMax * 0.5
let points = 2
let pointsF = 10
let wither = 4

//call to lose hunger
function loseF() {
    statsF = statsF - points;
}

//call to lose health
function loseH() {
    statsH = statsH - points;
    //console.log("Lost health !");
}

//call to lose sleep
function loseS() {
    statsS = statsS - points;
}

//show the "Head or Tail" game with "Play"
playGameBtn.addEventListener('click', () => {
    headOrTailGame.style.display = 'block';
    playGameBtn.style.display = 'none';
    backBtn.style.display = 'inline-block';
});

//hide the "Head or Tail" game
backBtn.addEventListener('click', () => {
    headOrTailGame.style.display = 'none'; 
    playGameBtn.style.display = 'inline-block';
    backBtn.style.display = 'none';
});

//function to clear all intervals
function clearAllIntervals() {
    clearInterval(healthInterval);
    clearInterval(hungerInterval);
    clearInterval(sleepInterval);
}

//general game functions
function game() {

    //function to change the stats meter style (width)
    function updateMeters() {
        getStyleH.width = statsH * wither + "px";
        getStyleF.width = statsF * wither + "px";
        getStyleS.width = statsS * wither + "px";
        if (alive) {
            requestAnimationFrame(updateMeters); //smoother animation
        }
    }

    function restoreNormalState() {
        updatePetImage('normal');

        //At set intervals, hunger stat decreases (constant).
        //function to decrease hunger
        hungerInterval = setInterval(function () {
            if (alive) {
                loseF();
            }
        }, intervalF);

        //similar for sleep
        sleepInterval = setInterval(function () {
            if (alive) {
                loseS();
            }
        }, intervalS);

        //function to lose health then lose when too low
        //also checks if the creature is alive + change its image accordingly
        healthInterval = setInterval(function () {
            if (alive) {
                requestAnimationFrame(updateMeters);
                if (statsF < threshold) {
                    loseH();
                    //console.log("Creature is hungry!");
                    updatePetImage('hungry');
                } else {
                    updatePetImage('normal');
                }
                if (statsH <= 0) {
                    alive = false;
                    //console.log("DEAD!");
                    ending();
                    clearAllIntervals();
                }
            }
        }, intervalH);
    }
    restoreNormalState();

    //"Feed" button that restores food and health to the pet.
    getBtnF.addEventListener("click", function () {
        if (alive === true) {
            if (getPetState() === 'sleeping') {
                console.log("Cannot feed the pet while it's sleeping!");
                Message.innerHTML = "Cannot feed the pet while it's sleeping!";
                setTimeout(() => {
                    Message.innerHTML = "";
                }, 2000);
                return; //exit the function if the pet is sleeping
            }

            if (wallet >= 5 && statsF + pointsF <= statsMax) { 
                wallet -= 5; 
                updateWallet(); 

                if (statsF + pointsF <= statsMax) {
                    statsF = statsF + pointsF;

                    if (statsH + pointsF < statsMax) {
                        statsH = statsH + points;
                    }
                    requestAnimationFrame(updateMeters);
                }
                console.log("Pet fed! Wallet deducted by 5.");
            } else {
                console.log("Pet not hungry or not enough money in the wallet!");
                Message.innerHTML = "Pet not hungry or not enough money in the wallet!";
                setTimeout(() => {
                    Message.innerHTML = "";
                }, 2000);
            }}
        });

    //function to call with the sleep button : puts the pet to sleep, restores health and sleep,
    // and pauses the hunger interval
    //if the hunger was low enough to hurt the pet, it will stop losing health
    function sleep() {
        if (alive === true) {
            updatePetImage('sleeping');

            clearAllIntervals();

            sleepInterval = setInterval(function () {
                if (statsS + points <= statsMax) {
                    statsS += points;
                }
                // If sleep meter is above 80%, increase health
                if (statsS >= statsMax * 0.8 && statsH + points <= statsMax) {
                    statsH += points;
                }

                requestAnimationFrame(updateMeters);

                if (statsS >= statsMax) {
                    clearInterval(sleepInterval);
                    console.log("Fully rested!");
                }
            }, intervalH);
            console.log("Sleeping...");
            Message.innerHTML = "Sleeping...";
        }
    }

    //sleep button event listener, calls sleep function and clicking again will wake the pet up
    getBtnS.addEventListener("click", function () {
        if (alive === true) {
            if (getPetState() === 'sleeping') { //Same as other, put updatePetImageor the image file
                getBtnS.innerHTML = "Sleep";
                //console.log("Waking up...");
                Message.innerHTML = "";
                clearAllIntervals(); 
                restoreNormalState();
                statsS = Math.min(statsS, statsMax); 
                requestAnimationFrame(updateMeters);
            } else {
                getBtnS.innerHTML = "Wake";
                sleep();
            }
        }
    });


    //(testing purpose) function to kill
    /*getOxygen.addEventListener("click", function () {
        if (alive == true) {
            statsH = 0;
            requestAnimationFrame(updateMeters);
            alive = false;
            console.log("DEAD!");
            ending();
            clearAllIntervals();
        }
    });*/

    //function to display the losing div
    function ending() {
        updatePetImage('dead');
        clearAllIntervals();
        console.log("You Lost.");
        Message.innerHTML = "Your creature is dead! Refresh the page to play again!";
    }
}

//get head and tails elements
let head = document.getElementById('btnPH');
let tails = document.getElementById('btnPT');
let result = document.getElementById('resultText');

let wallet = 0; // Initialize wallet

//tutorial toggle functionality
const tutorialBtn = document.getElementById('tutorialBtn');
const tutorialPanel = document.getElementById('tutorialPanel');
const closeTutorial = document.getElementById('closeTutorial');

tutorialBtn.addEventListener('click', () => {
    tutorialPanel.style.display = tutorialPanel.style.display === 'none' ? 'block' : 'none';
});

closeTutorial.addEventListener('click', () => {
    tutorialPanel.style.display = 'none';
});

//update wallet display
function updateWallet() {
    document.getElementById('wallet').innerText = `Wallet: $${wallet}`;
}

//fonction returning a random number between 0 and 1
function PileOuFace() {
    return Math.random();
}

//if result < 0,5 then result = heads, if > 0.5 the result = tails
head.addEventListener('click', () => {
    const randomNumber = PileOuFace();
    console.log(randomNumber);
    getCoin.src = "coinhead.png";
    getCoin.alt = "A yellow coin with a head on it.";
    if (randomNumber < 0.5) {
        result.innerHTML = "Congrats!";
        console.log("You got heads!");
        wallet += 10; //add 10 to wallet
        updateWallet();
    } else {
        result.innerHTML = "Failed!";
        console.log("You didn't get heads!");
    }
});

tails.addEventListener('click', () => {
    const randomNumber = PileOuFace();
    console.log(randomNumber);
    getCoin.src = "cointail.png";
    getCoin.alt = "A yellow coin with a tail on it.";
    if (randomNumber > 0.5) {
        result.innerHTML = "Congrats!";
        console.log("You got tails!");
        wallet += 10; //add 10 to wallet
        updateWallet();
    } else {
        result.innerHTML = "Failed!";
        console.log("You didn't get tails!");
    }
});

//game starts after choosing the pet's name
function initGame() {
    startGameButton.addEventListener('click', function() {
        const name = petNameInput.value.trim();
        if (name !== '') {
            petNameDisplay.textContent = name;
            namePrompt.style.display = 'none';
            document.querySelector('.game').style.visibility = 'visible';
            game();
        } else {
            alert('Please enter a name for your pet!');
        }
    });
}

initGame();
