import { Model, Schema, Types, model } from "mongoose";
import { UserModel } from "./user";

interface DocumentResult<T> {
  _doc: T;
}

export interface IPost extends DocumentResult<IPost> {
  title: string;
  imageUrl: string;
  content: string;
  creator: { _id: Types.ObjectId; name?: string };
  _id: Types.ObjectId;
}

interface IPostMethods {}

//export type PostModel = Model<IPost, {}, IPostMethods>;
export type PostModel = Model<
  IPost & Document & UserModel & Omit<IPost, "users">
>;

const postSchema = new Schema<IPost, PostModel, IPostMethods>(
  {
    title: { type: String, required: true },
    imageUrl: { type: String, required: true },
    content: { type: String, required: true },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Post = model<IPost, PostModel>("Post", postSchema);

export default Post;
