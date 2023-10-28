import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Image from "../../../components/Image/Image";
import styles from "./SinglePost.module.css";

interface Props {
  userId: string;
  token: string;
}

const SinglePost = ({ userId, token }: Props) => {
  const [post, setPost] = useState({
    title: "",
    author: "",
    date: "",
    image: "",
    content: "",
  });
  const { postId } = useParams();

  useEffect(() => {
    fetch(`http://localhost:8080/feed/post/${postId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status !== 200) {
          throw new Error("Failed to fetch status");
        }
        return res.json();
      })
      .then((resData) => {
        console.log(`http://localhost:8080/${resData.post.imageUrl}`);
        setPost({
          title: resData.post.title,
          author: resData.post.creator.name,
          date: new Date(resData.post.createdAt).toLocaleDateString("en-US"),
          image: `http://localhost:8080/${resData.post.imageUrl}`, // Assuming the response contains an 'image' property
          content: resData.post.content,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [postId]);

  return (
    <section className={styles["single-post"]}>
      <h1>{post.title}</h1>
      <h2>
        Created by {post.author} on {post.date}
      </h2>
      <div className={styles["single-post__image"]}>
        <Image contain imageUrl={post.image} />
      </div>
      <p>{post.content}</p>
    </section>
  );
};

export default SinglePost;
