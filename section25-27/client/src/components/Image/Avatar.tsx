import Image from "./Image";
import styles from "./Avatar.module.css";

interface Props {
  size: number;
  image: string;
}

const avatar = ({ size, image }: Props) => (
  <div
    className={styles.avatar}
    style={{ width: size + "rem", height: size + "rem" }}
  >
    <Image imageUrl={image} />
  </div>
);

export default avatar;
