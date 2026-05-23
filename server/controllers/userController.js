import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});

const createUser = asyncHandler(async (req, res) => {
  const { fullName, email, role } = req.body;

  if (!fullName || !email) {
    res.status(400);
    throw new Error('fullName and email are required');
  }

  const user = await User.create({
    fullName,
    email,
    role,
  });

  res.status(201).json({
    success: true,
    data: user,
  });
});

export { createUser, getUsers };
