const mongoose = require("mongoose");
const { ShipmentStatus } = require("../util/ShipmentStatus");

const shipmentSchema = new mongoose.Schema(
  {
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      required: [true, "Payment is required"],
    },
    awbNumber: {
      type: String,
    },
    rtvAwbNumber: {
      type: String,
    },
    rtvReason: {
      type: String,
    },
    status: {
      type: String,
      enum: ShipmentStatus,
      default: ShipmentStatus.PREPARING,
    },
  },
  {
    timestamps: true,
  }
);

const Shipment = mongoose.model("Shipment", shipmentSchema);

module.exports = Shipment;
