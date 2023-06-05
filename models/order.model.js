const mongoose = require("mongoose");
const { OrderStatus } = require("../util/OrderStatus");

const orderSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: [true, "Store is required"],
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "product is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    status: {
      type: String,
      enum: OrderStatus,
      default: OrderStatus.REQUESTED,
    },
    receipt: {
      type: String,
    },
    otherAttributes: {
      paymentRefNo: {
        type: String,
      },
      shipmentNo: {
        type: String,
      },
      dispatchRefNo: {
        type: String,
      },
      rtvShipmentNo: {
        type: String,
      },
      creditNoteNo: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
