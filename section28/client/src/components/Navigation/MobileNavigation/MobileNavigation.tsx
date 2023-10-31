import React from "react";

import NavigationItems from "../NavigationItems/NavigationItems";
import styles from "./MobileNavigation.module.css";

interface Props {
  open: boolean;
  mobile: boolean;
  onChooseItem: () => void;
  isAuth: boolean;
  onLogout: () => void;
}

const mobileNavigation = ({
  open,
  mobile,
  onChooseItem,
  isAuth,
  onLogout,
}: Props) => {
  return (
    <>
      <nav className={`${styles["mobile-nav"]} ${open && styles.open}`}>
        <ul
          className={`${styles["mobile-nav__items"]} ${
            mobile && styles.mobile
          }`}
        >
          <NavigationItems
            mobile
            onChoose={onChooseItem}
            isAuth={isAuth}
            onLogout={onLogout}
          />
        </ul>
      </nav>
    </>
  );
};

export default mobileNavigation;
