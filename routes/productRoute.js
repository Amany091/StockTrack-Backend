const { createProduct, getAllProducts, getProduct, deleteProduct, updateProduct } = require("../controllers/productController")
const { authentication } = require("../middlewares/authMiddleware")
const {  updateProductValidator, deleteProductValidator, getProductValidator } = require("../validators/productValidator")
const {upload} = require("../middlewares/uploadImgMiddleware")

const router = require("express").Router()

router.route("/").post(upload.single("imgCover") ,createProduct)
    .get(getAllProducts)
                
router.route("/:id").put(authentication ,updateProductValidator,updateProduct) 
                    .delete(authentication ,deleteProductValidator,deleteProduct)
                    .get(getProductValidator,getProduct)                

module.exports = router