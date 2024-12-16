import mongoose from "mongoose";

const userOTPSchema = new mongoose.Schema({
  mobileNumber: { type: Number },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  otp: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  expireAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 86400000), // 1 day from creation
  },
});

// Add TTL index to automatically remove expired OTPs
// The expireAt field is indexed with expireAfterSeconds: 0, which means MongoDB will automatically delete the document once the expireAt date is reached.
// expireAfterSeconds means the field we are taking in this case expireAt, example in expireAt time stored is 1pm 24 december the below function checks the time servers current time and compare it against expirAt if the server's time passes expireAt time it will delete the document
userOTPSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

export const UserOTP = mongoose.model("userOTP", userOTPSchema);
