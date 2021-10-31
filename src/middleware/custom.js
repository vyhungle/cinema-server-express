const jwt = require("jsonwebtoken");
const { USER_DEFAULT } = require("../utils/constaints");

const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Không tìm thấy token",
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (Date.now() >= decoded.exp * 1000) {
      return res.status(401).json({
        success: false,
        message: "Key hết hạng",
      });
    }
    if (decoded.typeUser === 0) {
      req.typeUser = decoded.typeUser;
      req.id = decoded.id;
    } else {
      req.typeUser = decoded.typeUser;
      req.id = USER_DEFAULT;
      req.type = decoded.type;
    }
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "Vui lòng đăng nhập để xử dụng chức năng này",
    });
  }
};

module.exports = verifyToken;
