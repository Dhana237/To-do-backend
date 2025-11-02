import mongoose from "mongoose";
const todoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    user: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: {
      createdAt: "created_at", // custom name
      updatedAt: "updated_at", // custom name
    },
  }
);
const todoModel = mongoose.model.todo || mongoose.model("todo", todoSchema);
export default todoModel;
