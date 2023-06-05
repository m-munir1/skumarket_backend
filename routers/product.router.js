const protect = require("../middleware/protect");
const router = require("express").Router();

const { updatePrice, getPrice } = require("../controllers/price.controller");
const {
  getProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  getTotalProducts,
  searchProductsPaginate,
  productSummary,
  getProductImage,
  updateProductImages,
} = require("../controllers/product.controller");
const {
  getAllSellerProducts,
  getAllProductSellers,
  getAllCategoriesWithProducts,
  getAllCategoryTypesWithProducts,
  getAllCategories,
  getSpecifiedProducts,
  getSearchedProducts,
  getPartnerSkuByProductId
} = require("../controllers/userProduct.controller");

router.route("/total").get(getTotalProducts);
router.route("/search").get(searchProductsPaginate);
router.route("/summary").get(productSummary);
router.route("/allSellerProducts").get(getAllSellerProducts);
router.route("/allProductSellers/:id").get(getAllProductSellers);
router.route("/allCategoriesWithProducts").get(getAllCategoriesWithProducts);
router
  .route("/allCategoryTypesWithProducts")
  .get(getAllCategoryTypesWithProducts);
router.route("/allCategories").get(getAllCategories);
router.route("/allSpecifiedProducts").post(getSpecifiedProducts);
router.route("/allSearchedProducts").get(getSearchedProducts)
router.route("/image/:sku").get(getProductImage).put(updateProductImages);

router.route("/").get(getProducts).post(protect, createProduct);

router
  .route("/:id")
  .get(getProduct)
  .put(protect, updateProduct)
  .delete(protect, deleteProduct);

router.route("/updatePrice/:id").put(protect, updatePrice).get(getPrice);

router.route('/partnerSKU/:id').get(protect, getPartnerSkuByProductId)

// export router
module.exports = router;
