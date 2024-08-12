// routes/auth.js
const express = require("express");
const User = require("../models/user");
const bcrypt = require('bcryptjs');
const authRouter = express.Router();
const jwt = require('jsonwebtoken');
const Joi = require('joi');

// Joi schema để xác thực
const userSchema = Joi.object({
  fullName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required()
});

// Middleware để xác thực đầu vào người dùng
const validateUser = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

// Secret keys cho JWT
const accessTokenSecret = 'accessTokenSecret';
const refreshTokenSecret = 'refreshTokenSecret';
let refreshTokens = [];

// Endpoint đăng ký tài khoản
authRouter.post("/signup", validateUser(userSchema), async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ msg: "Email đã tồn tại" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    let user = new User({ fullName, email, password: hashPassword });
    user = await user.save();
    res.json({ user });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Endpoint đăng nhập
authRouter.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const findUser = await User.findOne({ email });
    if (!findUser) {
      return res.status(400).json({ msg: 'Không tìm thấy người dùng với email này' });
    }

    const isMatch = await bcrypt.compare(password, findUser.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Mật khẩu không đúng' });
    }

    const accessToken = jwt.sign({ id: findUser._id }, accessTokenSecret, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: findUser._id }, refreshTokenSecret);

    refreshTokens.push(refreshToken);

    const { password: userPassword, ...userWithoutPassword } = findUser._doc;
    res.json({ accessToken, refreshToken, user: userWithoutPassword });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Endpoint refresh token
authRouter.post('/token', (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(401).json({ msg: 'Token là bắt buộc' });
  if (!refreshTokens.includes(token)) return res.status(403).json({ msg: 'Token không hợp lệ' });

  jwt.verify(token, refreshTokenSecret, (err, user) => {
    if (err) return res.status(403).json({ msg: 'Token không hợp lệ' });
    const accessToken = jwt.sign({ id: user.id }, accessTokenSecret, { expiresIn: '15m' });
    res.json({ accessToken });
  });
});

module.exports = authRouter;
