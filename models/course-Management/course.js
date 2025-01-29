import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Video title
  url: { type: String, required: true }, // Storage URL (e.g., Firebase, AWS S3)
  duration: { type: Number, required: true }, // Duration in minutes
});

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    priorcourses: { type: mongoose.Schema.Types.ObjectId, ref: "course" },
    skillsRequired: [{ type: String }],
    level: { type: String, enum: ["Beginner", "Intermediate", "Advanced"] },
    module: [{ type: mongoose.Schema.Types.ObjectId, ref: "module" }],
    thumbNail: {
      type: String,
      default:
        "https://www.incimages.com/uploaded_files/image/1920x1080/getty_933383882_2000133420009280345_410292.jpg",
    },
    duration: {
      hours: { type: Number, default: 0 },
      minutes: { type: Number, default: 0 },
    },
    price: { type: Number },
  },
  { timestamps: true }
);

export const course = mongoose.model("course", courseSchema);
