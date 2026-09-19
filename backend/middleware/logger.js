/**
 * Request logging middleware
 */
const logger = (req, res, next) => {
  const start = Date.now();
  
  // Log request
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  
  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusColor = res.statusCode >= 400 ? '\x1b[31m' : '\x1b[32m';
    const resetColor = '\x1b[0m';
    
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.path} ` +
      `${statusColor}${res.statusCode}${resetColor} - ${duration}ms`
    );
  });

  next();
};

/**
 * API request logger with more details
 */
const apiLogger = (req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    console.log({
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.path,
      query: req.query,
      body: req.body,
      ip: req.ip,
    });
  }
  next();
};

module.exports = {
  logger,
  apiLogger,
};
