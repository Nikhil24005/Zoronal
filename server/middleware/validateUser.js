function validateUser(req, res, next) {
  const { fullName, email, role } = req.body;

  if (!fullName || !email) {
    res.status(400);
    return next(new Error('fullName and email are required'));
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    res.status(400);
    return next(new Error('Please provide a valid email address'));
  }

  if (role && !['user', 'admin'].includes(role)) {
    res.status(400);
    return next(new Error('role must be either user or admin'));
  }

  next();
}

export default validateUser;
