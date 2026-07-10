import { USER_ROLES } from "../constants/constants.js";

const adminMiddleware = (req, res, next) => {
  if (req.user.role !== USER_ROLES.ADMIN) {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin only.",
    });
  }

  next();
};

export default adminMiddleware;