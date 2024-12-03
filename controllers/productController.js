const asyncWrapper = require("../utils/asyncWrapper")
const { getDocument, deleteDocument } = require("../utils/handler")
const {Product} = require("../models/products")



exports.createProduct = asyncWrapper(async (req, res) => {
    if (req.file) {
        req.body.imgCover = req.file.filename
    }
    const product = await Product.create(req.body)
    return res.status(201).json({ data: product })
});

exports.getAllProducts = asyncWrapper(async (req, res) => {
    const page = +req.query.page || 1
    const limit = +req.query.limit || 10
    const skip = (page - 1) * limit
    // const count = await Product.countDocuments()
    const filter = {}
    const maxPrice = parseInt(req.query.maxPrice || 0)
    const minPrice = parseInt(req.query.minPrice || 0)
    if (maxPrice && minPrice) {
        filter.price = {$gte: minPrice, $lte: maxPrice}
    } else if (maxPrice) {
        filter.price = {$lte: maxPrice}
    } else if(minPrice){
        filter.price = {$gte: minPrice}
    }
    if(req.query.price) filter.price = req.query.price
    const products = await Product.find(filter).skip(skip).limit(limit)
    const totalProducts = await Product.countDocuments(filter)
    return res.status(200).json({ page, limit, total: totalProducts, data: products  })
})


exports.updateProduct = asyncWrapper(async (req, res) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
    return res.status(200).json({ data: product })
})

exports.getProduct = getDocument(Product)
exports.deleteProduct = deleteDocument(Product)