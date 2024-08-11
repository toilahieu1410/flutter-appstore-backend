require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const authRouter = require('./routes/auth');  // Đảm bảo đường dẫn này đúng
const bannerRouter = require('./routes/banner');
const categoryRouter = require('./routes/category');
const subcategoryRouter = require('./routes/sub_category');
const productRouter = require('./routes/product');
const productReviewRouter = require('./routes/product_review')

const cors = require('cors');

const PORT = process.env.PORT || 3000;
const DB = process.env.DATABASE;

// Khởi tạo ứng dụng Express
const app = express();

// Middleware để parse các yêu cầu JSON
app.use(express.json());
app.use(cors()); //enable cors for all routes and origin
// Middleware route
app.use('/api', authRouter);  // Đảm bảo dùng đúng router
app.use('/api', bannerRouter);
app.use('/api', categoryRouter);
app.use('/api', subcategoryRouter);
app.use('/api', productRouter);
app.use('/api', productReviewRouter);

// Kết nối tới MongoDB
mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB kết nối thành công'))
.catch((err) => console.error('Lỗi kết nối MongoDB:', err));

// Bắt đầu server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server đang chạy trên cổng ${PORT}`);
});

