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
  const { playerDeck, computerDeck } = generateDecks();
  //stacked decks for testing
  // const computerDeck = ["♠10", "♠7", "♥Q", "♥K"];
  // const playerDeck = ["♠6", "♠7", "♥8", "♥9"];

  //state management
  const [state, setState] = useState({
    playerDeck,
    computerDeck,
    gameStarted: false,
    showCards: false,
    roundWinner: null, //don't need an overall winner; use deck length
    warDeck: [],
    destination: null, //post-hackathon: do this with react router instead
  });
  console.log("state.destination is", state.destination);
  // console.log("state at beginning of app is", state);

  //gameplay functions
  const determineWinner = function () {
    // console.log("state at the beginning of determineWinner is", state);

    //convenience variables for currently played card
    const playerCard = state.playerDeck[0];
    const computerCard = state.computerDeck[0];

    const playerValue = Number(cardMap[playerCard.substring(1)]);
    const computerValue = Number(cardMap[computerCard.substring(1)]);

    //set the winner of the round based on card value
    let roundWinner = null;

    if (playerValue > computerValue) {
      roundWinner = "PLAYER";
    }
    if (playerValue < computerValue) {
      roundWinner = "COMPUTER";
    }
    if (playerValue === computerValue) {
      roundWinner = "TIE";
    }
    //put the winner into state
    setState((prev) => ({
      ...prev,
      roundWinner: roundWinner,
    }));
  };

  const handleWinnings = function () {
    //make copies of all the decks in state--will be added and subtracted to depending on winner
    const updatedComputerDeck = [...state.computerDeck];
    const updatedPlayerDeck = [...state.playerDeck];
    const updatedWarDeck = [...state.warDeck];

    //remove the played cards from the player and computer decks and put in a temp deck
    updatedWarDeck.push(state.playerDeck[0], state.computerDeck[0]);
    updatedPlayerDeck.shift();
    updatedComputerDeck.shift();

    if (state.roundWinner === "PLAYER") {
      setState((prev) => ({
        ...prev,
        playerDeck: updatedPlayerDeck.concat(updatedWarDeck),
        computerDeck: updatedComputerDeck,
        showCards: false,
        warDeck: [],
      }));
    }
    if (state.roundWinner === "COMPUTER") {
      setState((prev) => ({
        ...prev,

        playerDeck: updatedPlayerDeck,
        computerDeck: updatedComputerDeck.concat(updatedWarDeck),
        showCards: false,
        warDeck: [],
      }));
    }
    if (state.roundWinner === "TIE") {
      setState((prev) => ({
        ...prev,
        playerDeck: updatedPlayerDeck,
        computerDeck: updatedComputerDeck,
        warDeck: updatedWarDeck,
      }));
    }
  };

  const war = function () {
    //post-hackathon: DRY this up, repetitive of previous two functions
    const updatedComputerDeck = [...state.computerDeck];
    const updatedPlayerDeck = [...state.playerDeck];
    const updatedWarDeck = [...state.warDeck];

    //convenience variables for currently played card
    let playerCard = updatedPlayerDeck[0];
    let computerCard = updatedComputerDeck[0];
    // console.log("player card is", playerCard, computerCard);

    //remove the played cards from the player and computer decks and put in a temp deck
    updatedWarDeck.push(playerCard, computerCard);
    updatedPlayerDeck.shift();
    updatedComputerDeck.shift();

    playerCard = updatedPlayerDeck[0];
    computerCard = updatedComputerDeck[0];
    // console.log("player card is", playerCard, computerCard);

    const playerValue = Number(cardMap[playerCard.substring(1)]);
    const computerValue = Number(cardMap[computerCard.substring(1)]);

    if (playerValue > computerValue) {
      setState((prev) => ({
        ...prev,
        roundWinner: "COMPUTER",
        playerDeck: updatedPlayerDeck,
        computerDeck: updatedComputerDeck,
        warDeck: updatedWarDeck,
      }));
    }
    if (playerValue < computerValue) {
      setState((prev) => ({
        ...prev,
        roundWinner: "COMPUTER",
        playerDeck: updatedPlayerDeck,
        computerDeck: updatedComputerDeck,
        warDeck: updatedWarDeck,
      }));
    }
    if (playerValue === computerValue) {
      setState((prev) => ({
        ...prev,
        playerDeck: updatedPlayerDeck,
        computerDeck: updatedComputerDeck,
        warDeck: updatedWarDeck,
      }));
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

  ////post-hackathon: do this with react router
  const redirect = function (destination) {
    console.log("destination is", destination);
    setState((prev) => ({ ...prev, destination: destination }));
  };

  //CONDITIONAL RENDERING STARTS
  //post-hackathon: DRY these up, make separate components
  //game over views

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
  //landing view
  if (!state.gameStarted && state.destination === null) {
    return (
      <div className="landing">
        <div className="war">War</div>
        <div className="button-group">
          <button className="start" onClick={startGame}>
            Start game
          </button>
          <button onClick={() => redirect("rules")}>Rules</button>
          <button onClick={() => redirect("about")}>About</button>
        </div>
      </div>
    );
  }

  if (state.destination === "rules") {
    return (
      <div className="text-page">
        <h1 className="rules">Rules</h1>
        <p className="rules">
          In this version of the classic card game War, you'll take on your
          computer. Once you've started the game, click the "Flip Card" button
          to start the first battle. Whoever has the higher card wins both cards
          (ace is high, and suits are irrelevant). If you win, click the
          "Collect Winnings" button to add the cards to your deck. If you lose,
          click the "Give Up Winnings" button to give your cards to the
          computer.
        </p>
        <p className="rules">
          If you and the computer have the same card, it's WAR! Click the "WAR!"
          button to keep flipping cards until the tie ends and either you or the
          computer has a higher card. If you win a war, you win the entire stack
          of cards that was part of the war.
        </p>
        <p className="rules">
          The game ends when either you or the computer runs out of cards. The
          player with the whole deck wins. Good luck!
        </p>
        <div className="back">
          <button onClick={() => redirect(null)}>Back to home page</button>
        </div>
      </div>
    );
  }

  if (state.destination === "about") {
    return (
      <div className="text-page">
        <h1 className="about">About</h1>

        <p className="rules">
          Welcome! My name is Brianna and I live in Victoria, BC. I made this
          game during Mintbean's{" "}
          <a href="https://mintbean.io/meets/7e2331fb-1e0d-4b31-86b9-a46acad877af">
            Hiring Hackathon for Jr Web Devs
          </a>{" "}
          . I hope you enjoy it! You can learn more about me and my work on{" "}
          <a href="https://www.linkedin.com/in/brianna-cerkiewicz-26156063/">
            LinkedIn
          </a>{" "}
          or <a href="https://github.com/BCerki/">Github</a>.
        </p>
        <p className="rules"></p>
        <div className="back">
          <button className="back" onClick={() => redirect(null)}>
            Back to home page
          </button>
        </div>
      </div>
    );
  }

  //GAME VIEWS
  //tie view
  if (state.roundWinner === "TIE") {
    return (
      <>
        <div className="flex">
          <div className="play-button">
            <button className="play-button" onClick={war}>
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
  //flipped cards view
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
        <div className="winner-announcement">
          {state.roundWinner} wins this round!
        </div>
      </>
    );
  }
  //non-flipped cards view
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
