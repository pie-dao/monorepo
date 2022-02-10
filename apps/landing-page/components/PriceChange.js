import Image from "next/image";
import arrowIconGreen from "../public/arrow_icon_green.svg";
import arrowIconRed from "../public/arrow_icon_red.svg";

const PriceChange = ({ priceChangeUsd }) => {
  const usdDayChange = priceChangeUsd.toFixed(2);
  return priceChangeUsd > 0 ? (
    <>
      <span className="text-light_green mr-1">+{usdDayChange}%</span>
      <Image src={arrowIconGreen} alt="arrow up" />
    </>
  ) : priceChangeUsd === 0 ? (
    `0%`
  ) : (
    <>
      <span className="text-highlight mr-1">{usdDayChange}%</span>
      <Image src={arrowIconRed} alt="arrow down" />
    </>
  );
};

export default PriceChange;
