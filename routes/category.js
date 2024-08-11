const express = require('express')
const Category = require('../models/category');

const categoryRouter = express.Router();

categoryRouter.post('/categories', async (req, res) => {
    try {
        const {name, image, banner} = req.body;
        const category = new Category({name, image, banner});
        await category.save();
        return res.status(201).send(category);
    } catch (e) {
        res.status(500).json({error: e.message})
    }
});

categoryRouter.get('/categories', async(req, res) => {
    try {
        const categories = await Category.find();
        return res.status(200).json(categories)
    } catch (e) {
        res.status(500).json({error: e.message})
    }
})
module.exports = categoryRouter;