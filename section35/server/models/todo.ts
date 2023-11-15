import { createRequire } from "https://deno.land/std@0.177.0/node/module.ts";
const require = createRequire(import.meta.url);

const { model, Schema } = require("mongoose");

// Define schema.
const todoSchema = new Schema({
  text: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Validations
todoSchema.path("text").required(true, "Text cannot be blank.");

// Export model.
export default model("Todo", todoSchema);
