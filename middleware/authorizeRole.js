import jwt from 'jsonwebtoken';

// Middleware to protect routes and verify JWT
export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Not authorized, token failed" });
      }
      req.user = decoded; 
      next();
    });
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Middleware to restrict access to admin users only
export const authorizeAdmin = (req, res, next) => {
  const { role } = req.user;

  if (role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }

  next();
};
