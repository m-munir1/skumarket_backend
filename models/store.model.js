const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema(
    {
        store_name: {
            type: String,
            required: [true, "Store name is required"],
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: [true, "Product id is required"],
        },
        store_id: {
            type: String,
            required: [true, "Store id is required"],
        },
        store_offer_price: {
            type: Number,
        },
        store_rating: {
            type: Number,
        },
        store_soh: {
            type: Number,
        },
        store_offer_rank: {
            type: Number,
        },
        store_fulfilment_type: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

// add compound index
storeSchema.index({ store_id: 1, product: 1 }, { unique: true });

const Store = mongoose.model("Store", storeSchema);

module.exports = Store;
