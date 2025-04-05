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
        "https://cdn-icons-png.flaticon.com/512/12225/12225935.png",
    },
    isVerified: { type: Boolean, default: false },
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "course" }],
  },
  { timestamps: true }
);

const user = mongoose.model("user", userSchema);
export default user;
