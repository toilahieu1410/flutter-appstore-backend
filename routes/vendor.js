const express = require('express');
const Vendor = require('../models/vendor');
const vendorRouter = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

vendorRouter.post("/vendor/signup", async (req, res) => {
    try {
      const { fullName, email, password } = req.body;
      const existingEmail = await Vendor.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ msg: "Nhà cung cấp với email này đã tồn tại" });
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      let vendor = new Vendor({ fullName, email, password: hashPassword });
      vendor = await vendor.save();
      res.json({ vendor });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  // Endpoint đăng nhập

  // Secret keys cho JWT
const accessTokenSecret = 'accessTokenSecret';
const refreshTokenSecret = 'refreshTokenSecret';
let refreshTokens = [];

  vendorRouter.post('/vendor/signin', async (req, res) => {
    try {
      const { email, password } = req.body;
      const findUser = await Vendor.findOne({ email });
      if (!findUser) {
        return res.status(400).json({ msg: 'Không tìm thấy nhà cung cấp với email này' });
      }
  
      const isMatch = await bcrypt.compare(password, findUser.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Mật khẩu không đúng' });
      } else {
        const accessToken = jwt.sign({ id: findUser._id }, accessTokenSecret, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ id: findUser._id }, refreshTokenSecret);
    
        refreshTokens.push(refreshToken);
    
        const { password: userPassword, ...vendorWithoutPassword } = findUser._doc;
        res.json({ accessToken, refreshToken, vendor: vendorWithoutPassword });
      }
  

    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  module.exports = vendorRouter;