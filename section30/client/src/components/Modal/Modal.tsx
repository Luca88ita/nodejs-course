import { PropsWithChildren } from "react";
import ReactDOM from "react-dom";

import Button from "../Button/Button";
import styles from "./Modal.module.css";

interface Props extends PropsWithChildren {
  title: string;
  onCancelModal: () => void;
  onAcceptModal: () => void;
  isLoading?: boolean;
  acceptEnabled: boolean;
}

const modal = ({
  children,
  title,
  onCancelModal,
  onAcceptModal,
  isLoading,
  acceptEnabled,
}: Props) => {
  return ReactDOM.createPortal(
    <div className={styles.modal}>
      <header className={styles["modal__header"]}>
        <h1>{title}</h1>
      </header>
      <div className={styles["modal__content"]}>{children}</div>
      <div className={styles["modal__actions"]}>
        <Button design="danger" mode="flat" onClick={onCancelModal}>
          Cancel
        </Button>
        <Button
          mode="raised"
          onClick={onAcceptModal}
          disabled={!acceptEnabled}
          loading={isLoading}
        >
          Accept
        </Button>
      </div>
    </div>,
    document.getElementById("modal-root") as HTMLElement
  );
};

export default modal;
