import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  const token =
    req.cookies.accessToken ||
    (req.headers.authorization &&
      req.headers.authorization.split("Bearer ")[1]);

  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized. No token provided." });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
  if (!decoded) {
    return res.status(401).json({ message: "Unauthorized. Invalid token." });
  }

  req.user = decoded;
  next();
};

export const authorizationToken = (req, res, next) => {
  const token =
    req.cookies.accessToken ||
    (req.headers.authorization &&
      req.headers.authorization.split("Bearer ")[1]);

  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized. No token provided." });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  if (!decoded.role || !["admin", "teacher"].includes(decoded.role)) {
    return res.status(403).json({ message: "Forbidden" });
  }

  req.user = decoded;
  next();
};
