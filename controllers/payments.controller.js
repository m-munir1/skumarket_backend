const axios = require("axios");
const catchAsyncErrors = require("../lib/catchAsyncErrors");
const AppError = require("../util/appError");
const Order = require("../models/order.model");
const Payment = require("../models/payment.model");
const User = require("../models/user.model");
const { PaymentStatus, OrderStatus } = require("../util/OrderStatus");
const { createShipment } = require("./shipment.controller");

exports.initializePayment = catchAsyncErrors(async (req, res, next) => {
  try {
    const response = await axios.post(
      process.env.PAYMENT_API_URL + "order",
      {
        apiOperation: "INITIATE",
        order: {
          reference: "",
          amount: req.body.amount,
          currency: req.body.currency,
          name: req.body.offer,
          description: req.body.description,
          channel: "web",
          category: "pay",
        },
        configuration: {
          tokenizeCc: "true",
          returnUrl: req.body.returnUrl,
          locale: "en",
          paymentAction: "AUTHORIZE,SALE",
        },
      },
      {
        headers: {
          Authorization: process.env.TEST_KEY,
        },
      }
    );

    // console.log("check complete response after create a payment link", response);
    return res.status(200).json({
      postUrl: response?.data?.result?.checkoutData?.postUrl,
    });
  } catch (error) {
    console.log("BOT", error);
    return next(new AppError("Error Initializing Payment", 400));
  }
});

exports.getPayment = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id;

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

  let payments = [];
  try {
    const paymentObjects = await Payment.find({
      $or: [{ user: userId }, { seller: userId }],
    })
      .find(JSON.parse(queryStr))
      .skip(skip)
      .limit(limit)
      .allowDiskUse(true);

    const total = await Payment.find({
      $or: [{ user: userId }, { seller: userId }],
    })
      .find(JSON.parse(queryStr))
      .countDocuments()
      .allowDiskUse(true);

    const promises = paymentObjects.map(async (payment) => {
      let buyerDetails, sellerDetails;

      if (userId == payment.seller.toString()) {
        buyerDetails = await User.findById(payment.user)
          .select(fields)
          .allowDiskUse(true);
      } else if (userId == payment.user.toString()) {
        sellerDetails = await User.findById(payment.seller)
          .select(fields)
          .allowDiskUse(true);
      }

      payments.push({
        payment,
        buyerDetails,
        sellerDetails,
      });
    });

    await Promise.allSettled(promises);

    res.status(200).json({
      status: "success",
      result: payments.length,
      total,
      data: payments,
    });
  } catch (error) {
    return next(new AppError("Error getting Payments", 400));
  }
});

exports.paymentCallback = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id;

  try {
    const payment = await Payment.updateOne(
      {
        $and: [
          { _id: req.body.paymentId },
          { user: userId },
          { status: PaymentStatus.PENDING },
        ],
      },
      {
        $set: {
          status: PaymentStatus.PAID,
          invoiceNo: req.body.orderId,
          paymentType: req.body.paymentType,
        },
      },
      { upsert: true }
    );

    // Create a shipment for the payment
    if (payment.modifiedCount == 1) {
      await createShipment(userId, req.body.paymentId);
    }
  } catch (error) {
    console.log("AAA", error);
  }

  res.status(204).json({
    status: "ok",
  });
});

exports.cancelPayment = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id;

  try {
    const payment = await Payment.findOneAndUpdate(
      {
        $and: [{ _id: req.params.id }, { user: userId }],
      },
      { $set: { status: PaymentStatus.CANCELLED } }
    );

    if (payment) {
      payment.orders?.map(async ({ orderNo }) => {
        await Order.findByIdAndUpdate(orderNo, {
          $set: {
            status: OrderStatus.REJECTED_FROM_BUYER_PAYMENT,
            otherAttributes: { paymentRefNo: payment._id },
          },
        });
      });
    }
  } catch (error) {}

  res.status(204).json({
    status: "ok",
  });
});

exports.removeOrderFromPayment = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id;
  const paymentId = req.body.paymentId;
  const orderId = req.body.orderId;

  try {
    const order = await Order.findById(orderId)
      .select("quantity price")
      .allowDiskUse(true);

    const payment = await Payment.findOneAndUpdate(
      {
        _id: paymentId,
        user: userId,
      },
      {
        $pull: { orders: { orderNo: orderId } },
        $inc: {
          totalQty: -order.quantity,
          totalAmount: -(order.quantity * order.price),
        },
      },
      { new: true }
    );

    if (payment) {
      if (payment.orders.length == 0) {
        // Delete the Payment
        await Payment.findByIdAndDelete(paymentId);
      }

      // Revert the Order Status Back to Reviewed
      await Order.findByIdAndUpdate(orderId, {
        $set: {
          status: OrderStatus.REJECTED_FROM_BUYER_PAYMENT,
          otherAttributes: { paymentRefNo: payment._id },
        },
      });
    }
  } catch (error) {
    console.log("E", error);
  }

  res.status(204).json({
    status: "ok",
  });
});
