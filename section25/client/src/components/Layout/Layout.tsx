import { PropsWithChildren, ReactElement } from "react";
import styles from "./Layout.module.css";

interface Props extends PropsWithChildren {
  header: ReactElement;
  mobileNav: ReactElement;
}
const layout = ({ header, mobileNav, children }: Props) => {
  return (
    <>
      <header className={styles["main-header"]}>{header}</header>
      {mobileNav}
      <main className={styles.content}>{children}</main>
    </>
  );
};

export default layout;
