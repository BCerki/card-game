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
    roundWinner: null,
    overallWinner: null,
  });

  //to eventually be moved to a custom hook
  const determineWinner = function (playerCard, computerCard) {
    if (state.playerDeck.length === 0) {
      setState((prev) => ({ ...prev, overallWinner: "computer" }));
    }
    if (state.computerDeck.length === 0) {
      setState((prev) => ({ ...prev, overallWinner: "player" }));
    }

    const playerValue = playerCard.substring(1);
    const computerValue = computerCard.substring(1);

    console.log(
      "player value is",
      playerValue,
      "computer value is",
      computerValue
    );

    if (playerValue > computerValue) {
      //add the two cards to the end of the player deck and remove the played card
      const updatedPlayerDeck = [...state.playerDeck, playerCard, computerCard];
      updatedPlayerDeck.shift();
      //remove the played card from computer deck
      const updatedComputerDeck = [...state.computerDeck];
      updatedComputerDeck.shift();

      console.log(updatedPlayerDeck, updatedComputerDeck);

      setState((prev) => ({
        ...prev,
        playerDeck: updatedPlayerDeck,
        computerDeck: updatedComputerDeck,
        roundWinner: "player",
      }));
    } else {
      const updatedPlayerDeck = [...state.playerDeck];
      updatedPlayerDeck.shift();

      const updatedComputerDeck = [
        ...state.computerDeck,
        computerCard,
        playerCard,
      ];
      updatedComputerDeck.shift();

      setState((prev) => ({
        ...prev,
        playerDeck: updatedPlayerDeck,
        computerDeck: updatedComputerDeck,
        roundWinner: "computer",
      }));
    }
  };

  console.log("after played card state", state);

  const flipCard = function () {
    console.log("flipcard is firing");
    determineWinner(state.playerDeck[0], state.computerDeck[0]);
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

  return (
    <div>
      <h1>computer card is: {state.computerDeck[0]}</h1>
      <h1>player card is: {state.playerDeck[0]}</h1>
      <h1>{state.roundWinner} wins this round!</h1>

      <button onClick={flipCard}>flip the card</button>
    </div>
  );
}

export default App;
