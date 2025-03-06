import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "course",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    rating: { type: Number, enum: [1, 2, 3, 4, 5], required: true },
    comment: { type: String },
  },
  { timestamps: true }
);

// reviewSchema.index({ courseId: 1, userId: 1 }, { unique: true }); // here we are adding index to courseId and userId and also appling unique condition if you dont want unique condition you can just write reviewSchema.index({ courseId: 1, userId: 1 }); and here we wrote 1 here 1 means ascending order -1 means decending order
// and if you add index like this it does NOT make courseId and userId individually unique. Instead, it ensures that the combination of courseId and userId is unique.

// we use index to fast up the query for example if you want to search a word in the book it will take some time to find it and if we have index(page number) we can find much faster same way this works in the mongodb, we might have thousands reviews so to find particular review mongodb query might run slow but if we have index mongodb query will run 100x faster
// You can define the index in two ways, and both work the same way.
// one method is define in the schema defination as we did above in the courseId
// another way is we can define index here(the commented code) we prefer this way when we want to add index to multiple defination example to courseId and userId like that
export const review = mongoose.model("review", reviewSchema);
