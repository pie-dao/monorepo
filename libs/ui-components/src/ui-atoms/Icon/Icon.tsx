import React, { FunctionComponent } from "react";
import { classNames } from "../../utils/class-names";
import { icons } from "../../shared/icons";

const Icon: FunctionComponent<Props> = ({
  icon,
  width = "20px",
  height = "20px",
  className,
  ...props
}: Props) => {
  return (
    <svg
      viewBox="0 0 1024 1024"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      className={classNames(
        "inline-block transform-gpu	align-middle fill-current",
        className
      )}
      {...props}
    >
      <path d={icons[icon]} />
    </svg>
  );
};

interface Props {
  width?: string;
  height?: string;
  className?: string;
  icon: keyof typeof icons;
}

export default Icon;
