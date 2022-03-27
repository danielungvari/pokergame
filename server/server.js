//-----------Declaring most important elements---------//

const Deck = require('./deck.js')
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const { makeid } = require('./utils.js');
const deck = new Deck();
const app = express();
var Hand = require('pokersolver').Hand;

app.use(express.static(`${__dirname}/../client`));

const server = http.createServer(app);
const io = socketio(server);

//----------------------------------------------------//

//---------------------Declaring sets-------------------------//

const blinds = {};
const whichround = {};
const doubleCheck = {};
const buttonPriority = {};
const cards = {};
const rooms = {};

//------------------------------------------------------------//

//---------------------Declaring variables-------------------------//

let card1,card2,card3,card4,card5,playerCard1,playerCard2,playerCard3,playerCard4;
let number1, number2, number3, number4, number5, number6, number7, number8, number9;

//-----------------------------------------------------------------//

//---------------------Main function-------------------------//

io.on('connection', (socket) => 
{   
    
    //---------------------Listening to messages from client-------------------------//
    
    socket.on('newGame', handleNewGame);
    socket.on('joinGame', handleJoinGame);
    socket.on('player1Fold', handlePlayer1Fold);    
    socket.on('player1Call', handlePlayer1Call);
    socket.on('player1Raise', handlePlayer1Raise);
    socket.on('player2Call', handlePlayer2Call);
    socket.on('player2Raise', handlePlayer2Raise);
    socket.on('player2Fold', handlePlayer2Fold);
    socket.on('newRound', newRound);
    socket.on('disconnect', () => {
        io.sockets.in(rooms[socket.id]).emit('opponentLeft');
    });
    
    //------------------------------------------------------------------------------//
   
    //---------------------Handling a room joining-------------------------//

    function handleNewGame() {
        let roomName = makeid(7);
        socket.emit('gameCode', roomName);
        rooms[socket.id] = roomName;
        socket.join(roomName);
    }
    
    function handleJoinGame(gameCode)
    {
        const room = getActiveRooms();
        if(room.includes(gameCode))
        {
            if(io.sockets.adapter.rooms.get(gameCode).size > 1){
                socket.emit('tooManyPlayers');
                return;
                }
            else
            {
                socket.join(gameCode);
                rooms[socket.id] = gameCode;
                blinds[gameCode] = 1;
                startGame(gameCode);
            }
        }
        else
        {
            socket.emit('unknownGame');
            return;
        }
    }

    //--------------------------------------------------------------------//

    //--------------------------Getting active rooms-----------------------------//

    function getActiveRooms() {
        // Convert map into 2D list:
        // ==> [['4ziBKG9XFS06NdtVAAAH', Set(1)], ['room1', Set(2)], ...]
        const arr = Array.from(io.sockets.adapter.rooms);
        // Filter rooms whose name exist in set:
        // ==> [['room1', Set(2)], ['room2', Set(2)]]
        const filtered = arr.filter(room => !room[1].has(room[0]))
        // Return only the room name: 
        // ==> ['room1', 'room2']
        const res = filtered.map(i => i[0]);
        return res;
    }

    //--------------------------------------------------------------------------//

    //--------------------------Dealing cards and saving them for each room-----------------------------//

    function dealCards(roomName) {
        deck.shuffle();      
        card1 = deck.cards[4];
        card2 = deck.cards[5];
        card3 = deck.cards[6];
        card4 = deck.cards[7];
        card5 = deck.cards[8];
        playerCard1 = deck.cards[0];
        playerCard2 = deck.cards[1];
        playerCard3 = deck.cards[2];
        playerCard4 = deck.cards[3];
        number1 = card1.whichCard();
        number2 = card2.whichCard();
        number3 = card3.whichCard();
        number4 = card4.whichCard();
        number5 = card5.whichCard();
        number6 = playerCard1.whichCard();
        number7 = playerCard2.whichCard();
        number8 = playerCard3.whichCard();
        number9 = playerCard4.whichCard();
        cards[roomName] = [card1,card2,card3,card4,card5,
            playerCard1,playerCard2,playerCard3,playerCard4,
            number1,number2,number3,number4,number5,number6,number7,number8,number9];
    }

    //--------------------------------------------------------------------------------------------------//

    //--------------------------Starting the game and first round-----------------------------//

    async function startGame(roomName)
    {          
        dealCards(roomName);
        const allSockets =await io.in(roomName).allSockets();
        const players = allSockets.values();
        const player1 = players.next().value;
        const player2 = players.next().value;
        io.to(player1).emit('player1Screen');
        io.to(player2).emit('player2Screen');
        io.to(player1).emit('card', 
        {
            'number': 0,
            'number2': 0,
            'number3': 0,
            'number4': 0,
            'number5': 0,
            'number6': cards[roomName][14],
            'number7': cards[roomName][15],
            'number8': 0,
            'number9': 0
        });
        io.to(player2).emit('card', 
        {
            'number': 0,
            'number2': 0,
            'number3': 0,
            'number4': 0,
            'number5': 0,
            'number6': 0,
            'number7': 0,
            'number8': cards[roomName][16],
            'number9': cards[roomName][17]
        });
        io.sockets.in(roomName).emit('player2Blind');
        buttonPriority[roomName] = 1;
        io.sockets.in(roomName).emit('buttonPriority', buttonPriority[roomName]);
        whichround[roomName] = 1;
        io.sockets.in(roomName).emit('whichRound', whichround[roomName]);
        doubleCheck[roomName] = 0;
    }

    //---------------------------------------------------------------------------------------//

    //---------------------------Starting a new round----------------------------------------------//

    async function newRound(roomName)
    {
        dealCards(roomName);
        const allSockets =await io.in(roomName).allSockets();
        const players = allSockets.values();
        const player1 = players.next().value;
        const player2 = players.next().value;
        io.to(player1).emit('card', 
        {
            'number': 0,
            'number2': 0,
            'number3': 0,
            'number4': 0,
            'number5': 0,
            'number6': cards[roomName][14],
            'number7': cards[roomName][15],
            'number8': 0,
            'number9': 0
        });
        io.to(player2).emit('card', 
        {
            'number': 0,
            'number2': 0,
            'number3': 0,
            'number4': 0,
            'number5': 0,
            'number6': 0,
            'number7': 0,
            'number8': cards[roomName][16],
            'number9': cards[roomName][17]
        });
        switch(blinds[roomName])
        {
            case 1:
                io.sockets.in(roomName).emit('player1Blind');
                buttonPriority[roomName] = 2;
                io.sockets.in(roomName).emit('buttonPriority', buttonPriority[roomName]);
                blinds[roomName] = 2;
                break;
            case 2:
                io.sockets.in(roomName).emit('player2Blind');
                buttonPriority[roomName] = 1;
                io.sockets.in(roomName).emit('buttonPriority', buttonPriority[roomName]);
                blinds[roomName] = 1;
                break;  
        }
        whichround[roomName] = 1;
        io.sockets.in(roomName).emit('whichRound', whichround[roomName]);
        doubleCheck[roomName] = 0;      
    }
    
    //---------------------------------------------------------------------------------------------//

    //--------------------------------Determining the winner-----------------------------------//

    function determineWinner(activeCards)
    {
        let win;
        
        var player1Hand = Hand.solve([
            activeCards[0].value + activeCards[0].symbol,
            activeCards[1].value + activeCards[1].symbol,
            activeCards[2].value + activeCards[2].symbol,
            activeCards[3].value + activeCards[3].symbol,
            activeCards[4].value + activeCards[4].symbol,
            activeCards[5].value + activeCards[5].symbol,
            activeCards[6].value + activeCards[6].symbol,
        ])

        var player2Hand = Hand.solve([
            activeCards[0].value + activeCards[0].symbol,
            activeCards[1].value + activeCards[1].symbol,
            activeCards[2].value + activeCards[2].symbol,
            activeCards[3].value + activeCards[3].symbol,
            activeCards[4].value + activeCards[4].symbol,
            activeCards[7].value + activeCards[7].symbol,
            activeCards[8].value + activeCards[8].symbol,
        ])
        

        if(player1Hand.rank > player2Hand.rank)
        {
            win = ['player1Hand',player1Hand.descr];
            return win;
        }
        else if(player2Hand.rank > player1Hand.rank)
        {
            win = ['player2Hand',player2Hand.descr];
            return win;
        }
        else
        {
            win = ['draw',player1Hand.descr];
            return win;
        }
    }

    //-----------------------------------------------------------------------------------------//

    //-------------------------------------Ending a round--------------------------------------//

    function endRound(roomName)
    {
        let winner = determineWinner(cards[roomName]);
        io.sockets.in(roomName).emit('card', 
        {
            'number6': cards[roomName][14],
            'number7': cards[roomName][15],
            'number8': cards[roomName][16],
            'number9': cards[roomName][17]
        })
        io.sockets.in(roomName).emit('playerWon', winner);
    }

    //----------------------------------------------------------------------------------------//

    //---------------Handling Player 1 actions--------------------//

    function handlePlayer1Fold(roomName, chips, pot, player1Bet, player2Bet)
    {
        chips += pot + player1Bet + player2Bet;
        io.sockets.in(roomName).emit('player1Folded', chips, '75');
        newRound(roomName);
    }

    function handlePlayer1Call(roomName, buttonText, pot, chips, player1Bet, player2Bet)
    {
        if(buttonText == 'Check')
        {
            switch (whichround[roomName]) {
                case 1:
                    pot += player2Bet;
                    io.sockets.in(roomName).emit('player1Called', buttonText, pot);             
                    io.sockets.in(roomName).emit('card', 
                    {
                        'number': cards[roomName][9], 
                        'number2': cards[roomName][10],
                        'number3': cards[roomName][11]
                    });
                    io.sockets.in(roomName).emit('playFlipSound');
                    whichround[roomName] = 3;
                    io.sockets.in(roomName).emit('whichRound', whichround[roomName]);
                    break;
                case 2:
                    doubleCheck[roomName]++;
                    switch(doubleCheck[roomName])
                    {
                        case 2: 
                            io.sockets.in(roomName).emit('player1Called', buttonText);
                            io.sockets.in(roomName).emit('card', 
                            {
                                'number': cards[roomName][9], 
                                'number2': cards[roomName][10],
                                'number3': cards[roomName][11]
                            });
                            io.sockets.in(roomName).emit('playFlipSound');
                            doubleCheck[roomName] = 0;
                            whichround[roomName]++;
                            io.sockets.in(roomName).emit('whichRound', whichround[roomName]);
                            break;
                        default:
                            io.sockets.in(roomName).emit('player1Called', buttonText);
                        }
                        break;
                case 3:
                    doubleCheck[roomName]++;
                    switch(doubleCheck[roomName])
                    {
                        case 2: 
                            io.sockets.in(roomName).emit('player1Called', buttonText);
                            io.sockets.in(roomName).emit('card', 
                            {
                            'number4': cards[roomName][12]
                            });
                            io.sockets.in(roomName).emit('playFlipSound');
                            doubleCheck[roomName] = 0;
                            whichround[roomName]++;
                            io.sockets.in(roomName).emit('whichRound', whichround[roomName]);
                            break;
                        default:
                            io.sockets.in(roomName).emit('player1Called', buttonText);
                    }
                    break;
                case 4:
                    doubleCheck[roomName]++;
                    switch(doubleCheck[roomName])
                    {
                        case 2: 
                            io.sockets.in(roomName).emit('player1Called', buttonText);
                            io.sockets.in(roomName).emit('card', 
                            {
                            'number5': cards[roomName][13]
                            });
                            io.sockets.in(roomName).emit('playFlipSound');
                            doubleCheck[roomName] = 0;
                            whichround[roomName]++;
                            io.sockets.in(roomName).emit('whichRound', whichround[roomName]);
                            break;
                        default:
                            io.sockets.in(roomName).emit('player1Called', buttonText);
                    }
                    break;
                case 5:
                    doubleCheck[roomName]++;
                    switch(doubleCheck[roomName])
                    {
                        case 2: 
                            io.sockets.in(roomName).emit('player1Called', buttonText);
                            endRound(roomName);
                            break;
                        default:
                            io.sockets.in(roomName).emit('player1Called', buttonText);
                    }
                    break;    
            }
        }
        else if(buttonText == 'Call'){
            switch (whichround[roomName])
            {
                case 1:
                    player1Bet = 25;
                    chips -= 25;
                    io.sockets.in(roomName).emit('player1Called', buttonText, pot, chips);
                    break;
                case 2:
                    pot += player1Bet + player2Bet + (player2Bet - player1Bet);
                    chips -= player2Bet - player1Bet;
                    io.sockets.in(roomName).emit('player1Called', buttonText, pot, chips);
                    io.sockets.in(roomName).emit('card', 
                    {
                        'number': cards[roomName][9], 
                        'number2': cards[roomName][10],
                        'number3': cards[roomName][11]
                    });
                    io.sockets.in(roomName).emit('playFlipSound');
                    doubleCheck[roomName] = 0;
                    whichround[roomName]++;
                    io.sockets.in(roomName).emit('whichRound', whichround[roomName]);
                    break;
                case 3:
                    pot += player1Bet + player2Bet + (player2Bet - player1Bet);
                    chips -= player2Bet - player1Bet;
                    io.sockets.in(roomName).emit('player1Called', buttonText, pot, chips);
                    io.sockets.in(roomName).emit('card', 
                    {
                        'number4': cards[roomName][12]
                    });
                    io.sockets.in(roomName).emit('playFlipSound');
                    doubleCheck[roomName] = 0;
                    whichround[roomName]++;
                    io.sockets.in(roomName).emit('whichRound', whichround[roomName]);
                    break;
                case 4:
                    pot += player1Bet + player2Bet + (player2Bet - player1Bet);
                    chips -= player2Bet - player1Bet;
                    io.sockets.in(roomName).emit('player1Called', buttonText, pot, chips);
                    io.sockets.in(roomName).emit('card', 
                    {
                        'number5': cards[roomName][13]
                    });
                    io.sockets.in(roomName).emit('playFlipSound');
                    doubleCheck[roomName] = 0;
                    whichround[roomName]++;
                    break;
                case 5:
                    pot += player1Bet + player2Bet + (player2Bet - player1Bet);
                    chips -= player2Bet - player1Bet;
                    io.sockets.in(roomName).emit('player1Called', buttonText, pot, chips);
                    endRound(roomName);
                    break;
            }
        }
        else{
            pot += chips + player1Bet + player2Bet;  
            chips = 0; 
            io.sockets.in(roomName).emit('player1Called', buttonText, pot);
            io.sockets.in(roomName).emit('card', 
                    {
                        'number': cards[roomName][9], 
                        'number2': cards[roomName][10],
                        'number3': cards[roomName][11],
                        'number4': cards[roomName][12],
                        'number5': cards[roomName][13],
                        'number6': cards[roomName][14],
                        'number7': cards[roomName][15],
                        'number8': cards[roomName][16],
                        'number9': cards[roomName][17]
                    });
            io.sockets.in(roomName).emit('playFlipSound');
            endRound(roomName);
        }
    }

    function handlePlayer1Raise(roomName, raise)
    {
        switch(whichround[roomName])
        {
            case 1:
                io.sockets.in(roomName).emit('player1Raised', raise);
                whichround[roomName]++;
                io.sockets.in(roomName).emit('whichRound', whichround[roomName]);
                break;
            default:
                io.sockets.in(roomName).emit('player1Raised', raise);
        }
    }

    //------------------------------------------------------------//

    //---------------Handling Player 2 actions--------------------//

    function handlePlayer2Fold(roomName, chips, pot, player1Bet, player2Bet)
    {
        chips += pot + player1Bet + player2Bet;
        io.sockets.in(roomName).emit('player2Folded', chips, '75');
        newRound(roomName);
    }

    function handlePlayer2Call(roomName, buttonText, pot, chips, player1Bet, player2Bet)
    {
        if(buttonText == 'Check')
        {
            switch(whichround[roomName])
            {
                case 1:
                    pot += player1Bet;
                    io.sockets.in(roomName).emit('player2Called', buttonText, pot);
                    io.sockets.in(roomName).emit('card', 
                    {
                        'number': cards[roomName][9], 
                        'number2': cards[roomName][10],
                        'number3': cards[roomName][11]
                    });
                    io.sockets.in(roomName).emit('playFlipSound');
                    whichround[roomName] = 3;
                    io.sockets.in(roomName).emit('whichRound', whichround[roomName]);
                    break; 
                case 2:
                    doubleCheck[roomName]++;
                    switch(doubleCheck[roomName])
                    {
                        case 2: 
                            io.sockets.in(roomName).emit('player2Called', buttonText);
                            io.sockets.in(roomName).emit('card', 
                            {
                                'number': cards[roomName][9], 
                                'number2': cards[roomName][10],
                                'number3': cards[roomName][11]
                            });
                            io.sockets.in(roomName).emit('playFlipSound');
                            doubleCheck[roomName] = 0;
                            whichround[roomName]++;
                            io.sockets.in(roomName).emit('whichRound', whichround[roomName]);
                            break;
                        default:
                            io.sockets.in(roomName).emit('player2Called', buttonText);
                        }
                        break;
                case 3:
                    doubleCheck[roomName]++;
                    switch(doubleCheck[roomName])
                    {
                        case 2: 
                            io.sockets.in(roomName).emit('player2Called', buttonText);
                            io.sockets.in(roomName).emit('card', 
                            {
                            'number4': cards[roomName][12]
                            });
                            io.sockets.in(roomName).emit('playFlipSound');
                            doubleCheck[roomName] = 0;
                            whichround[roomName]++;
                            io.sockets.in(roomName).emit('whichRound', whichround[roomName]);
                            break;
                        default:
                            io.sockets.in(roomName).emit('player2Called', buttonText);
                        }
                        break;
                case 4:
                    doubleCheck[roomName]++;
                    switch(doubleCheck[roomName])
                    {
                        case 2: 
                            io.sockets.in(roomName).emit('player2Called', buttonText);
                            io.sockets.in(roomName).emit('card', 
                            {
                            'number5': cards[roomName][13]
                            });
                            io.sockets.in(roomName).emit('playFlipSound');
                            doubleCheck[roomName] = 0;
                            whichround[roomName]++;
                            io.sockets.in(roomName).emit('whichRound', whichround[roomName]);
                            break;
                        default:
                            io.sockets.in(roomName).emit('player2Called', buttonText);
                        }
                        break;
                 case 5:
                    doubleCheck[roomName]++;
                    switch(doubleCheck[roomName])
                    {
                        case 2: 
                            io.sockets.in(roomName).emit('player2Called', buttonText);
                            endRound(roomName);
                            break;
                        default:
                            io.sockets.in(roomName).emit('player2Called', buttonText);
                        }
                    break;

            }
        }
        else if(buttonText == 'Call'){
            switch(whichround[roomName])
            {
                case 1:
                    player2Bet = 25;
                    chips -= 25;
                    io.sockets.in(roomName).emit('player2Called', buttonText, pot, chips);
                    break;
                case 2:
                    pot += player1Bet + player2Bet + (player1Bet - player2Bet);
                    chips -= player1Bet - player2Bet;
                    io.sockets.in(roomName).emit('player2Called', buttonText, pot, chips);
                    io.sockets.in(roomName).emit('card', 
                    {
                        'number': cards[roomName][9], 
                        'number2': cards[roomName][10],
                        'number3': cards[roomName][11]
                    });
                    io.sockets.in(roomName).emit('playFlipSound');
                    doubleCheck[roomName] = 0;
                    whichround[roomName]++;
                    io.sockets.in(roomName).emit('whichRound', whichround[roomName]);
                    break;
                case 3:
                    pot += player1Bet + player2Bet + (player1Bet - player2Bet);
                    chips -= player1Bet - player2Bet;
                    io.sockets.in(roomName).emit('player2Called', buttonText, pot, chips);
                    io.sockets.in(roomName).emit('card', 
                     {
                    'number4': cards[roomName][12]
                    });
                    io.sockets.in(roomName).emit('playFlipSound');
                    doubleCheck[roomName] = 0;
                    whichround[roomName]++;
                    io.sockets.in(roomName).emit('whichRound', whichround[roomName]);
                    break;
                case 4:
                    pot += player1Bet + player2Bet + (player1Bet - player2Bet);
                    chips -= player1Bet - player2Bet;
                    io.sockets.in(roomName).emit('player2Called', buttonText, pot, chips);
                    io.sockets.in(roomName).emit('card', 
                    {
                    'number5': cards[roomName][13]
                    });
                    io.sockets.in(roomName).emit('playFlipSound');
                    doubleCheck[roomName] = 0;
                    whichround[roomName]++;
                    break;
                case 5:
                    pot += player1Bet + player2Bet + (player1Bet - player2Bet);
                    chips -= player1Bet - player2Bet;
                    io.sockets.in(roomName).emit('player2Called', buttonText, pot, chips);
                    endRound(roomName);
                    break;
            }
        }
        else{
            pot += chips + player1Bet + player2Bet;  
            chips = 0; 
            io.sockets.in(roomName).emit('player2Called', buttonText, pot);
            io.sockets.in(roomName).emit('card', 
                    {
                        'number': cards[roomName][9], 
                        'number2': cards[roomName][10],
                        'number3': cards[roomName][11],
                        'number4': cards[roomName][12],
                        'number5': cards[roomName][13],
                        'number6': cards[roomName][14],
                        'number7': cards[roomName][15],
                        'number8': cards[roomName][16],
                        'number9': cards[roomName][17]
                    });
            io.sockets.in(roomName).emit('playFlipSound');
            endRound(roomName);
        }
    }

    function handlePlayer2Raise(roomName, raise)
    {
        switch(whichround[roomName])
        {
            case 1:
                io.sockets.in(roomName).emit('player2Raised', raise);
                whichround[roomName]++;
                io.sockets.in(roomName).emit('whichRound', whichround[roomName]);
                break;
            default:
                io.sockets.in(roomName).emit('player2Raised', raise);
        }
    }

    //------------------------------------------------------------//
    
});

//-----------------------------------------------------------//

//---------------------Function if there is a server error-------------------------//

server.on('error', (err) =>
{
    console.error(err);
});

//---------------------------------------------------------------------------------//

//---------------------Function if server is ready-------------------------//

server.listen(8080, () => {
    console.log('server is ready at port 8080');
});

//-------------------------------------------------------------------------//
