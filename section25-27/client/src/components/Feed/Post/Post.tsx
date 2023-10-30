import Button from "../../Button/Button";
import styles from "./Post.module.css";

interface Props {
  author: string;
  editable: boolean;
  date: string;
  title: string;
  id: string;
  image: string;
  content: string;
  onStartEdit: () => void;
  onDelete: () => void;
}

const Post = ({
  author,
  editable,
  date,
  title,
  id,
  onStartEdit,
  onDelete,
}: Props) => {
  return (
    <article className={styles.post}>
      <header className={styles["post__header"]}>
        <h3 className={styles["post__meta"]}>
          Posted by {author} on {date}
        </h3>
        <h1 className={styles["post__title"]}>{title}</h1>
      </header>
      {/* <div className={styles["post__image"]}>
      <Image imageUrl={props.image} contain />
    </div>
    <div className={styles["post__content"]}>{props.content}</div> */}
      <div className={styles["post__actions"]}>
        <Button mode="flat" link={id}>
          View
        </Button>
        {editable && (
          <>
            <Button mode="flat" onClick={onStartEdit}>
              Edit
            </Button>
            <Button mode="flat" design="danger" onClick={onDelete}>
              Delete
            </Button>
          </>
        )}
      </div>
    </article>
  );
};

export default Post;
