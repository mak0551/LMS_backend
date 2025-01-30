import mongoose from "mongoose";

// const addressSchema = new mongoose.Schema({
//   location: String,
//   coordinates: {
//     type: {
//       type: String,
//       default: "Point",
//     },
//     coordinates: {
//       type: [Number],
//       default: [0, 0],
//     },
//   },
//   pincode: String,
// });

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    mobileNo: { type: Number, required: true, unique: true },
    password: { type: String, required: true },
    // role: { type: String, enum: ["admin", "student", "teacher"] },
    address: { type: String },
    profileImg: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1457449940276-e8deed18bfff?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    isVerified: { type: Boolean, default: false },
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "course" }],
  },
  { timestamps: true }
);

const user = mongoose.model("user", userSchema);
export default user;
