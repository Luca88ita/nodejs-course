export enum InputType {
  TITLE = "title",
  IMAGE = "image",
  CONTENT = "content",
  PASSWORD = "password",
  EMAIL = "email",
  NAME = "name",
}

export enum FeedType {
  TITLE = "title",
  IMAGE = "image",
  CONTENT = "content",
}

export enum LoginType {
  PASSWORD = "password",
  EMAIL = "email",
}

export enum SignupType {
  PASSWORD = "password",
  EMAIL = "email",
  NAME = "name",
}

export type PostType = {
  _id?: string;
  title: string;
  content: string;
  creator: { _id: string; name: string };
  createdAt?: string;
  imageUrl?: string;
};

export type Config = {
  min?: number;
  max?: number;
};

export type Credentials = {
  email: string;
  password: string;
};

export type PostForm = {
  title: {
    value: string;
    valid: boolean;
    touched: boolean;
    validators: [
      required: (value: string) => boolean,
      email: (value: string) => boolean
    ];
  };
  image: {
    value: string;
    valid: boolean;
    touched: boolean;
    validators: [required: (value: string) => boolean];
  };
  content: {
    value: string;
    valid: boolean;
    touched: boolean;
    validators: [
      required: (value: string) => boolean,
      length: (value: string) => boolean
    ];
  };
};

export type SignupForm = {
  email: {
    value: string;
    valid: boolean;
    touched: boolean;
    validators: [
      required: (value: string) => boolean,
      email: (value: string) => boolean
    ];
  };
  password: {
    value: string;
    valid: boolean;
    touched: boolean;
    validators: [
      required: (value: string) => boolean,
      length: (value: string) => boolean
    ];
  };
  name: {
    value: string;
    valid: boolean;
    touched: boolean;
    validators: [required: (value: string) => boolean];
  };
  formIsValid: boolean;
};
