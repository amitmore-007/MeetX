const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel.js');

const { validationResult } = require('express-validator');

const register = async (req, res) => {
  // Check for validation errors first
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }

  try {
    const { name, email, phone, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, phone, password: hashed });
    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    res.status(400).json({ msg: 'Email already exists' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

  const token = jwt.sign({ user: { id: user._id } }, process.env.JWT_SECRET);
  res.json({ token });
};

module.exports = {
  register,
  login,
};
