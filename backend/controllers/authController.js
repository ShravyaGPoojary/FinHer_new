const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const asyncHandler = require("../utils/asyncHandler");

// POST /api/auth/register
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, userType, age, occupation } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error("An account with this email already exists");
  }

  const user = await User.create({ name, email, password, userType, age, occupation });

  res.status(201).json({
    user,
    token: generateToken(user._id),
  });
});

// POST /api/auth/login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  res.json({
    user,
    token: generateToken(user._id),
  });
});

// GET /api/auth/profile  (protected)
const getProfile = asyncHandler(async (req, res) => {
  res.json(req.user);
});

// PUT /api/auth/profile  (protected)
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const { name, userType, age, occupation, monthlyIncome, profileImage } = req.body;
  user.name = name ?? user.name;
  user.userType = userType ?? user.userType;
  user.age = age ?? user.age;
  user.occupation = occupation ?? user.occupation;
  user.monthlyIncome = monthlyIncome ?? user.monthlyIncome;
  user.profileImage = profileImage ?? user.profileImage;

  const updated = await user.save();
  res.json(updated);
});

module.exports = { registerUser, loginUser, getProfile, updateProfile };