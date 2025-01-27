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
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    },
    isVerified: { type: Boolean, default: false },
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "course" }],
  },
  { timestamps: true }
);

const user = mongoose.model("user", userSchema);
export default user;
