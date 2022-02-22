import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import styles from "../styles/SentimentCheck.module.scss";
import positiveImg from "../public/positive.svg";
import negativeImg from "../public/negative.svg";
import content from "../content/en_EN.json";

const SentimentCheck = ({ positive, negative }) => {
  const [sentiment, setSentiment] = useState(null);
  const [positiveValue, setPositiveValue] = useState(positive.amount);
  const [negativeValue, setNegativeValue] = useState(negative.amount);
  const [positivePercent, setPositivePercent] = useState(positive.percentage);
  const [negativePercent, setNegativePercent] = useState(negative.percentage);

  const router = useRouter();

  const calculateSentimentPercentage = () => {
    const total = positiveValue + negativeValue;
    const positivePercentage = (positiveValue / total) * 100;
    const negativePercentage = (negativeValue / total) * 100;
    return { positivePercentage, negativePercentage };
  };

  const handleSentiment = async (sentiment) => {
    const { positivePercentage, negativePercentage } =
      calculateSentimentPercentage();
    if (sentiment === "positive") {
      setPositiveValue(positiveValue + 1);
      setPositivePercent(positivePercentage.toFixed());
    }
    if (sentiment === "negative") {
      setNegativeValue(negativeValue + 1);
      setNegativePercent(negativePercentage.toFixed());
    }
    setSentiment(sentiment);
    await sentimentPost(sentiment);
  };

  const sentimentPost = async (sentiment) => {
    fetch(`/api/postSentiment?sentiment=${sentiment}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center border border-deeper_purple rounded-lg py-4 px-4 text-white">
      {sentiment === null ? (
        <div className="flex flex-wrap w-full gap-y-4">
          <div className={`${styles.barGradient}`}></div>
          <div className="flex w-1/2 justify-center items-center">
            <button
              type="button"
              className="positive"
              onClick={() => handleSentiment("positive")}
              id="sentiment-positive"
            >
              <Image src={positiveImg} alt="positive" />
            </button>
          </div>
          <div className="flex w-1/2 justify-center items-center">
            <button
              type="button"
              className="negative"
              onClick={() => handleSentiment("negative")}
              id="sentiment-negative"
            >
              <Image src={negativeImg} alt="negative" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap w-full gap-y-4">
          <div
            style={
              positivePercent && negativePercent
                ? {
                    background: `linear-gradient(to right, #1bd10b ${positivePercent}%, #D7099C ${negativePercent}%)`,
                  }
                : ""
            }
            className={styles.barGradient}
          ></div>
          <div className="flex items-center w-full justify-center">
            <div className="w-1/3 flex ">
              <div className="flex flex-col w-full items-center justify-center text-sm">
                <span className="text-[#1bd10b] font-bold">
                  {positivePercent}%
                </span>
                <span className="text-deep_purple uppercase">
                  {positiveValue} {content.subcharts.sentiment.votes}
                </span>
              </div>
            </div>
            <div className="w-1/3 flex items-center justify-center">
              <Image
                src={sentiment === "positive" ? positiveImg : negativeImg}
                alt={sentiment}
              />
            </div>
            <div className="w-1/3 flex">
              <div className="flex flex-col w-full items-center justify-center text-sm">
                <span className="text-[#D7099C] font-bold">
                  {negativePercent}%
                </span>
                <span className="text-deep_purple uppercase">
                  {negativeValue} {content.subcharts.sentiment.votes}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SentimentCheck;
