const mongoose = require("mongoose");
const { PaymentStatus } = require("../util/OrderStatus");

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: [true, "User is required"],
  },
  seller: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: [false, "Seller is required"],
  },
  orders: [
    {
      orderNo: {
        type: mongoose.Types.ObjectId,
        ref: "Order",
        required: [true, "Order is required"],
      },
      deductedQty: {
        type: Number,
        default: 0,
      },
    },
  ],
  rtvOrders: [
    {
      orderNo: {
        type: mongoose.Types.ObjectId,
        ref: "Order",
      },
      returnQty: {
        type: Number,
        default: 0,
      },
    },
  ],  
  totalQty: {
    type: Number,
    required: [true, "Qty is required"],
  },
  totalAmount: {
    type: Number,
    required: [true, "Amount is required"],
  },
  marketplace: {
    type: String,
    required: [true, "Marketplace is required"],
  },
  currency: {
    type: String,
    required: [true, "Currency is required"],
  },
  vat: {
    type: Number,
    required: [true, "VAT is required"],
  },
  invoiceNo: {
    type: String,
  },
  paymentType: {
    type: String,
  },
  status: {
    type: String,
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  },
});

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;
