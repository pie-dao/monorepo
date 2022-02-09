import styles from "../styles/Button.module.scss";

const Button = ({
  className,
  children,
  gradient,
  large,
  inverted,
  ...rest
}) => {
  return (
    <a
      className={`${gradient ? styles.gradient : ""} ${
        inverted ? styles.inverted : ""
      } ${className ? className : ""} ${styles.button} px-8 cursor-pointer`}
      {...rest}
    >
      {children}
    </a>
  );
};

export default Button;
