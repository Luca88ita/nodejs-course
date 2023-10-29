import { Model, Schema, Types, model } from "mongoose";

export interface IPost {
  title: string;
  imageUrl: string;
  content: string;
  creator: {};
  _id: Types.ObjectId;
}

interface IPostMethods {}

export type PostModel = Model<IPost, {}, IPostMethods>;

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
