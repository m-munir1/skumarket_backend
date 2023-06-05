const router = require("express").Router();

router.use("/auth", require("./auth.router"));
router.use("/sell", require("./sell.router"));
router.use("/alert", require("./alert.router"));
router.use("/store", require("./store.router"));
router.use("/brand", require("./brand.router"));
router.use("/product", require("./product.router"));
router.use("/userSku", require("./user.sku.router"));
router.use("/payment", require("./payments.router"));
router.use("/category", require("./category.router"));
router.use("/watchList", require("./watchList.router"));
router.use("/marketplace", require("./marketplace.router"));
router.use("/notification", require("./notification.router"));
router.use("/billing-info", require("./billingInfo.route"));
router.use("/portfolio", require("./portfolio.router"));
router.use("/message", require("./message.router"));
router.use("/sellerproduct", require("./userproduct.router"));
router.use("/order", require("./order.router"));
router.use(
  "/keyword-search-analytics",
  require("./keywordSearchAnalytics.router")
);
router.use("/user-history", require("./userHistory.router"));
router.use("/shipment", require("./shipment.router"));
router.use("/sellerboard-flow-setup", require("./sellerBoardFlowSetup.router"))
router.use("/subscription", require("./subscription.router"));

module.exports = router;
