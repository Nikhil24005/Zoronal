import mongoose from 'mongoose';
import Review from '../models/Review.js';

function buildSort(sort = 'date') {
  const s = (sort || '').toString().toLowerCase();

  // newest first
  if (s === 'date' || s === 'latest') {
    return { createdAt: -1 };
  }

  // highest rating first
  if (s === 'rating' || s === 'highest') {
    return { rating: -1, createdAt: -1 };
  }

  // lowest rating first
  if (s === 'lowest') {
    return { rating: 1, createdAt: -1 };
  }

  // relevance by likes then rating
  if (s === 'relevance') {
    return { likes: -1, rating: -1, createdAt: -1 };
  }

  // default
  return { createdAt: -1 };
}

async function addReview(req, res, next) {
  try {
    const { company, fullName, subject, reviewText, rating } = req.body;

    if (!company || !fullName || !subject || !reviewText || rating === undefined) {
      res.status(400);
      throw new Error('company, fullName, subject, reviewText, and rating are required');
    }

    const review = await Review.create(req.body);

    res.status(201).json({
      success: true,
      data: review,
    });
  } catch (error) {
    next(error);
  }
}

async function getReviewsByCompany(req, res, next) {
  try {
    const { companyId } = req.params;
    const { sort = 'date', page = '1', limit = '5' } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 5));
    const skip = (pageNum - 1) * limitNum;

    if (!mongoose.isValidObjectId(companyId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid company id',
      });
    }

    const filter = { company: companyId };

    const [reviews, averageResult, total] = await Promise.all([
      Review.find(filter).sort(buildSort(sort)).skip(skip).limit(limitNum).exec(),
      Review.aggregate([
        { $match: filter },
        {
          $group: {
            _id: '$company',
            averageRating: { $avg: '$rating' },
          },
        },
      ]),
      Review.countDocuments(filter),
    ]);

    const averageRating = averageResult.length > 0 ? averageResult[0].averageRating : 0;
    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
      success: true,
      averageRating,
      data: reviews,
      meta: { total, page: pageNum, limit: limitNum, totalPages },
    });
  } catch (error) {
    next(error);
  }
}

async function likeReview(req, res, next) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid review id',
      });
    }

    const review = await Review.findByIdAndUpdate(
      id,
      { $inc: { likes: 1 } },
      { new: true, runValidators: true },
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    next(error);
  }
}

export { addReview, getReviewsByCompany, likeReview };
