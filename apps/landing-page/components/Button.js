import styles from "../styles/Button.module.scss";

const Button = (props) => {
  const { className, children, gradient, large, ...rest } = props;
  return (
    <button
      className={`${styles.button} ${gradient && styles.gradient} ${
        large && styles.lg
      } ${className && className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
