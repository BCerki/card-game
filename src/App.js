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
  //real decks
  // const { playerDeck, computerDeck } = generateDecks();
  //stacked decks for testing
  const playerDeck = ["♠6", "♠8", "♥8"];
  const computerDeck = ["♠6", "♠8", "♥9"];

  //state management
  const [state, setState] = useState({
    playerDeck,
    computerDeck,
    gameStarted: false,
    showCards: false,
    roundWinner: null, //don't need an overall winner; use deck length
    warDeck: [],
  });
  console.log("state at beginning of app is", state);

  //gameplay functions
  const determineWinner = function () {
    console.log("state at the beginning of determineWinner is", state);

    const playerCard = state.playerDeck[0];
    const computerCard = state.computerDeck[0];

    const playerValue = Number(cardMap[playerCard.substring(1)]);
    const computerValue = Number(cardMap[computerCard.substring(1)]);
    console.log("playervalue", playerValue, computerValue);

    if (playerValue > computerValue) {
      setState((prev) => ({ ...prev, roundWinner: "player" }));
      console.log("player is the winner");
    } else if (playerValue < computerValue) {
      setState((prev) => ({
        ...prev,
        roundWinner: "computer",
      }));
      console.log("computer is the winner");
    } else {
      setState((prev) => ({
        ...prev,
        roundWinner: "tie",
      }));
      console.log("tie");
    }
  };

  const handleWinnings = function () {
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
      setState((prev) => ({
        ...prev,
        playerDeck: updatedPlayerDeck,
        computerDeck: updatedComputerDeck,
        showCards: false,
      }));
    }
    if (state.roundWinner === "computer") {
      updatedComputerDeck.push(playerCard, computerCard);
      updatedComputerDeck.shift();

      updatedPlayerDeck.shift();

      setState((prev) => ({
        ...prev,
        playerDeck: updatedPlayerDeck,
        computerDeck: updatedComputerDeck,
        showCards: false,
      }));
    }
    if (state.roundWinner === "tie") {
      updatedComputerDeck.shift();
      updatedPlayerDeck.shift();

      const warDeck = [playerCard, computerCard];

      //pulled in from determine winner since state change is async

      const playerValue = Number(cardMap[updatedPlayerDeck[0].substring(1)]);
      const computerValue = Number(
        cardMap[updatedComputerDeck[0].substring(1)]
      );

      if (playerValue > computerValue) {
        setState((prev) => ({
          ...prev,
          playerDeck: updatedPlayerDeck.concat(warDeck),
          computerDeck: updatedComputerDeck,
          roundWinner: "player",
          warDeck: [],
        }));
      } else if (playerValue < computerValue) {
        setState((prev) => ({
          ...prev,
          playerDeck: updatedPlayerDeck,
          computerDeck: updatedComputerDeck.concat(warDeck),
          roundWinner: "computer",
          warDeck: [],
        }));
      } else {
        setState((prev) => ({
          ...prev,
          playerDeck: updatedPlayerDeck,
          computerDeck: updatedComputerDeck,
          roundWinner: "tie",
        }));
      }
    }
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

  //jsx functions
  const chooseButton = function () {
    if (state.showCards) {
      return (
        <button className="play-button" onClick={handleWinnings}>
          {state.roundWinner === "player"
            ? "Collect the winnings"
            : "Reluctantly give up the winnings"}
        </button>
      );
    }
    return (
      <button className="play-button" onClick={flipCard}>
        Charge!
      </button>
    );
  };

  // console.log("winnder is", determineWinner("♥7", "♣4", state));

  if (state.playerDeck.length === 0) {
    return <div>Computer wins!</div>;
  }
  if (state.computerDeck.length === 0) {
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

  if (state.roundWinner === "tie") {
    return (
      <div className="flex">
        <button className="play-button" onClick={handleWinnings}>
          War!
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
          <span className="round-winner">{state.roundWinner}!</span>
        </div>
      </div>
    );
  }

  if (state.showCards) {
    return (
      <div className="flex">
        <div className="play-button">{chooseButton()}</div>
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
          wins!
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <div className="play-button">
        <button className="play-button" onClick={flipCard}>
          Charge!
        </button>
      </div>
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
