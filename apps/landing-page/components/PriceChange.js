import Image from "next/image";
import arrowIconGreen from "../public/arrow_icon_green.svg";
import arrowIconRed from "../public/arrow_icon_red.svg";

const PriceChange = ({ priceChange }) => {
  const priceChangeUsd = priceChange.toFixed(2);
  return priceChange > 0 ? (
    <>
      <span className="text-light_green mr-1">+{priceChangeUsd}%</span>
      <Image lazyBoundary="325px" src={arrowIconGreen} alt="arrow up" />
    </>
  ) : priceChange === 0 ? (
    `0%`
  ) : (
    <>
      <span className="text-highlight mr-1">{priceChangeUsd}%</span>
      <Image lazyBoundary="325px" src={arrowIconRed} alt="arrow down" />
    </>
  );
};

export default PriceChange;
