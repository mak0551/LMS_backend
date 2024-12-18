import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    priorcourses: { type: mongoose.Schema.Types.ObjectId, ref: "course" },
    skillsRequired: { type: String },
    level: { type: String, enum: ["beginner, intermediate, advanced"] },
    duration: { type: Number },
    price: { type: Number },
  },
  { timestamps: true }
);

export const course = mongoose.model("course", courseSchema);
