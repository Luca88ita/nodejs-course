import { PropsWithChildren } from "react";

import styles from "./Paginator.module.css";

interface Props extends PropsWithChildren {
  currentPage: number;
  lastPage: number;
  onPrevious: () => void;
  onNext: () => void;
}

const paginator = ({
  currentPage,
  lastPage,
  onPrevious,
  onNext,
  children,
}: Props) => (
  <div className={styles.paginator}>
    {children}
    <div className={styles["paginator__controls"]}>
      {currentPage > 1 && (
        <button className={styles["paginator__control"]} onClick={onPrevious}>
          Previous
        </button>
      )}
      {currentPage < lastPage && (
        <button className={styles["paginator__control"]} onClick={onNext}>
          Next
        </button>
      )}
    </div>
  </div>
);

export default paginator;
