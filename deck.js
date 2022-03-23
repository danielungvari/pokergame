const SYMBOLS = ["d", "c", "h", "s"];
const VALUES = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"]

class Deck {
    constructor(cards = newDeck()) {
        this.cards = cards
    }

    shuffle() {
        let numberOfCards = this.cards.length;  
    for (var i=0; i<numberOfCards; i++) {
      let j = Math.floor(Math.random() * numberOfCards);
      let tmp = this.cards[i];
      this.cards[i] = this.cards[j];
      this.cards[j] = tmp;
    }
    }
    
}

    class Card {
    constructor(symbol,value) {
        this.symbol = symbol;
        this.value = value;
        this.cardNumber = 0;
    }

    whichCard()
    {
        if(this.symbol === "c")
        {   
            if(this.value === "2")
            return this.cardNumber = 1;
            if(this.value === "3")
            return this.cardNumber = 2;
            if(this.value === "4")
            return this.cardNumber = 3;
            if(this.value === "5")
            return this.cardNumber = 4;
            if(this.value === "6")
            return this.cardNumber = 5;
            if(this.value === "7")
            return this.cardNumber = 6;
            if(this.value === "8")
            return this.cardNumber = 7;
            if(this.value === "9")
            return this.cardNumber = 8;
            if(this.value === "T")
            return this.cardNumber = 9;
            if(this.value === "J")
            return this.cardNumber = 10;
            if(this.value === "Q")
            return this.cardNumber = 11;
            if(this.value === "K")
            return this.cardNumber = 12;
            if(this.value === "A")
            return this.cardNumber = 13;
        }
        if(this.symbol === "d")
        {
            if(this.value === "2")
            return this.cardNumber = 14;
            if(this.value === "3")
            return this.cardNumber = 15;
            if(this.value === "4")
            return this.cardNumber = 16;
            if(this.value === "5")
            return this.cardNumber = 17;
            if(this.value === "6")
            return this.cardNumber = 18;
            if(this.value === "7")
            return this.cardNumber = 19;
            if(this.value === "8")
            return this.cardNumber = 20;
            if(this.value === "9")
            return this.cardNumber = 21;
            if(this.value === "T")
            return this.cardNumber = 22;
            if(this.value === "J")
            return this.cardNumber = 23;
            if(this.value === "Q")
            return this.cardNumber = 24;
            if(this.value === "K")
            return this.cardNumber = 25;
            if(this.value === "A")
            return this.cardNumber = 26;
        }
        if(this.symbol === "h")
        {
            if(this.value === "2")
            return this.cardNumber = 27;
            if(this.value === "3")
            return this.cardNumber = 28;
            if(this.value === "4")
            return this.cardNumber = 29;
            if(this.value === "5")
            return this.cardNumber = 30;
            if(this.value === "6")
            return this.cardNumber = 31;
            if(this.value === "7")
            return this.cardNumber = 32;
            if(this.value === "8")
            return this.cardNumber = 33;
            if(this.value === "9")
            return this.cardNumber = 34;
            if(this.value === "T")
            return this.cardNumber = 35;
            if(this.value === "J")
            return this.cardNumber = 36;
            if(this.value === "Q")
            return this.cardNumber = 37;
            if(this.value === "K")
            return this.cardNumber = 38;
            if(this.value === "A")
            return this.cardNumber = 39;
        }
        if(this.symbol === "s")
        {
            if(this.value === "2")
            return this.cardNumber = 40;
            if(this.value === "3")
            return this.cardNumber = 41;
            if(this.value === "4")
            return this.cardNumber = 42;
            if(this.value === "5")
            return this.cardNumber = 43;
            if(this.value === "6")
            return this.cardNumber = 44;
            if(this.value === "7")
            return this.cardNumber = 45;
            if(this.value === "8")
            return this.cardNumber = 46;
            if(this.value === "9")
            return this.cardNumber = 47;
            if(this.value === "T")
            return this.cardNumber = 48;
            if(this.value === "J")
            return this.cardNumber = 49;
            if(this.value === "Q")
            return this.cardNumber = 50;
            if(this.value === "K")
            return this.cardNumber = 51;
            if(this.value === "A")
            return this.cardNumber = 52;
        }
    }
}

function newDeck() {
    return SYMBOLS.flatMap(symbol => {
        return VALUES.map(value => {
            return new Card(symbol, value)
        })
    })
}

module.exports = Deck