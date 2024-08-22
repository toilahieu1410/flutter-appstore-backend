const express = require('express');
const Product = require('../models/product');
const productRouter = express.Router();

productRouter.post('/add-product', async (req, res) => {
    try {
        const { productName, productPrice, quantity, description, category, vendorId, fullName, subCategory, images } = req.body;
        const product = new Product({ productName, productPrice, quantity, vendorId, fullName, description, category, subCategory, images });
        await product.save();
        return res.status(201).send(product);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

productRouter.get('/popular-products', async (req, res) => {
    try {
        const products = await Product.find({ popular: true });
        if (!products || products.length === 0) {
            return res.status(404).json({ msg: 'products not found' });
        } else {
            return res.status(200).json(products);
        }
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

productRouter.get('/recommended-products', async (req, res) => {
    try {
        const products = await Product.find({ recommend: true });
        if (!products || products.length === 0) {
            return res.status(404).json({ msg: 'products not found' });
        } else {
            return res.status(200).json({ products });
        }
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// thêm 1 route truy xuất sản phẩm 
productRouter.get('/product-by-category/:category', async (req, res) => {
    try {
        const {category} = req.params;
        const products = await Product.find({category, popular: true});
        if(!products || products.length == 0) {
            return res.status(404).json({msg: 'Product not found'})
        } else {
            return res.status(200).json(products);
        }
        
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = productRouter;
