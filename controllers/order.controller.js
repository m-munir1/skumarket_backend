const catchAsyncErrors = require("../lib/catchAsyncErrors");
const User = require("../models/user.model");
const Order = require("../models/order.model");
const Payment = require("../models/payment.model");
const Product = require("../models/product.model");
const AppError = require("../util/appError");
const { OrderStatus, PaymentStatus } = require("../util/OrderStatus");
// TODO : AUTHORIZATION CHECKS

// create an order
const createOrder = catchAsyncErrors(async (req, res, next) => {
  const user = req.user._id;
  const { data } = req.body;

  try {
    const order = await Order.create({
      buyer: user,
      seller: data.sellerId,
      product: data.productId,
      quantity: data.quantity,
      price: data.price,
    });

    res.status(201).json({
      status: "success",
      order,
    });
  } catch (error) {
    return next(new AppError("Invalid product or bid", 400));
  }
});

// get all orders of a buyer or store
const getOrders = catchAsyncErrors(async (req, res, next) => {
  const user = req.user._id;

  let limit = req?.query?.limit || 10;
  let page = req?.query?.page || 1;
  const skip = (page - 1) * limit;
  const fields = "_id name country city address zipCode phone";

  const queryObj = { ...req.query };
  const excludedFields = ["page", "sort", "limit", "fields"];
  excludedFields.forEach((el) => delete queryObj[el]);
  // 1B) Advanced filtering
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(
    /\b(gte|gt|lte|lt|eq|ne|in)\b/g,
    (match) => `$${match}`
  );

  let orders = [];
  try {
    const orderObjects = await Order.find({
      $or: [{ buyer: user }, { seller: user }],
    })
      .find(JSON.parse(queryStr))
      .skip(skip)
      .limit(limit)
      .allowDiskUse(true);

    const total = await Order.find({
      $or: [{ buyer: user }, { seller: user }],
    })
      .find(JSON.parse(queryStr))
      .countDocuments()
      .allowDiskUse(true);

    const promises = orderObjects.map(async (order) => {
      let buyerDetails, sellerDetails;

      if (req.user._id == order.seller.toString()) {
        buyerDetails = await User.findById(order.buyer)
          .select(fields)
          .allowDiskUse(true);
      } else if (req.user._id == order.buyer.toString()) {
        sellerDetails = await User.findById(order.seller)
          .select(fields)
          .allowDiskUse(true);
      }

      orders.push({
        order,
        buyerDetails,
        sellerDetails,
      });
    });

    await Promise.allSettled(promises);

    res.status(200).json({
      status: "success",
      result: orders.length,
      total,
      data: orders,
    });
  } catch {
    return next(new AppError("Error getting orders", 400));
  }
});

// update the order fields
const updateOrder = catchAsyncErrors(async (req, res, next) => {
  const orderId = req.params.id;
  const user = req.user._id;
  const data = req.body;

  try {
    let order = await Order.findById(orderId);

    data.quantity ? (order.quantity = data.quantity) : "";
    data.price ? (order.price = data.price) : "";
    data.status ? (order.status = data.status) : "";
    data.receipt ? (order.receipt = data.receipt) : "";

    if (data.status == OrderStatus.ACCEPTED) {
      const success = await createPayment(orderId, user);

      if (success) {
        await order.save();
      } else {
        return next(new AppError("Error updating order", 400));
      }
    } else {
      await order.save();
    }

    res.status(200).json({
      status: "success",
    });
  } catch {
    return next(new AppError("Error updating order", 400));
  }
});

// delete the order
const deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = req.params.id;

  try {
    await Order.findByIdAndDelete({ _id: order });

    res.status(200).json({
      status: "success",
    });
  } catch {
    return next(new AppError("Error deleting order", 400));
  }
});

const getOrderById = catchAsyncErrors(async (req, res, next) => {
  const orderId = req.params.id;
  try {
    const order = await Order.findOne({ _id: orderId });
    res.status(200).json({
      status: "success",
      order,
    });
  } catch (error) {
    return next(new AppError("order is not found", 400));
  }
});

const createPayment = async (orderId, userId) => {
  try {
    let order = await Order.findById(orderId).populate({
      path: "product",
      select: "sku_marketplace buy_box_currency",
    });

    const pay = await Payment.findOne({
      $and: [
        { user: userId },
        { seller: order.seller },
        { status: PaymentStatus.PENDING },
      ],
    });

    if (!pay || pay.marketplace != order.product.sku_marketplace) {
      let vat;

      switch (order.product.buy_box_currency) {
        case "SAR":
          vat = 15;
          break;
        case "AED":
          vat = 5;
          break;
        case "EGP":
          vat = 14;
          break;
        default:
          break;
      }

      await Payment.create({
        user: userId,
        orders: [{ orderNo: order._id }],
        seller: order.seller,
        totalQty: order.quantity,
        totalAmount: order.quantity * order.price,
        marketplace: order.product.sku_marketplace,
        vat: vat,
        currency: order.product.buy_box_currency,
      });

      return true;
    } else {
      const newAmount = pay.totalAmount + order.quantity * order.price;
      const newQty = pay.totalQty + order.quantity;

      await Payment.findByIdAndUpdate(pay._id, {
        $push: { orders: { orderNo: order._id } },
        $set: { totalAmount: newAmount, totalQty: newQty },
      });

      return true;
    }
  } catch (error) {
    console.log("AAA", error);
    return false;
  }
};

module.exports = {
  createOrder,
  getOrders,
  updateOrder,
  deleteOrder,
  getOrderById,
};
