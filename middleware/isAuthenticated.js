const isAuthenticated = (req, res, next) => {
  try {
    const token = req.headers.authorization.replace("Bearer ", "");
    console.log(token);
    const User = require("../models/Sign_up");

    if (!User) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = User;
    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = isAuthenticated;
