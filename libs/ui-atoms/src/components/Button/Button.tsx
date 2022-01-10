import React from "react";
import "./button.css";

export interface ButtonProps  {
  /**
   * Is this the principal call to action on the page?
   */
  primary?: boolean;
  /**
   * What background color to use
   */
  backgroundColor?: string;
  /**
   * How large should the button be?
   */
  size?: "small" | "medium" | "large";
  /**
   * Button contents
   */
  label: string;
  /**
   * Optional click handler
   */
  onClick?: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
};

/**
 * Primary UI component for user interaction
 */
const Button = ({
  primary = true,
  backgroundColor,
  size = "medium",
  onClick,
  label,
}: ButtonProps) => {
  const mode = primary
    ? "text-lg leading-6 dark:bg-gray-800 text-sky-500 dark:text-sky-400"
    : "storybook-button--secondary";
  return (
    <button
      type="button"
      className={`text-lime-400 text-lg leading-6 dark:bg-gray-800 text-sky-500 dark:text-sky-400`}
      style={backgroundColor ? { backgroundColor }: {}}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default Button;