import { useState } from "react";
import Image from "next/image";
import styles from "../styles/SentimentCheck.module.scss";
import positive from "../public/positive.svg";
import negative from "../public/negative.svg";
import content from "../content/en_EN.json";

const SentimentCheck = () => {
  const [sentiment, setSentiment] = useState(null);
  return (
    <div className="flex flex-col h-24 items-center justify-center border border-deeper_purple rounded-lg py-4 px-4 text-white">
      {sentiment === null ? (
        <div className="flex flex-wrap w-full gap-y-4">
          <div className={`${styles.barGradient}`}></div>
          <div className="flex w-1/2 justify-center items-center">
            <button
              type="button"
              className="positive"
              onClick={() => setSentiment("positive")}
            >
              <Image src={positive} alt="positive" />
            </button>
          </div>
          <div className="flex w-1/2 justify-center items-center">
            <button
              type="button"
              className="negative"
              onClick={() => setSentiment("negative")}
            >
              <Image src={negative} alt="negative" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center">
          {sentiment === "positive" && (
            <p className="text-xl text-white">
              {content.subcharts.sentiment.positive}
            </p>
          )}
          {sentiment === "negative" && (
            <p className="text-xl text-white">
              {content.subcharts.sentiment.negative}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default SentimentCheck;
