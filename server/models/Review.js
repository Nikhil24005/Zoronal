import { Schema, model, Types } from 'mongoose';

const reviewSchema = new Schema(
  {
    company: {
      type: Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    reviewText: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

const Review = model('Review', reviewSchema);

export default Review;
