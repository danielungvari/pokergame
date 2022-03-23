export default function displayCard(placeHolder,num) {
    placeHolder = document.getElementById(placeHolder);
    placeHolder.classList.add("card");
    switch(num)
    {
    case 0:
        placeHolder.style.backgroundImage = "url('$__dirname/../assets/deck/back.png')";
        break;
    case 1:
        placeHolder.style.backgroundImage = "url('$__dirname/../assets/deck/2_of_clubs.png')";
        break;
    case 2:
        placeHolder.style.backgroundImage = "url('$__dirname/../assets/deck/3_of_clubs.png')";
        break;
    case 3:
        placeHolder.style.backgroundImage = "url('$__dirname/../assets/deck/4_of_clubs.png')";
        break;
    case 4:
        placeHolder.style.backgroundImage = "url('$__dirname/../assets/deck/5_of_clubs.png')";
        break;
    case 5:
        placeHolder.style.backgroundImage = "url('$__dirname/../assets/deck/6_of_clubs.png')";
        break;
    case 6:
        placeHolder.style.backgroundImage = "url('$__dirname/../assets/deck/7_of_clubs.png')";
        break;
    case 7:
        placeHolder.style.backgroundImage = "url('$__dirname/../assets/deck/8_of_clubs.png')";
        break;
    case 8:
        placeHolder.style.backgroundImage = "url('$__dirname/../assets/deck/9_of_clubs.png')";
        break;
    case 9:
        placeHolder.style.backgroundImage = "url('$__dirname/../assets/deck/10_of_clubs.png')";
        break;
    case 10:
        placeHolder.style.backgroundImage = "url('$__dirname/../assets/deck/jack_of_clubs2.png')";
        break;
    case 11:
        placeHolder.style.backgroundImage = "url('$__dirname/../assets/deck/queen_of_clubs2.png')";
        break;
    case 12:
        placeHolder.style.backgroundImage = "url('$__dirname/../assets/deck/king_of_clubs2.png')";
        break;
    case 13:
        placeHolder.style.backgroundImage = "url('$__dirname/../assets/deck/ace_of_clubs.png')";
        break;
    case 14:
        placeHolder.style.backgroundImage = "url('$__dirname/../assets/deck/2_of_diamonds.png')";
        break;
    case 15:
        placeHolder.style.backgroundImage = "url('$__dirname/../assets/deck/3_of_diamonds.png')";
        break;
    case 16:
        placeHolder.style.backgroundImage = "url('$__dirname/../assets/deck/4_of_diamonds.png')";
        break;
    case 17:
        placeHolder.style.backgroundImage = "url('$__dirname/../assets/deck/5_of_diamonds.png')";
        break;
    case 18:
        placeHolder.style.backgroundImage = "url('$__dirname/../assets/deck/6_of_diamonds.png')";
        break;
    case 19:
        placeHolder.style.backgroundImage = "url('$__dirname/../assets/deck/7_of_diamonds.png')";
        break;
    case 20:
        placeHolder.style.backgroundImage = "url('$__dirname/../assets/deck/8_of_diamonds.png')";
        break;
    case 21:
        placeHolder.style.backgroundImage = "url('$__dirname/../assets/deck/9_of_diamonds.png')";
        break;
    case 22:
        placeHolder.style.backgroundImage = "url('$__dirname/../assets/deck/10_of_diamonds.png";
        break;
    case 23:
        placeHolder.style.backgroundImage = "url('$__dirname/../assets/deck/jack_of_diamonds2.png";
        break;
    case 24:
        placeHolder.style.backgroundImage = "url('$__dirname/../assets/deck/queen_of_diamonds2.png";
        break;
    case 25:
        placeHolder.style.backgroundImage = "url('$__dirname/../assets/deck/king_of_diamonds2.png";
        break;
    case 26:
        placeHolder.style.backgroundImage = "url('$__dirname/../assets/deck/ace_of_diamonds.png";
        break;
    case 27:
        placeHolder.style.backgroundImage = "url('$__dirname/../assets/deck/2_of_hearts.png";
        break;
    case 28:
        placeHolder.style.backgroundImage = "url('$__dirname/../assets/deck/3_of_hearts.png";
        break;
    case 29:
        placeHolder.style.backgroundImage = "url('$__dirname/../assets/deck/4_of_hearts.png";
        break;
    case 30:
        placeHolder.style.backgroundImage = "url('$__dirname/../assets/deck/5_of_hearts.png";
        break;
    case 31:
        placeHolder.style.backgroundImage = "url('$__dirname/../assets/deck/6_of_hearts.png";
        break;
    case 32:
        placeHolder.style.backgroundImage = "url('$__dirname/../assets/deck/7_of_hearts.png";
        break;
    case 33:
        placeHolder.style.backgroundImage = "url('$__dirname/../assets/deck/8_of_hearts.png";
        break;
    case 34:
        placeHolder.style.backgroundImage = "url('$__dirname/../assets/deck/9_of_hearts.png";
        break;
    case 35:
        placeHolder.style.backgroundImage = "url('$__dirname/../assets/deck/10_of_hearts.png";
        break;
    case 36:
        placeHolder.style.backgroundImage = "url('$__dirname/../assets/deck/jack_of_hearts2.png";
        break;
    case 37:
        placeHolder.style.backgroundImage = "url('$__dirname/../assets/deck/queen_of_hearts2.png";
        break;
    case 38:
        placeHolder.style.backgroundImage = "url('$__dirname/../assets/deck/king_of_hearts2.png";
        break;
    case 39:
        placeHolder.style.backgroundImage = "url('$__dirname/../assets/deck/ace_of_hearts.png";
        break;
    case 40:
        placeHolder.style.backgroundImage = "url('$__dirname/../assets/deck/2_of_spades.png";
        break;
    case 41:
        placeHolder.style.backgroundImage = "url('$__dirname/../assets/deck/3_of_spades.png";
        break;
    case 42:
        placeHolder.style.backgroundImage = "url('$__dirname/../assets/deck/4_of_spades.png";
        break;
    case 43:
        placeHolder.style.backgroundImage = "url('$__dirname/../assets/deck/5_of_spades.png";
        break;
    case 44:
        placeHolder.style.backgroundImage = "url('$__dirname/../assets/deck/6_of_spades.png";
        break;
    case 45:
        placeHolder.style.backgroundImage = "url('$__dirname/../assets/deck/7_of_spades.png";
        break;
    case 46:
        placeHolder.style.backgroundImage = "url('$__dirname/../assets/deck/8_of_spades.png";
        break;
    case 47:
        placeHolder.style.backgroundImage = "url('$__dirname/../assets/deck/9_of_spades.png";
        break;
    case 48:
        placeHolder.style.backgroundImage = "url('$__dirname/../assets/deck/10_of_spades.png";
        break;
    case 49:
        placeHolder.style.backgroundImage = "url('$__dirname/../assets/deck/jack_of_spades2.png";
        break;
    case 50:
        placeHolder.style.backgroundImage = "url('$__dirname/../assets/deck/queen_of_spades2.png";
        break;
    case 51:
        placeHolder.style.backgroundImage = "url('$__dirname/../assets/deck/king_of_spades2.png";
        break;
    case 52:
        placeHolder.style.backgroundImage = "url('$__dirname/../assets/deck/ace_of_spades.png";
        break;
    }
};
