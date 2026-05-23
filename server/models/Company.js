import { Schema, model } from 'mongoose';

const companySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    logo: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    foundedOn: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

// Index for faster text search on name and city
companySchema.index({ name: 'text', city: 'text' });

const Company = model('Company', companySchema);

export default Company;
