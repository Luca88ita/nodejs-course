import { PropsWithChildren } from "react";
import styles from "./Toolbar.module.css";

const Toolbar = ({ children }: PropsWithChildren) => {
  return <div className={styles.toolbar}>{children}</div>;
};

export default Toolbar;
