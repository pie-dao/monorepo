import styles from "../styles/Button.module.scss";

const Button = ({
  className,
  children,
  gradient,
  large,
  inverted,
  href,
  ...rest
}) => {
  return (
    <a
      className={`${gradient ? styles.gradient : ""} ${
        inverted ? styles.inverted : ""
      } ${className ? className : ""} ${styles.button} cursor-pointer`}
      {...rest}
    >
      {children}
    </a>
  );
};

export default Button;
