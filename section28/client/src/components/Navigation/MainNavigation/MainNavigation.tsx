import { NavLink } from "react-router-dom";

import MobileToggle from "../MobileToggle/MobileToggle";
import Logo from "../../Logo/Logo";
import NavigationItems from "../NavigationItems/NavigationItems";

import styles from "./MainNavigation.module.css";
interface Props {
  onOpenMobileNav: () => void;
  isAuth: boolean;
  onLogout: () => void;
}

const mainNavigation = ({ onOpenMobileNav, isAuth, onLogout }: Props) => {
  return (
    <>
      <nav className={styles["main-nav"]}>
        <MobileToggle onOpen={onOpenMobileNav} />
        <div className={styles["main-nav__logo"]}>
          <NavLink to="/">
            <Logo />
          </NavLink>
        </div>
        <div className={styles.spacer} />
        <ul className={styles["main-nav__items"]}>
          <NavigationItems isAuth={isAuth} onLogout={onLogout} />
        </ul>
      </nav>
    </>
  );
};

export default mainNavigation;
