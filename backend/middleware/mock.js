const mockUser = (req, res, next) => {
  req.user = {
    id: 1,
    userId: 1,
  };

  next();
};

module.exports = mockUser;