import { useState } from "react";

const SentimentCheck = () => {
  const [sentiment, setSentiment] = useState(null);
  return (
    <div className="flex flex-col border border-deeper_purple rounded-lg py-2 px-4 text-white">
      {sentiment === null ? (
        <div>
          <button type="button" onClick={() => setSentiment("positive")}>
            Pos
          </button>
          <button type="button" onClick={() => setSentiment("negative")}>
            Neg
          </button>
        </div>
      ) : (
        <div>
          <div>sentiment bar</div>
          <div>
            <p>vote positive</p>
            <p>icon</p>
            <p>vote negative</p>
          </div>
        </div>
      )}

      {sentiment === "positive" && <div></div>}
      {sentiment === "negative" && <div></div>}
    </div>
  );
};

export default SentimentCheck;
