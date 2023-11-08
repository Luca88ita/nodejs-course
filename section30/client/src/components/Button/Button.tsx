import { PropsWithChildren } from "react";
import { Link } from "react-router-dom";
import styles from "./Button.module.css";

interface Props extends PropsWithChildren {
  link?: string;
  design?: string;
  mode?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit" | "reset" | undefined;
}

const Button = ({
  link,
  design,
  mode,
  onClick,
  disabled,
  loading,
  type,
  children,
}: Props) =>
  !link ? (
    <button
      className={`${styles.button} ${styles["button--" + design]} ${
        styles["button" + mode]
      }`}
      onClick={onClick}
      disabled={disabled || loading}
      type={type}
    >
      {loading ? "Loading..." : children}
    </button>
  ) : (
    <Link
      className={`${styles.button} ${styles["button--" + design]} ${
        styles["button" + mode]
      }`}
      to={link}
    >
      {children}
    </Link>
  );

export default Button;
