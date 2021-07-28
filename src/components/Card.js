export default function Card(props) {
  const value = props.card.substring(1);
  const suit = props.card.substring(0, 1);

  const determineColor = function () {
    if (suit === "♣" || suit === "♠") {
      return "black-suit";
    } else {
      return "red-suit";
    }
  };
  return (
    <div className={"card-face " + determineColor()}>
      {value}
      {suit}
    </div>
  );
}
