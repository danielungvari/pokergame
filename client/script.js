import displayCard from './displayCard.js'

const socket = io();
let roundNumber, buttonPrior;

//---------------------------Listening to messages from server----------------------------------//
socket.on('gameCode', handleGameCode);
socket.on('unknownGame', handleUnknownGame);
socket.on('tooManyPlayers', handleTooManyPlayers);
socket.on('player1Screen', getPlayer1Screen);
socket.on('player2Screen', getPlayer2Screen);
socket.on('card', dealCards);
socket.on('player1Folded', player1Folded);
socket.on('player1Called', player1Called);
socket.on('player1Raised', player1Raised);
socket.on('player2Folded', player2Folded);
socket.on('player2Called', player2Called);
socket.on('player2Raised', player2Raised);
socket.on('player1Blind', player1Blind);
socket.on('player2Blind', player2Blind);
socket.on('whichRound', whichRound);
socket.on('buttonPriority', buttonPriority);
socket.on('playerWon', playerWon);
socket.on('playFlipSound', playFlipSound);
socket.on('opponentLeft', opponentLeft);

//---------------------------------------------------------------------------------------------//

//---------------------------Getting all the elements from the page----------------------------//

const gameScreen = document.getElementById('gameScreen');
const newGamePage = document.getElementById('newGamePage');
const newGameBtn = document.getElementById('newGameButton');
const joinGameBtn = document.getElementById('joinGameButton');
const gameCodeInput = document.getElementById('gameCodeInput');
const gameCodeDisplay = document.getElementById('gameCodeDisplay');
const gameCode = document.getElementById('gameCode');
const player1FoldBtn = document.getElementById('player1Fold');
const player1CallBtn = document.getElementById('player1Call');
const player1RaiseBtn = document.getElementById('player1Raise');
const player2FoldBtn = document.getElementById('player2Fold');
const player2CallBtn = document.getElementById('player2Call');
const player2RaiseBtn = document.getElementById('player2Raise');
const player1Chips = document.getElementById('player1Chips');
const player2Chips = document.getElementById('player2Chips');
const currentPot = document.getElementById('currentPot');
const player1Bet = document.getElementById('player1Bet');
const player2Bet = document.getElementById('player2Bet');
const player1RaiseInput = document.getElementById('player1RaiseInput');
const player2RaiseInput = document.getElementById('player2RaiseInput');
const gameInformation = document.getElementById('gameInfo');
const playerWonScreen = document.getElementById('playerWonScreen');
const rulesBtn = document.getElementById('rulesButton');
const rulesScreen = document.getElementById('rulesScreen');
const mainMenuBtn = document.getElementById('mainMenuButton');

//---------------------------------------------------------------------------------------------//

//-----------------------------Adding listeners to the buttons---------------------------------//

newGameBtn.addEventListener('click', newGame);
joinGameBtn.addEventListener('click', joinGame);
player1FoldBtn.addEventListener('click', player1Fold);
player1CallBtn.addEventListener('click', player1Call);
player1RaiseBtn.addEventListener('click', player1Raise);
player2FoldBtn.addEventListener('click', player2Fold);
player2CallBtn.addEventListener('click', player2Call);
player2RaiseBtn.addEventListener('click', player2Raise);
rulesBtn.addEventListener('click', getRulesScreen);
mainMenuBtn.addEventListener('click', getMainMenuScreen);

//---------------------------------------------------------------------------------------------//

//--------------------------------Starting functions----------------------------------//

function newGame()
{
  socket.emit('newGame');
  startGame();
}

function joinGame()
{
  const code = gameCodeInput.value;
  socket.emit('joinGame', code);
  startGame();
}

//-------------------------------------------------------------------------------------//

//-----------------------------Screen functions---------------------------------//

function getRulesScreen()
{
  newGamePage.style.display = "none";
  rulesScreen.style.display = "block";
}

function getMainMenuScreen()
{
  reset();
}

function getPlayer1Screen(){
  gameScreen.style.display ="block";
  gameCode.style.display = "none";
  player2FoldBtn.style.display = "none";
  player2CallBtn.style.display = "none";
  player2RaiseBtn.style.display = "none";
  player1RaiseInput.style.display = "none";
  player2RaiseInput.style.display = "none";
}

function getPlayer2Screen(){
  gameScreen.style.display="block";
  gameCode.style.display = "none";
  player1FoldBtn.style.display = "none";
  player1CallBtn.style.display = "none";
  player1RaiseBtn.style.display = "none";
  player1RaiseInput.style.display = "none";
  player2RaiseInput.style.display = "none";
  disablePlayer2Button();
}

function startGame()
{
  gameCode.style.display = "block";
  newGamePage.style.display = "none";
  
}

function handleGameCode(gameCode)
{
  gameCodeDisplay.innerText = gameCode;
}

function reset()
{
  gameCodeInput.value = "";
  gameCodeDisplay.innerText = "";
  newGamePage.style.display = "block";
  gameScreen.style.display = "none";
  gameCode.style.display = "none";
  playerWonScreen.style.display = "none";
  rulesScreen.style.display = "none";
}

function dealCards(data)
{
    displayCard("card1",data.number);
    displayCard("card2",data.number2);
    displayCard("card3",data.number3);
    displayCard("card4",data.number4);
    displayCard("card5",data.number5);
    displayCard("playerCard1",data.number6);
    displayCard("playerCard2",data.number7);
    displayCard("playerCard3",data.number8);
    displayCard("playerCard4",data.number9);
}

//-----------------------------------------------------------------------------//

//-----------------------------Handling errors---------------------------------//

function handleUnknownGame()
{
  reset();
  alert("Unknown game code");
}

function handleTooManyPlayers()
{
  reset();
  alert("This game is already in progress");
}

function opponentLeft()
{
  alert('Opponent left the game, returning to main screen');
  location.reload();
}

//-----------------------------------------------------------------------------//

//-----------------------------Round helper functions-----------------------//

function playerWon(winner)
{
  if(winner[0] == 'player1Hand')
  {
    player1Chips.innerHTML = Number(player1Chips.innerHTML) + Number(currentPot.innerHTML);
    gameInformation.innerHTML = "Player 1 Won <br> " + currentPot.innerHTML + " chips with<br>" + winner[1];  
  }
  else{
    player2Chips.innerHTML = Number(player2Chips.innerHTML) + Number(currentPot.innerHTML);
    gameInformation.innerHTML = "Player 2 Won <br> " + currentPot.innerHTML + " chips with<br>" + winner[1]; 
  }
  if(Number(player1Chips.innerHTML) === 0)
  {
    setTimeout(() => {
      gameScreen.style.display = "none";
      playerWonScreen.innerHTML = 'Player 2 Won the game!';
      playerWonScreen.style.display = "block";
    }, 7000);
   
    setTimeout(() => {
      location.reload();
    }, 13000);
  }
  if(Number(player2Chips.innerHTML) === 0)
  {
    setTimeout(() => {
      gameScreen.style.display = "none";
      playerWonScreen.innerHTML = 'Player 1 Won the game!';
      playerWonScreen.style.display = "block";
    }, 7000);
    setTimeout(() => {
      location.reload();
    }, 13000);
  }
  
  setTimeout(() => {
    socket.emit('newRound', gameCodeDisplay.innerText);
  }, 7000);
}

function whichRound(num)
{
  switch (num)
  {
    case 1:
      roundNumber=1;
      break;
    case 2:
      roundNumber = 2;
      break;
    case 3:
      roundNumber = 3;
      break;
    case 4:
      roundNumber = 4;
      break;
    case 5:
      roundNumber = 5;
      break;
  }
}

function buttonPriority(num)
{
  switch(num){
    case 1:
      buttonPrior = 1; 
      break;
    case 2:
      buttonPrior = 2;
      break;
  }

}

//-------------------------------------------------------------------------//

//-----------------------------Sound playing functions-----------------------//

function playAudio(any)
{
  let bigchips = new Audio('$__dirname/../assets/chips_big.mp3');
  let smallchips = new Audio('$__dirname/../assets/chips_small.mp3');
  let cardfold = new Audio('%__dirname/../assets/card_fold.mp3');
  let winbig = new Audio('%__dirname/../assets/chips_shuffle_big.mp3');
  if(any > 500)
  {
    bigchips.play();
  }
  if(any < 500)
  {
    smallchips.play();
  }
  if(any == 'fold')
  {
    cardfold.play();
  }
  if(any == 'price')
  {
    winbig.play();
  }
}

function playFlipSound()
{
  let cardflip = new Audio('%__dirname/../assets/poker-card.wav');
  cardflip.play();
}

function playCheckSound()
{
  let check = new Audio('%__dirname/../assets/check_sound.mp3');
  check.play();
}

//---------------------------------------------------------------------------//

//-----------Player Buttons Enabling/Disabling---------//


function enablePlayer1Button()
{
  player1FoldBtn.disabled = false;
  player1CallBtn.disabled = false;
  player1RaiseBtn.disabled = false;
}

function disablePlayer1Button()
{
  player1FoldBtn.disabled = true;
  player1CallBtn.disabled = true;
  player1RaiseBtn.disabled = true;
}

function enablePlayer2Button()
{
  player2FoldBtn.disabled = false;
  player2CallBtn.disabled = false;
  player2RaiseBtn.disabled = false;
}

function disablePlayer2Button()
{
  player2FoldBtn.disabled = true;
  player2CallBtn.disabled = true;
  player2RaiseBtn.disabled = true;
}

//----------------------------------------------------//

//----------Round Starting/Placing Big Blinds and Small blinds---------------//

function player1Blind(){
  player1Chips.innerHTML = Number(player1Chips.innerHTML) - 50;
  player2Chips.innerHTML = Number(player2Chips.innerHTML) - 25;
  currentPot.innerHTML = 75;
  player1CallBtn.innerHTML = "Check";
  player2CallBtn.innerHTML = "Call";
  enablePlayer2Button();
  disablePlayer1Button();
}

function player2Blind(){
  player1Chips.innerHTML = Number(player1Chips.innerHTML) - 25;
  player2Chips.innerHTML = Number(player2Chips.innerHTML) - 50;
  currentPot.innerHTML = 75;
  player1CallBtn.innerHTML = "Call";
  player2CallBtn.innerHTML = "Check";
  enablePlayer1Button();
  disablePlayer2Button();
}

//--------------------------------------------------------------------------//



//---------------Sending Player 1 actions to server--------------------//

function player1Fold(){
  socket.emit('player1Fold', gameCodeDisplay.innerText, Number(player2Chips.innerHTML), Number(currentPot.innerHTML), Number(player1Bet.innerHTML), Number(player2Bet.innerHTML));
  player1RaiseInput.style.display = "none";
  playAudio('fold');
}

function player1Call(){
  if(player1CallBtn.innerHTML == 'Check')
  {
    socket.emit('player1Call', gameCodeDisplay.innerText,player1CallBtn.innerHTML, Number(currentPot.innerHTML), Number(player1Chips.innerHTML), Number(player1Bet.innerHTML), Number(player2Bet.innerHTML));
  } 
  else if(player1CallBtn.innerHTML == 'Call')
  {
    socket.emit('player1Call', gameCodeDisplay.innerText, player1CallBtn.innerHTML, Number(currentPot.innerHTML), Number(player1Chips.innerHTML), Number(player1Bet.innerHTML), Number(player2Bet.innerHTML));
  }
  else
  {
    socket.emit('player1Call', gameCodeDisplay.innerText, player1CallBtn.innerHTML, Number(currentPot.innerHTML), Number(player1Chips.innerHTML), Number(player1Bet.innerHTML), Number(player2Bet.innerHTML));
  }
}

function player1Raise(){
  player1RaiseInput.style.display = "block";
  if(player1RaiseInput.value != ""){
    if(Number(player1RaiseInput.value) > Number(player1Chips.innerHTML))
    {
      alert("Can't raise higher than your current chips");
      player1RaiseInput.value = "";
    }
  if(Number(player1RaiseInput.value) <= Number(player1Chips.innerHTML))
    {                    
    socket.emit('player1Raise', gameCodeDisplay.innerText, Number(player1RaiseInput.value));
    player1RaiseInput.style.display = "none";
    player1RaiseInput.value = "";
    }
  }
}

//------------------------------------------------------------------------//

//---------------Sending Player 2 actions to server--------------------//

function player2Fold(){
  socket.emit('player2Fold', gameCodeInput.value, Number(player1Chips.innerHTML), Number(currentPot.innerHTML), Number(player1Bet.innerHTML), Number(player2Bet.innerHTML));
  player2RaiseInput.style.display = "none";
  playAudio('fold');
}

function player2Call(){
  if(player2CallBtn.innerHTML == 'Check')
  {
      socket.emit('player2Call', gameCodeInput.value, player2CallBtn.innerHTML, Number(currentPot.innerHTML), Number(player2Chips.innerHTML), Number(player1Bet.innerHTML), Number(player2Bet.innerHTML));
  } 
  else if(player2CallBtn.innerHTML == 'Call')
  {
      socket.emit('player2Call', gameCodeInput.value, player2CallBtn.innerHTML, Number(currentPot.innerHTML), Number(player2Chips.innerHTML), Number(player1Bet.innerHTML), Number(player2Bet.innerHTML));
  }
  else
  {
    socket.emit('player2Call', gameCodeInput.value, player2CallBtn.innerHTML, Number(currentPot.innerHTML), Number(player2Chips.innerHTML), Number(player1Bet.innerHTML), Number(player2Bet.innerHTML));
  }
}

function player2Raise(){
  player2RaiseInput.style.display = "block";
  if(player2RaiseInput.value != ""){
    if(Number(player2RaiseInput.value) > Number(player2Chips.innerHTML))
    {
      alert("Can't raise higher than your current chips");
      player2RaiseInput.value = "";
    }
  if(Number(player2RaiseInput.value) <= Number(player2Chips.innerHTML))
    {                    
    socket.emit('player2Raise', gameCodeInput.value, Number(player2RaiseInput.value));
    player2RaiseInput.style.display = "none";
    player2RaiseInput.value = "";
    }
  }
}

//------------------------------------------------------------------------//

//---------------Handling Player 1 actions from server--------------------//

function player1Folded(won, start)
{
  gameInformation.style.display = "block";
  gameInformation.innerHTML = "Player 1 Folded<br>Player 2 Won<br>" + currentPot.innerHTML + " chips";
  player2Chips.innerHTML = won;
  currentPot.innerHTML = start;
  playAudio('price');
  player1Bet.innerHTML = 0;
  player2Bet.innerHTML = 0;
}

function player1Called(buttonText, pot, chips)
{
  gameInformation.style.display = "block";
  if(buttonText == 'Check')
  {
    switch(roundNumber)
    {
      case 1:
        gameInformation.innerHTML = "Player 1 Checked";
        player2Bet.innerHTML = 0;
        currentPot.innerHTML = pot;
        enablePlayer2Button();
        disablePlayer1Button();
        break;
      default:
        gameInformation.innerHTML = "Player 1 Checked";
        enablePlayer2Button();
        disablePlayer1Button();
    }
    playCheckSound();
  }
  else if(buttonText == 'Call')
  {
    switch(roundNumber)
    {
      case 1:
        gameInformation.innerHTML = "Player 1 Called<br>25 chips";
        player1Chips.innerHTML = chips;
        player1Bet.innerHTML = 25;
        playAudio(25);
        player1CallBtn.innerHTML = "Check";
        disablePlayer1Button();
        enablePlayer2Button();
        break;
      default:
        gameInformation.innerHTML = "Player 1 Called<br>" + (player2Bet.innerHTML-player1Bet.innerHTML) + " chips";
        currentPot.innerHTML = pot;
        player1Chips.innerHTML = chips;
        playAudio(Number(player2Bet.innerHTML));
        player1Bet.innerHTML = 0;
        player2Bet.innerHTML = 0;
        player1CallBtn.innerHTML = "Check";
        player2CallBtn.innerHTML = "Check";
        switch(buttonPrior)
        {
        case 1:
          enablePlayer1Button();
          disablePlayer2Button();
          break;
        case 2:
          disablePlayer1Button();
          enablePlayer2Button();
          break;
        }
    }

  }
  else
  {
    gameInformation.innerHTML = "Player 1 All in";
    currentPot.innerHTML = pot;
    playAudio(Number(player2Bet.innerHTML));
    player1Chips.innerHTML = 0;
    player1Bet.innerHTML = 0;
    player2Bet.innerHTML = 0;
    disablePlayer1Button();
    disablePlayer2Button();
  }
}

function player1Raised(bet)
{
  gameInformation.style.display = "block";
  gameInformation.innerHTML = "Player 1 Raised<br>" + bet + " chips";
  player1Bet.innerHTML = Number(player1Bet.innerHTML) + bet;
  playAudio(bet);
  player1Chips.innerHTML = Number(player1Chips.innerHTML) - bet;
  if(bet >= Number(player2Chips.innerHTML))
  {
    player2CallBtn.innerHTML = "All In";
  }
  else{
    player2CallBtn.innerHTML = "Call";
  }
  disablePlayer1Button();
  enablePlayer2Button();
}

//------------------------------------------------------------------------//

//---------------Handling Player 2 actions from server--------------------//

function player2Folded(won, start)
{
  gameInformation.style.display = "block";
  gameInformation.innerHTML = "Player 2 Folded<br>Player 1 Won<br>" + currentPot.innerHTML + " chips";
  player1Chips.innerHTML = won;
  currentPot.innerHTML = start;
  playAudio('price');
  player1Bet.innerHTML = 0;
  player2Bet.innerHTML = 0;
}

function player2Called(buttonText, pot, chips)
{
  gameInformation.style.display = "block";
  if(buttonText == 'Check')
  {
    switch(roundNumber)
    {
      case 1:
        gameInformation.innerHTML = "Player 2 Checked";
        player1Bet.innerHTML = 0;
        currentPot.innerHTML = pot;
        enablePlayer1Button();
        disablePlayer2Button();
        break;
      default:
        gameInformation.innerHTML = "Player 2 Checked";
        disablePlayer2Button();
        enablePlayer1Button();
    }
    playCheckSound();
  }
  else if(buttonText == 'Call')
  {
    switch(roundNumber){
      case 1:
        gameInformation.innerHTML = "Player 2 Called<br>25 chips";
        player2Chips.innerHTML = chips;
        player2Bet.innerHTML = 25;
        playAudio(25);
        player2CallBtn.innerHTML = "Check";
        disablePlayer2Button();
        enablePlayer1Button();
        break;
      default:
        gameInformation.innerHTML = "Player 2 Called<br>" + (player1Bet.innerHTML-player2Bet.innerHTML) + " chips";
        currentPot.innerHTML = pot;
        player2Chips.innerHTML = chips;
        playAudio(Number(player1Bet.innerHTML));
        player1Bet.innerHTML = 0;
        player2Bet.innerHTML = 0;
        player1CallBtn.innerHTML = "Check";
        player2CallBtn.innerHTML = "Check";
        switch(buttonPrior)
        {
        case 1:
          enablePlayer1Button();
          disablePlayer2Button();
          break;
        case 2:
          disablePlayer1Button();
          enablePlayer2Button();
          break;
        }
    }
  }
  else
  {
    gameInformation.innerHTML = "Player 2 All in";
    currentPot.innerHTML = pot;
    playAudio(Number(player1Bet.innerHTML));
    player2Chips.innerHTML = 0;
    player1Bet.innerHTML = 0;
    player2Bet.innerHTML = 0;
    disablePlayer1Button();
    disablePlayer2Button();
  }
}

function player2Raised(bet)
{
  gameInformation.style.display = "block";
  gameInformation.innerHTML = "Player 2 Raised<br>" + bet + " chips";
  player2Bet.innerHTML = Number(player2Bet.innerHTML) + bet;
  playAudio(bet);
  player2Chips.innerHTML = Number(player2Chips.innerHTML) - bet;
  if(bet >= Number(player1Chips.innerHTML))
  {
    player1CallBtn.innerHTML = "All In";
  }
  else{
    player1CallBtn.innerHTML = "Call";
  }
  enablePlayer1Button();
  disablePlayer2Button();
}

//------------------------------------------------------------------------//


  