import mongoose from 'mongoose';
import Company from '../models/Company.js';
import Review from '../models/Review.js';

async function createCompany(req, res, next) {
  try {
    const data = { ...req.body };

    const company = await Company.create(data);

    res.status(201).json({
      success: true,
      data: company,
    });
  } catch (error) {
    next(error);
  }
}

async function getAllCompanies(req, res, next) {
  try {
    const { search = '', page = '1', limit = '10' } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const searchTerm = search.trim();
    const filter = searchTerm
      ? {
          $or: [
            { name: { $regex: searchTerm, $options: 'i' } },
            { city: { $regex: searchTerm, $options: 'i' } },
          ],
        }
      : {};

    const [total, companies] = await Promise.all([
      Company.countDocuments(filter),
      Company.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
    ]);

    // Attach review stats (average rating and review count) for companies on this page
    const companyIds = companies.map((c) => c._id);

    let stats = [];
    if (companyIds.length > 0) {
      stats = await Review.aggregate([
        { $match: { company: { $in: companyIds } } },
        {
          $group: {
            _id: '$company',
            averageRating: { $avg: '$rating' },
            reviewCount: { $sum: 1 },
          },
        },
      ]).exec();
    }

    const statsMap = new Map(stats.map((s) => [String(s._id), s]));

    const companiesWithStats = companies.map((c) => {
      const s = statsMap.get(String(c._id));
      return {
        ...c,
        averageRating: s ? Number(s.averageRating.toFixed(1)) : 0,
        reviewCount: s ? s.reviewCount : 0,
      };
    });

    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
      success: true,
      data: companiesWithStats,
      meta: { total, page: pageNum, limit: limitNum, totalPages },
    });
  } catch (error) {
    next(error);
  }
}

async function getCompanyById(req, res, next) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid company id',
      });
    }

    const company = await Company.findById(id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found',
      });
    }

    res.status(200).json({
      success: true,
      data: company,
    });
  } catch (error) {
    next(error);
  }
}

export { createCompany, getAllCompanies, getCompanyById };
