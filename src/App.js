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
  const computerDeck = ["♠6", "♠8", "♥8"];
  const playerDeck = ["♠6", "♠8", "♥9"];

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
    // console.log("playervalue", playerValue, computerValue);

    if (playerValue > computerValue) {
      setState((prev) => ({ ...prev, roundWinner: "PLAYER" }));
      // console.log("player is the winner");
    } else if (playerValue < computerValue) {
      setState((prev) => ({
        ...prev,
        roundWinner: "COMPUTER",
      }));
      // console.log("computer is the winner");
    } else {
      setState((prev) => ({
        ...prev,
        roundWinner: "TIE",
      }));
      // console.log("tie");
    }
  };

  const handleWinnings = function () {
    console.log("state at beginning of handlewinning is", state);
    const playerCard = state.playerDeck[0];
    const computerCard = state.computerDeck[0];

    const updatedComputerDeck = [...state.computerDeck];
    const updatedPlayerDeck = [...state.playerDeck];
    const updatedWarDeck = [...state.warDeck];

    if (state.roundWinner === "PLAYER") {
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
    if (state.roundWinner === "COMPUTER") {
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
    if (state.roundWinner === "TIE") {
      updatedComputerDeck.shift();
      updatedPlayerDeck.shift();
      updatedWarDeck.push(playerCard, computerCard);
      console.log("updatedwardeck is", updatedWarDeck);

      //pulled in from determine winner since state change is async

      const playerValue = Number(cardMap[updatedPlayerDeck[0].substring(1)]);
      const computerValue = Number(
        cardMap[updatedComputerDeck[0].substring(1)]
      );

      if (playerValue > computerValue) {
        setState((prev) => ({
          ...prev,
          playerDeck: updatedPlayerDeck.concat(updatedWarDeck),
          computerDeck: updatedComputerDeck,
          roundWinner: "PLAYER",
          warDeck: [],
        }));
      } else if (playerValue < computerValue) {
        setState((prev) => ({
          ...prev,
          playerDeck: updatedPlayerDeck,
          computerDeck: updatedComputerDeck.concat(updatedWarDeck),
          roundWinner: "COMPUTER",
          warDeck: [],
        }));
      } else {
        console.log("setting wardeck state here");
        setState((prev) => ({
          ...prev,
          warDeck: updatedWarDeck,
          playerDeck: updatedPlayerDeck,
          computerDeck: updatedComputerDeck,
          roundWinner: "TIE",
        }));
      }
    }
  };

  const flipCard = function () {
    // console.log("flipcard is firing");
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
          {state.roundWinner === "PLAYER"
            ? "Collect winnings"
            : "Give up winnings"}
        </button>
      );
    }
    return (
      <button className="play-button" onClick={flipCard}>
        Flip Card
      </button>
    );
  };

  // console.log("winnder is", determineWinner("♥7", "♣4", state));

  if (state.playerDeck.length === 0) {
    return (
      <div className="game-over">
        Game over! <div className="winner">Computer wins!</div>
      </div>
    );
  }
  if (state.computerDeck.length === 0) {
    return (
      <div className="game-over">
        Game over! <div className="winner">Player wins!</div>
      </div>
    );
  }
  if (!state.gameStarted) {
    return (
      <div className="landing">
        <div className="war">War</div>

        <button className="start" onClick={startGame}>
          Start game
        </button>
        {/* <div className="credits">
          Photo by{" "}
          <a href="https://unsplash.com/@birminghammuseumstrust?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
            Birmingham Museums Trust
          </a>{" "}
          on{" "}
          <a href="https://unsplash.com/s/photos/war?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
            Unsplash
          </a>
        </div> */}
      </div>
    );
  }

  if (state.roundWinner === "TIE") {
    return (
      <>
        <div className="flex">
          <div className="play-button">
            <button className="play-button" onClick={handleWinnings}>
              War!
            </button>
          </div>
          <div className="card-table">
            <div className={"card-grid"}>
              <CardBack
                deck={"COMPUTER"}
                cardsRemaining={state.computerDeck.length - 1}
              />

              <Card card={state.computerDeck[0]} />
            </div>
            <div className={"card-grid"}>
              <CardBack
                deck={"PLAYER"}
                cardsRemaining={state.playerDeck.length - 1}
              />
              <Card card={state.playerDeck[0]} />
            </div>
          </div>
        </div>
        <div className="winner-announcement">
          <span className="round-winner">
            {state.roundWinner}! This means WAR!
          </span>
        </div>
      </>
    );
  }

  if (state.showCards) {
    return (
      <>
        <div className="flex">
          <div className="play-button">{chooseButton()}</div>
          <div className="card-table">
            <div className={"card-grid"}>
              <CardBack
                deck={"COMPUTER"}
                cardsRemaining={state.computerDeck.length - 1}
              />
              <Card card={state.computerDeck[0]} />
            </div>
            <div className={"card-grid"}>
              <CardBack
                deck={"PLAYER"}
                cardsRemaining={state.playerDeck.length - 1}
              />
              <Card card={state.playerDeck[0]} />
            </div>
          </div>
        </div>
        <div className="winner-announcement">{state.roundWinner} wins!</div>
      </>
    );
  }

  return (
    <div className="flex">
      <div className="play-button">
        <button className="play-button" onClick={flipCard}>
          Flip Card
        </button>
      </div>
      <div className="card-table">
        <div className={"card-grid"}>
          <CardBack
            deck={"COMPUTER"}
            cardsRemaining={state.computerDeck.length}
          />
        </div>
        <div className={"card-grid"}>
          <CardBack deck={"PLAYER"} cardsRemaining={state.playerDeck.length} />
        </div>
      </div>
    </div>
  );
}

export default App;
