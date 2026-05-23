function asyncHandler(requestHandler) {
  return function wrappedHandler(req, res, next) {
    Promise.resolve(requestHandler(req, res, next)).catch(next);
  };
}

export default asyncHandler;
