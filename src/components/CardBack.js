export default function Card(props) {
  return (
    <div className={"card-back"}>
      <div className={"deck-label"}>{props.deck} Deck</div>
      <div className={"cards-remaining"}>
        {props.cardsRemaining} cards remaining
      </div>
    </div>
  );
}
