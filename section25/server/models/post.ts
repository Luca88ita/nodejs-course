import { Model, Schema, Types, model } from "mongoose";

export interface IPost {
  title: string;
  imageUrl: string;
  content: string;
  creator: {
    name: string;
  };
  _id: Types.ObjectId;
}

interface IPostMethods {}

type PostModel = Model<IPost, {}, IPostMethods>;

const postSchema = new Schema<IPost, PostModel, IPostMethods>(
  {
    title: { type: String, required: true },
    imageUrl: { type: String, required: true },
    content: { type: String, required: true },
    creator: {
      //_userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
      name: { type: String, required: true },
    },

    /* products: [
    {
      product: { type: Object, required: true },
      quantity: { type: Number, required: true },
    },
  ], */
  },
  { timestamps: true }
);

const Post = model<IPost, PostModel>("Post", postSchema);

export default Post;
