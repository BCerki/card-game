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

  const createCardBody = function (value, suit) {
    if (value === "K") {
      return <span className="face-card">K</span>;
    }
    if (value === "Q") {
      return <span className="face-card">Q</span>;
    }
    if (value === "J") {
      return <span className="face-card">J</span>;
    }
    if (value === "A") {
      return <span className="face-card">{suit}</span>;
    }

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
      <div className={"card-body"}>{createCardBody(value, suit)}</div>
      <div className={"bottom-right"}>
        <div>{value}</div>

        <div>{suit}</div>
      </div>
    </div>
  );
}
