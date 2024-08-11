// models/user.js
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: (value) => {
        const result = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return result.test(value);
      },
      message: 'Vui lòng nhập địa chỉ email hợp lệ',
    },
  },
  state: {
    type: String,
    default: '',
  },
  city: {
    type: String,
    default: '',
  },
  locality: {
    type: String,
    default: '',
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: (value) => {
        return value.length >= 8;
      },
      message: 'Mật khẩu phải có ít nhất 8 ký tự',
    },
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
