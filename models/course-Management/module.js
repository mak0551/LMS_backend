import mongoose from "mongoose";

const contentSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Title of the content (e.g., "Introduction Video")
  description: { type: String, required: true }, // Brief description
  type: {
    type: String,
    enum: ["video", "pdf", "quiz"], // Types of content allowed
    required: true,
  },
  url: { type: String }, // URL to access the content (e.g., video link, PDF storage path)
  duration: { type: Number }, // Duration in minutes (optional, for videos)
});

const moduleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // Module/Chapter name
    content: [contentSchema], // Array of contents (e.g., videos, PDFs)
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "course",
      required: true,
    },
  },
  { timestamps: true }
);

export const module = mongoose.model("module", moduleSchema);
