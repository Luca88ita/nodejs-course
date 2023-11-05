import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";
import Image from "../../../components/Image/Image";
import styles from "./SinglePost.module.css";
import Queries from "../../../gql/queries";

interface Props {
  token: string;
}

const SinglePost = ({ token }: Props) => {
  const [post, setPost] = useState({
    title: "",
    author: "",
    date: "",
    image: "",
    content: "",
  });
  const { postId } = useParams();
  const [viewPost, viewPostResponse] = useLazyQuery(
    Queries.fetchSinglePostQuery
  );

  useEffect(() => {
    viewPostResponse.refetch();
    viewPost({ variables: { postId } })
      .then((resData) => {
        if (resData.error) throw new Error(resData.error.message);
        if (!resData.data) throw new Error("Post not found");
        console.log(resData);
        const data = resData.data.viewPost;
        setPost({
          title: data.title,
          author: data.creator.name,
          date: new Date(+data.createdAt).toLocaleDateString("it-IT"),
          image: `http://localhost:8080/${data.imageUrl}`, // Assuming the response contains an 'image' property
          content: data.content,
        });
      })
      .catch((err) => {
        console.log(err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId, token, viewPost]);

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
