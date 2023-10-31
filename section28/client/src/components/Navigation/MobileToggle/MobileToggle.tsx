import styles from "./MobileToggle.module.css";

interface Props {
  onOpen: () => void;
}

const mobileToggle = ({ onOpen }: Props) => {
  return (
    <>
      <button className={styles["mobile-toggle"]} onClick={onOpen}>
        <span className={styles["mobile-toggle__bar"]} />
        <span className={styles["mobile-toggle__bar"]} />
        <span className={styles["mobile-toggle__bar"]} />
      </button>
    </>
  );
};

export default mobileToggle;
