export default function Card(props) {
  // const determineDeck = function () {
  //   if (props.deck === "COMPUTER") {
  //     return "computer-deck";
  //   }
  //   return "player-deck";
  // };
  return (
    <div className={"card-back"}>
      <div className={"card-back-design"}>
        <div className={"deck-label"}>{props.deck} Deck</div>
        <div className={"cards-remaining"}>
          {props.cardsRemaining} cards remaining
        </div>
      </div>
    </div>
  );
}
