import React from "react";

import styles from "./Image.module.css";

interface Props {
  imageUrl: string;
  contain?: boolean;
  left?: boolean;
}

const image = ({ imageUrl, contain, left }: Props) => (
  <div
    className={styles.image}
    style={{
      backgroundImage: `url('${imageUrl}')`,
      backgroundSize: contain ? "contain" : "cover",
      backgroundPosition: left ? "left" : "center",
    }}
  />
);

export default image;
