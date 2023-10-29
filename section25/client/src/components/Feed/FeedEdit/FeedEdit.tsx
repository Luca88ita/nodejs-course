import { useState, useEffect } from "react";

import Backdrop from "../../Backdrop/Backdrop";
import Modal from "../../Modal/Modal";
import Input from "../../Form/Input/Input";
import FilePicker from "../../Form/Input/FilePicker";
import Image from "../../Image/Image";
import { required, length } from "../../../util/validators";
import { generateBase64FromImage } from "../../../util/image";
import { FeedType, InputType } from "../../../util/types";

import styles from "./FeedEdit.module.css";

const POST_FORM = {
  title: {
    value: "",
    valid: false,
    touched: false,
    validators: [required, length({ min: 5 })],
  },
  image: {
    value: "",
    valid: false,
    touched: false,
    validators: [required],
  },
  content: {
    value: "",
    valid: false,
    touched: false,
    validators: [required, length({ min: 5 })],
  },
};

type Post = {
  title: string;
  image?: any;
  imagePath?: string;
  content: string;
};

interface Props {
  editing: boolean;
  selectedPost: Post;
  loading: boolean;
  onFinishEdit: (post: Post) => void;
  onCancelEdit: () => void;
}

const FeedEdit = ({
  editing,
  selectedPost,
  loading,
  onFinishEdit,
  onCancelEdit,
}: Props) => {
  const [postForm, setPostForm] = useState<typeof POST_FORM>(POST_FORM);
  const [formIsValid, setFormIsValid] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    if (editing && selectedPost) {
      const updatedPostForm = {
        ...postForm,
        title: {
          ...postForm.title,
          value: selectedPost.title,
          valid: true,
        },
        image: {
          ...postForm.image,
          value: selectedPost.imagePath!,
          valid: true,
        },
        content: {
          ...postForm.content,
          value: selectedPost.content,
          valid: true,
        },
      };
      setPostForm(updatedPostForm);
      setFormIsValid(true);
    }
  }, [editing, selectedPost]);

  const postInputChangeHandler = (
    value: string,
    input?: FeedType,
    files?: FileList
  ) => {
    if (files) {
      generateBase64FromImage(files[0])
        .then((b64: string) => {
          setImagePreview(b64);
        })
        .catch((e) => {
          setImagePreview("");
        });
    }

    let isValid = true;
    for (const validator of postForm[input!].validators) {
      isValid = isValid && validator(value);
    }

    const updatedForm = {
      ...postForm,
      [input!]: {
        ...postForm[input!],
        valid: isValid,
        value: files ? files[0] : value,
      },
    };

    let isFormValid = true;
    for (const inputName in updatedForm) {
      const x = inputName as FeedType;
      isFormValid = isFormValid && updatedForm[x].valid;
    }

    setPostForm(updatedForm);
    setFormIsValid(isFormValid);
  };

  const inputBlurHandler = (input: FeedType) => {
    const updatedForm = {
      ...postForm,
      [input]: {
        ...postForm[input],
        touched: true,
      },
    };
    setPostForm(updatedForm);
  };

  const cancelPostChangeHandler = () => {
    setPostForm(POST_FORM);
    setFormIsValid(false);
    onCancelEdit();
  };

  const acceptPostChangeHandler = () => {
    const post: Post = {
      title: postForm.title.value,
      image: postForm.image.value,
      content: postForm.content.value,
    };
    onFinishEdit(post);
    setPostForm(POST_FORM);
    setFormIsValid(false);
    setImagePreview("");
  };

  return editing ? (
    <>
      <Backdrop onClick={cancelPostChangeHandler} />
      <Modal
        title="New Post"
        acceptEnabled={formIsValid}
        onCancelModal={cancelPostChangeHandler}
        onAcceptModal={acceptPostChangeHandler}
        isLoading={loading}
      >
        <form>
          <Input
            id={InputType.TITLE}
            label="Title"
            control="input"
            onChange={postInputChangeHandler}
            onBlur={() => inputBlurHandler(FeedType.TITLE)}
            valid={postForm["title"].valid}
            touched={postForm["title"].touched}
            value={postForm["title"].value}
          />
          <FilePicker
            id={InputType.IMAGE}
            label="Image"
            onChange={postInputChangeHandler}
            onBlur={() => inputBlurHandler(FeedType.IMAGE)}
            valid={postForm["image"].valid}
            touched={postForm["image"].touched}
          />
          <div className={styles["new-post__preview-image"]}>
            {!imagePreview && <p>Please choose an image.</p>}
            {imagePreview && <Image imageUrl={imagePreview} contain left />}
          </div>
          <Input
            id={InputType.CONTENT}
            label="Content"
            control="textarea"
            rows={5}
            onChange={postInputChangeHandler}
            onBlur={() => inputBlurHandler(FeedType.CONTENT)}
            valid={postForm["content"].valid}
            touched={postForm["content"].touched}
            value={postForm["content"].value}
          />
        </form>
      </Modal>
    </>
  ) : null;
};

export default FeedEdit;
