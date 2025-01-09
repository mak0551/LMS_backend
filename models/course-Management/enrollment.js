import mongoose from "mongoose";

const enrollMentSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "course",
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    enrollMentDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["active", "completed", "unenrolled"],
      default: "active",
    },
  },
  { timestamps: true }
);

export const enrollMent = mongoose.model("enrollment", enrollMentSchema);
