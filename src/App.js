import { useState } from "react";
import "./App.css";
import _ from "lodash";
import Card from "./components/Card";

//functions
const generateDecks = function () {
  const fullDeck = [];
  const suits = ["♠", "♣", "♥", "♦"];
  const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

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

    const playerValue = Number(playerCard.substring(1));
    const computerValue = Number(computerCard.substring(1));

    console.log(
      "player value is",
      playerValue,
      "computer value is",
      computerValue
    );

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
        <button onClick={startGame}>Start the game</button>
      </div>
    );
  }
  if (state.showCards) {
    return (
      <div>
        <h1>Computer card is: {state.computerDeck[0]}</h1>
        <h1>player card is: {state.playerDeck[0]}</h1>
        <h1>{state.roundWinner} wins this round!</h1>
        <button onClick={collectSpoils}>collect spoils</button>
      </div>
    );
  }

  return (
    <div>
      <h1>
        Player has {state.playerDeck.length} cards left; computer has{" "}
        {state.computerDeck.length}
      </h1>

      <button onClick={flipCard}>flip the card</button>
    </div>
  );
}

export default App;
