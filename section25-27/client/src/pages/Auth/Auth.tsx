import { PropsWithChildren } from "react";
import styles from "./Auth.module.css";

const Auth = ({ children }: PropsWithChildren) => {
  return <section className={styles["auth-form"]}>{children}</section>;
};

export default Auth;
