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

  const createCardBody = function (suit) {
    let result = [];
    for (let i = 0; i < value; i++) {
      result.push(suit);
    }
    return (
      <>
        {result.map((suit) => (
          <div>{suit}</div>
        ))}
      </>
    );
  };

  return (
    <div className={"card-face " + determineColor()}>
      <div className={"top-left"}>
        <div>{value}</div>

        <div>{suit}</div>
      </div>
      <div className={"card-body"}>{createCardBody(suit)}</div>
      <div className={"bottom-right"}>
        <div>{value}</div>

        <div>{suit}</div>
      </div>
    </div>
  );
}
