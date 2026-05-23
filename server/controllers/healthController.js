function getHealthStatus(req, res) {
  res.status(200).json({
    success: true,
    message: 'API is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
}

export { getHealthStatus };
