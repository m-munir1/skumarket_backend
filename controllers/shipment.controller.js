const catchAsyncErrors = require("../lib/catchAsyncErrors");
const Shipment = require("../models/shipment.model");
const User = require("../models/user.model");
const SellerBoardFlowSetup = require("../models/sellerBoardFlowSetup.model");
const AppError = require("../util/appError");
const { OrderStatus } = require("../util/OrderStatus");
const { ShipmentStatus } = require("../util/ShipmentStatus");
const Payment = require("../models/payment.model");
const { findById } = require("../models/shipment.model");
const { default: mongoose } = require("mongoose");

// TODO: ADD AUTHORIZATION CHECKS

// create a shipment
exports.createShipment = async (userId, paymentId) => {
  const flow = await SellerBoardFlowSetup.findOne({ user: userId });

  let status;

  if (flow.B2B.flowControl.shipments.preparing.pick) {
    status = ShipmentStatus.PREPARING;
  } else if (flow.B2B.flowControl.shipments.preparing.pack) {
    status = ShipmentStatus.PICKED;
  } else if (flow.B2B.flowControl.shipments.preparing.readyToDeliver) {
    status = ShipmentStatus.PACKED;
  }

  await Shipment.create({
    payment: paymentId,
    status: status,
  });
};

exports.getShipment = catchAsyncErrors(async (req, res, next) => {
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

  let shipments = [];
  try {
    const shipmentObjects = await Shipment.find({
      $or: [{ "$.payment.user": userId }, { "$.payment.seller": userId }],
    })
      .find(JSON.parse(queryStr))
      .skip(skip)
      .limit(limit)
      .populate({
        path: "payment",
        select: "user seller orders rtvOrders totalQty",
        populate: {
          path: "orders.orderNo rtvOrders.orderNo",
          select: "product quantity _id",
          populate: {
            path: "product",
            select: "_id sku sku_marketplace brand_en category_en all_images",
          },
        },
      })
      .allowDiskUse(true);

    const total = await Shipment.find({
      $or: [{ "$.payment.user": userId }, { "$.payment.seller": userId }],
    })
      .find(JSON.parse(queryStr))
      .countDocuments()
      .allowDiskUse(true);

    const promises = shipmentObjects.map(async (shipment) => {
      let buyerDetails, sellerDetails;

      if (userId == shipment.payment.seller.toString()) {
        buyerDetails = await User.findById(shipment.payment.user)
          .select(fields)
          .allowDiskUse(true);
      } else if (userId == shipment.payment.user.toString()) {
        sellerDetails = await User.findById(shipment.payment.seller)
          .select(fields)
          .allowDiskUse(true);
      }

      shipments.push({
        shipment,
        buyerDetails,
        sellerDetails,
      });
    });

    await Promise.allSettled(promises);

    res.status(200).json({
      status: "success",
      result: shipments.length,
      total,
      data: shipments,
    });
  } catch (error) {
    return next(new AppError("Error getting Shipments", 400));
  }
});

exports.handlePreparingShipment = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id;
  const shipmentId = req.body.id;
  const orders = req.body.orders;
  const removedOrders = req.body.removed;

  try {
    const flow = await SellerBoardFlowSetup.findOne({ user: userId });

    let status;

    if (flow.B2B.flowControl.shipments.preparing.pack) {
      status = ShipmentStatus.PICKED;
    } else {
      status = ShipmentStatus.PACKED;
    }

    let shipment = await Shipment.findById(shipmentId);

    let payment = await Payment.findById(shipment.payment);
    payment.orders = payment.orders.map((obj) => {
      const order = orders.find((obj2) => obj.orderNo == obj2.orderNo._id);
      const removed = removedOrders.find(
        (obj2) => obj.orderNo == obj2.orderNo._id
      );

      if (order) {
        return { ...obj, deductedQty: order.deductedQty };
      } else if (removed) {
        return { ...obj, deductedQty: removed.deductedQty };
      } else {
        return obj;
      }
    });

    await payment.save();

    shipment.status = status;
    await shipment.save();

    res.status(200).json({
      status: "success",
    });
  } catch (error) {
    // console.log(error)
    return next(new AppError("Error updating shipment status", 400));
  }
});

exports.handlePickedShipment = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id;
  const shipmentId = req.body.id;

  try {
    await Shipment.findByIdAndUpdate(shipmentId, {
      status: ShipmentStatus.PACKED,
    });

    res.status(200).json({
      status: "success",
    });
  } catch {
    return next(new AppError("Error updating shipment status", 400));
  }
});

exports.handlePackedShipment = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id;
  const shipmentId = req.body.id;
  const awb = req.body.awb;

  try {
    const flow = await SellerBoardFlowSetup.findOne({ user: userId });

    let status;

    if (flow.B2B.flowControl.shipments.shipping.shipped) {
      status = ShipmentStatus.SHIPPED;
    } else {
      status = ShipmentStatus.DELIVERED;
    }

    await Shipment.findByIdAndUpdate(shipmentId, {
      status,
      awbNumber: awb,
    });

    res.status(200).json({
      status: "success",
    });
  } catch {
    return next(new AppError("Error updating shipment status", 400));
  }
});

exports.handleShippedShipment = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id;
  const shipmentId = req.params.id;

  try {
    await Shipment.findByIdAndUpdate(shipmentId, {
      status: ShipmentStatus.DELIVERED,
    });

    res.status(200).json({
      status: "success",
    });
  } catch {
    return next(new AppError("Error updating shipment status", 400));
  }
});

exports.handleDeliveredShipmentRTV = catchAsyncErrors(
  async (req, res, next) => {
    const userId = req.user._id;
    const shipmentId = req.body.id;
    const orders = req.body.orders;
    const reason = req.body.reason;

    try {
      let shipment = await Shipment.findById(shipmentId);
      let payment = await Payment.findById(shipment.payment);

      orders?.map((obj) => {
        payment.rtvOrders.push({
          orderNo: mongoose.Types.ObjectId(obj.orderNo._id),
          returnQty: obj.orderNo.quantity - obj.deductedQty,
        });
      });

      await payment.save();

      shipment.status = ShipmentStatus.RTV_PENDING;
      shipment.rtvReason = reason;

      await shipment.save();

      res.status(200).json({
        status: "success",
      });
    } catch (error) {
      return next(new AppError("Error updating shipment status", 400));
    }
  }
);

exports.handleRTVAcceptance = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id;
  const shipmentId = req.params.id;

  try {
    await Shipment.findByIdAndUpdate(shipmentId, {
      status: ShipmentStatus.RTV_CONFIRMED,
    });

    res.status(200).json({
      status: "success",
    });
  } catch {
    return next(new AppError("Error updating shipment status", 400));
  }
});

exports.handleRTVAwaiting = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id;
  const shipmentId = req.body.id;
  const awb = req.body.awb;

  try {
    const flow = await SellerBoardFlowSetup.findOne({ user: userId });

    let status;

    if (flow.B2B.flowControl.shipments.returning.shipped) {
      status = ShipmentStatus.RTV_SHIPPED;
    } else {
      status = ShipmentStatus.RTV_DELIVERED;
    }

    await Shipment.findByIdAndUpdate(shipmentId, {
      status,
      rtvAwbNumber: awb,
    });

    res.status(200).json({
      status: "success",
    });
  } catch {
    return next(new AppError("Error updating shipment status", 400));
  }
});
