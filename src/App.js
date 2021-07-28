import { useState } from "react";
import "./App.css";
import _ from "lodash";
import Card from "./components/Card";
import CardBack from "./components/CardBack";

//deck set-up

const cardMap = {
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  10: 10,
  J: 11,
  Q: 12,
  K: 13,
  A: 14,
};

const generateDecks = function () {
  const fullDeck = [];
  const suits = ["♠", "♣", "♥", "♦"];
  const values = [
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
    "A",
  ];

  for (const suit of suits) {
    for (const value of values) {
      fullDeck.push(suit + value);
    }
  }
  const fullDeckShuffed = _.shuffle(fullDeck);

  const midpoint = fullDeckShuffed.length / 2;

  const playerDeck = fullDeckShuffed.slice(0, midpoint);

  const computerDeck = fullDeckShuffed.slice(midpoint, fullDeckShuffed.length);

  return { playerDeck, computerDeck };
};

function App() {
  const { playerDeck, computerDeck } = generateDecks();

  //state management
  const [state, setState] = useState({
    playerDeck,
    computerDeck,
    gameStarted: false,
    showCards: false,
    roundWinner: null,
    overallWinner: null,
  });

  //to eventually be moved to a custom hook
  const determineWinner = function () {
    console.log("state at the beginning of determineWinner is", state);
    if (state.playerDeck.length === 0) {
      setState((prev) => ({ ...prev, overallWinner: "computer" }));
    }
    if (state.computerDeck.length === 0) {
      setState((prev) => ({ ...prev, overallWinner: "player" }));
    }

    const playerCard = state.playerDeck[0];
    const computerCard = state.computerDeck[0];

    const playerValue = Number(cardMap[playerCard.substring(1)]);
    const computerValue = Number(cardMap[computerCard.substring(1)]);
    console.log("playervalue", playerValue, computerValue);

    if (playerValue > computerValue) {
      setState((prev) => ({ ...prev, roundWinner: "player" }));
      console.log("player is the winner");
    } else {
      setState((prev) => ({
        ...prev,
        roundWinner: "computer",
      }));
      console.log("computer is the winner");
    }
  };

  const collectSpoils = function () {
    const playerCard = state.playerDeck[0];
    const computerCard = state.computerDeck[0];

    const updatedComputerDeck = [...state.computerDeck];
    const updatedPlayerDeck = [...state.playerDeck];

    if (state.roundWinner === "player") {
      //add the two cards to the end of the player deck and remove the played card
      updatedPlayerDeck.push(playerCard, computerCard);
      updatedPlayerDeck.shift();
      //remove the played card from computer deck

      updatedComputerDeck.shift();
    } else {
      updatedComputerDeck.push(playerCard, computerCard);
      updatedComputerDeck.shift();

      updatedPlayerDeck.shift();
    }
    setState((prev) => ({
      ...prev,
      playerDeck: updatedPlayerDeck,
      computerDeck: updatedComputerDeck,
      showCards: false,
    }));
    console.log(
      "updated player deck",
      updatedPlayerDeck,
      "updated computer deck",
      updatedComputerDeck
    );
  };

  const flipCard = function () {
    console.log("flipcard is firing");
    setState((prev) => ({
      ...prev,
      showCards: true,
      gameStarted: true,
    }));
    determineWinner();
  };

  const startGame = function () {
    setState((prev) => ({
      ...prev,
      gameStarted: true,
    }));
  };

  // console.log("winnder is", determineWinner("♥7", "♣4", state));

  if (state.overallWinner === "computer") {
    return <div>Computer wins!</div>;
  }
  if (state.overallWinner === "player") {
    return <div>Player wins!</div>;
  }
  if (!state.gameStarted) {
    return (
      <div>
        landing page
        <button onClick={startGame}>Start the game</button>
      </div>
    );
  }
  if (state.showCards) {
    return (
      <div className="flex">
        <button className="play-button" onClick={collectSpoils}>
          collect spoils
        </button>
        <div className="card-table">
          <div className={"card-grid"}>
            <CardBack
              deck={"computer"}
              cardsRemaining={state.computerDeck.length - 1}
            />
            <Card card={state.computerDeck[0]} />
          </div>
          <div className={"card-grid"}>
            <CardBack
              deck={"player"}
              cardsRemaining={state.playerDeck.length - 1}
            />
            <Card card={state.playerDeck[0]} />
          </div>
        </div>
        <div className="winner-announcement">
          <span className="round-winner">{state.roundWinner}</span>
          <br /> wins this round!
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <button className="play-button" onClick={flipCard}>
        flip the card
      </button>
      <div className="card-table">
        <div className={"card-grid"}>
          <CardBack
            deck={"computer"}
            cardsRemaining={state.computerDeck.length}
          />
        </div>
        <div className={"card-grid"}>
          <CardBack deck={"player"} cardsRemaining={state.playerDeck.length} />
        </div>
      </div>
    </div>
  );
}

export default App;
