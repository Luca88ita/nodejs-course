import { useState, useEffect, FormEvent, useCallback } from "react";
import { io /* , Socket */ } from "socket.io-client";
import Post from "../../components/Feed/Post/Post";
import Button from "../../components/Button/Button";
import FeedEdit from "../../components/Feed/FeedEdit/FeedEdit";
import Input from "../../components/Form/Input/Input";
import Paginator from "../../components/Paginator/Paginator";
import Loader from "../../components/Loader/Loader";
import ErrorHandler from "../../components/ErrorHandler/ErrorHandler";
import styles from "./Feed.module.css";
import { PostType } from "../../util/types";

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

      fetch(`http://localhost:8080/feed/posts?page=${page}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (res.status !== 200) {
            throw new Error("Failed to fetch posts.");
          }
          return res.json();
        })
        .then((resData) => {
          setPosts(
            resData.posts.map((post: PostType) => {
              return {
                ...post,
                imagePath: post.imageUrl,
              };
            })
          );
          setTotalPosts(resData.totalItems);
          setPostsLoading(false);
        })
        .catch(catchError);
    },
    [postPage, token]
  );

  const addPost = useCallback(
    (post: PostType) => {
      setPosts((prevPosts) => {
        if (postPage === 1) {
          if (posts.length >= 2) {
            prevPosts.pop();
          }
          prevPosts.unshift(post);
        }
        return prevPosts;
      });
      setTotalPosts((prevTotal) => prevTotal + 1);
    },
    [postPage, posts.length]
  );

  const updatePost = useCallback((post: PostType) => {
    setPosts((prevPosts) => {
      const postIndex = prevPosts.findIndex((p) => p._id === post._id);
      if (postIndex >= 0) prevPosts[postIndex] = post;
      return prevPosts;
    });
  }, []);

  const deletePost = useCallback(
    /* (post: PostType) => {
      setPosts((prevPosts) => {
      const postIndex = prevPosts.findIndex((p) => p._id === post._id);
      if (postIndex >= 0) prevPosts.splice(postIndex, 1);
      return prevPosts;
    });
    setTotalPosts((prevTotal) => prevTotal - 1);
    }, */
    () => {
      loadPosts();
    },
    [loadPosts]
  );

  /* useEffect(() => {
    const newSocket = io("http://localhost:8080");
    //setSocket(newSocket);

    newSocket.on("posts", (data) => {
      switch (data.action) {
        case "create":
          addPost(data.post);
          break;
        case "update":
          updatePost(data.post);
          break;
        case "delete":
          // deletePost(data.post);
          deletePost();
          break;
        default:
          break;
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, [addPost, updatePost, deletePost]); */

  useEffect(() => {
    fetch("http://localhost:8080/user/status", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status !== 200) {
          throw new Error("Failed to fetch user status.");
        }
        return res.json();
      })
      .then((resData) => {
        console.log(resData, status);
        resData.status !== status && setStatus(resData.status);
      })
      .catch(catchError);

    loadPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadPosts, token]);

  const statusUpdateHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    fetch("http://localhost:8080/user/status", {
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
      .catch(catchError);
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

  const finishEditHandler = (postData: any) => {
    setEditLoading(true);
    const formData = new FormData();
    formData.append("title", postData.title);
    formData.append("content", postData.content);
    formData.append("image", postData.image);

    const url = editPost
      ? `http://localhost:8080/feed/post/${editPost._id}`
      : "http://localhost:8080/feed/post";
    const method = editPost ? "PUT" : "POST";
    const body = formData;

    fetch(url, {
      method,
      body,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Creating or editing a post failed!");
        }
        return res.json();
      })
      .then((resData) => {
        setIsEditing(false);
        setEditPost(null);
        setEditLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsEditing(false);
        setEditPost(null);
        setEditLoading(false);
        setError(err);
      });
  };

  const statusInputChangeHandler = (value: string) => {
    setStatus(value);
  };

  const deletePostHandler = (postId: string) => {
    setPostsLoading(true);

    fetch(`http://localhost:8080/feed/post/${postId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Deleting a post failed!");
        }
        return res.json();
      })
      .then((resData) => {
        const updatedPosts = posts.filter((p) => p._id !== postId);
        setPosts(updatedPosts);
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
            lastPage={Math.ceil(totalPosts / 2)}
            currentPage={postPage}
          >
            {posts.map((post: PostType) => (
              <Post
                key={post._id!}
                id={post._id!}
                author={post.creator.name}
                editable={post.creator._id === localStorage.getItem("userId")}
                date={new Date(post.createdAt!).toLocaleDateString("en-US")}
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
