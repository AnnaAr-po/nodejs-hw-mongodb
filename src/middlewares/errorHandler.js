
export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  console.error(`Error: ${err.message}`);

  res.status(status).json({
    status,
    message: err.message || "Internal Server Error",
  });
};