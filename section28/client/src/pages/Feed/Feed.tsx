import { useState, useEffect, FormEvent, useCallback } from "react";
import Post from "../../components/Feed/Post/Post";
import Button from "../../components/Button/Button";
import FeedEdit from "../../components/Feed/FeedEdit/FeedEdit";
import Input from "../../components/Form/Input/Input";
import Paginator from "../../components/Paginator/Paginator";
import Loader from "../../components/Loader/Loader";
import ErrorHandler from "../../components/ErrorHandler/ErrorHandler";
import styles from "./Feed.module.css";
import { PostType } from "../../util/types";
import { useLazyQuery, useQuery, useMutation } from "@apollo/client";
import Queries from "../../gql/queries";
import { InputMaybe, PostInputData } from "../../__generated__/graphql";

interface Props {
  token: string;
}

const Feed = ({ token }: Props) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [totalPosts, setTotalPosts] = useState<number>(0);
  const [editPost, setEditPost] = useState<PostType | null>(null);
  const [status, setStatus] = useState<string>("");
  const [postPage, setPostPage] = useState<number>(1);
  const [postsLoading, setPostsLoading] = useState<boolean>(true);
  const [editLoading, setEditLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  //const [socket, setSocket] = useState<Socket | null>(null);

  const postPerPage = 2;

  const [createPost, createPostResponse] = useMutation(Queries.createPostQuery);
  const [changePost, changePostResponse] = useMutation(Queries.editPostQuery);
  const [deletePost, deletePostResponse] = useMutation(Queries.deletePostQuery);
  const fetchPosts = useQuery(Queries.fetchPostsQuery, {
    variables: {
      currentPage: postPage,
      postPerPage,
    },
    pollInterval: 60000,
  });

  const loadPosts = useCallback(
    (direction?: "next" | "previous") => {
      if (direction) {
        setPostsLoading(true);
        setPosts([]);
      }

      let page = postPage;
      if (direction === "next") {
        page++;
        setPostPage(page);
      }
      if (direction === "previous") {
        page--;
        setPostPage(page);
      }
      if (!fetchPosts.loading && !fetchPosts.error) {
        setPosts(fetchPosts.data.fetchPosts.posts);
        setTotalPosts(fetchPosts.data.fetchPosts.totalItems);
        setPostsLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fetchPosts.data, fetchPosts.error, fetchPosts.loading]
  );

  useEffect(() => {
    loadPosts();
  }, [fetchPosts.data, loadPosts, postPage, editPost]);

  const statusUpdateHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    /*fetch("http://localhost:8080/user/status", {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Can't update status!");
        }
        return res.json();
      })
      .then((resData) => {
        console.log(resData);
      })
      .catch(catchError);*/
  };

  const newPostHandler = () => {
    setIsEditing(true);
  };

  const startEditPostHandler = (postId: string) => {
    const loadedPost = posts.find((p) => p._id === postId);

    if (loadedPost) setEditPost(loadedPost);
    setIsEditing(true);
  };

  const cancelEditHandler = () => {
    setIsEditing(false);
    setEditPost(null);
  };

  const finishEditHandler = async (postData: any) => {
    try {
      setEditLoading(true);
      const formData = new FormData();
      formData.append("image", postData.image);
      if (editPost) formData.append("oldPath", editPost.imageUrl!);

      const fetchImageData = await fetch("http://localhost:8080/post-image", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const fileResData = await fetchImageData.json();
      const postInput: InputMaybe<PostInputData> | undefined = {
        title: postData.title,
        content: postData.content,
        imageUrl: fileResData.filePath ? fileResData.filePath : null,
      };
      const resData = editPost
        ? await changePost({ variables: { postInput, postId: editPost._id } })
        : await createPost({ variables: { postInput } });
      if (resData.errors && resData.errors?.length > 0)
        throw new Error(resData.errors[0].message);
      if (!resData.data)
        throw editPost
          ? new Error("Post not edited")
          : new Error("Post not created");
      fetchPosts.refetch();
      setIsEditing(false);
      setEditPost(null);
      setEditLoading(false);
    } catch (error) {
      console.log(error);
      setIsEditing(false);
      setEditPost(null);
      setEditLoading(false);
      setError(error as Error);
    }
  };

  const statusInputChangeHandler = (value: string) => {
    setStatus(value);
  };

  const deletePostHandler = (postId: string) => {
    setPostsLoading(true);

    deletePost({ variables: { postId } })
      .then((resData) => {
        if (resData.errors) throw new Error("Deleting a post failed!");
        /* const updatedPosts = posts.filter((p) => p._id !== postId);
        setPosts(updatedPosts); */
        fetchPosts.refetch();
        setPostsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setPostsLoading(false);
      });
  };

  const catchError = (error: Error) => {
    setError(error);
  };

  const errorHandler = () => {
    setError(null);
  };

  return (
    <>
      <ErrorHandler error={error} onHandle={errorHandler} />
      <FeedEdit
        editing={isEditing}
        selectedPost={editPost!}
        loading={editLoading}
        onCancelEdit={cancelEditHandler}
        onFinishEdit={finishEditHandler}
      />
      <section className={styles["feed__status"]}>
        <form onSubmit={statusUpdateHandler}>
          <Input
            type="text"
            placeholder="Your status"
            control="input"
            onChange={statusInputChangeHandler}
            value={status}
          />
          <Button mode="flat" type="submit">
            Update
          </Button>
        </form>
      </section>
      <section className={styles["feed__control"]}>
        <Button mode="raised" design="accent" onClick={newPostHandler}>
          New Post
        </Button>
      </section>
      <section className={styles.feed}>
        {postsLoading && (
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <Loader />
          </div>
        )}
        {posts.length <= 0 && !postsLoading ? (
          <p style={{ textAlign: "center" }}>No posts found.</p>
        ) : null}
        {!postsLoading && (
          <Paginator
            onPrevious={() => loadPosts("previous")}
            onNext={() => loadPosts("next")}
            lastPage={Math.ceil(totalPosts / postPerPage)}
            currentPage={postPage}
          >
            {posts.map((post: PostType) => (
              <Post
                key={post._id!}
                id={post._id!}
                author={post.creator.name}
                editable={post.creator._id === localStorage.getItem("userId")}
                date={new Date(+post.createdAt!).toLocaleDateString("it-IT")}
                title={post.title}
                image={post.imageUrl!}
                content={post.content}
                onStartEdit={() => startEditPostHandler(post._id!)}
                onDelete={() => deletePostHandler(post._id!)}
              />
            ))}
          </Paginator>
        )}
      </section>
    </>
  );
};

export default Feed;
