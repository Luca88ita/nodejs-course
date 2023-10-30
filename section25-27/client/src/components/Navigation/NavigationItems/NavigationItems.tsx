import { NavLink } from "react-router-dom";
import styles from "./NavigationItems.module.css";

interface Props {
  isAuth: boolean;
  mobile?: boolean;
  onChoose?: () => void;
  onLogout: () => void;
}

const navItems = [
  { id: "feed", text: "Feed", link: "/", auth: true },
  { id: "login", text: "Login", link: "/", auth: false },
  { id: "signup", text: "Signup", link: "/signup", auth: false },
];

const NavigationItems = ({ isAuth, mobile, onChoose, onLogout }: Props) => {
  return (
    <>
      {[
        ...navItems
          .filter((item) => item.auth === isAuth)
          .map((item) => (
            <li
              key={item.id}
              className={`${styles["navigation-item"]} ${
                mobile && styles.mobile
              }`}
            >
              <NavLink to={item.link} onClick={onChoose}>
                {item.text}
              </NavLink>
            </li>
          )),
        isAuth && (
          <li className={styles["navigation-item"]} key="logout">
            <button onClick={onLogout}>Logout</button>
          </li>
        ),
      ]}
    </>
  );
};

export default NavigationItems;
