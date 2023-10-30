import ReactDOM from "react-dom";
import styles from "./Backdrop.module.css";

interface Props {
  open?: boolean;
  onClick: () => void;
}

const Backdrop = ({ open, onClick }: Props) => {
  return (
    <>
      {ReactDOM.createPortal(
        <div
          className={`${styles.backdrop} ${open && styles.open}`}
          onClick={onClick}
        />,
        document.getElementById("backdrop-root") as HTMLElement
      )}
    </>
  );
};

export default Backdrop;
