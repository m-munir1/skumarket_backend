const mongoose = require("mongoose");
const AlertHandler = require("../util/AlertHelper");
const getDailyTradeValue = require("../util/getDailyTradeValue");
const getMonthlyTradeValue = require("../util/getMonthlyTradeValue");
const getWeeklyTradeValue = require("../util/getWeeklyTradeValue");
const getYearlyTradeValue = require("../util/getYearlyTradeValue");
const Alert = require("./alert.model");
const priceModel = require("./price.model");
const Stock = require("./stock.model");

// create a produce model
const productSchema = new mongoose.Schema(
    {
        // static data for the product
        sku: {
            type: String,
            required: [true, "sku is required"],
        },
        sku_url: {
            type: String,
            required: [true, "sku url is required"],
        },
        sku_marketplace: {
            type: String,
            default: "noon/ksa",
            enum: [
                "noon/ksa",
                "noon/uae",
                "noon/egypt",
                "amazon/ksa",
                "amazon/uae",
                "jumia/egypt",
                "amazon/egypt",
            ],
        },
        title_en: {
            type: String,
            required: [true, "title_en is required"],
            maxLength: [500, "Title cannot be more than 150 characters"],
        },
        title_ar: {
            type: String,
        },
        brand_en: {
            type: String,
        },
        brand_ar: {
            type: String,
        },
        all_images: {
            type: [String],
        },
        description_en: {
            type: String,
            required: [true, "description_en is required"],
        },
        description_ar: {
            type: String,
        },
        category_en: {
            type: String,
        },
        category_ar: {
            type: String,
        },
        sku_type_en: {
            type: String,
        },
        sku_type_ar: {
            type: String,
        },
        sku_sub_type_en: {
            type: String,
        },
        sku_sub_type_ar: {
            type: String,
        },

        // dynamic data for the product

        views: {
            type: Number,
            default: 1,
        },

        category_live_sku: {
            type: Number,
            default: 0,
        },
        tags: {
            type: [String],
        },
        sku_rate: {
            type: Number,
            default: 0,
        },
        sku_rank: {
            type: Number,
            default: 0,
        },
        is_live: {
            type: Boolean,
            default: false,
        },
        estimated_SOH: {
            type: Number,
            default: 0,
        },
        stock_history: [
            {
                price: {
                    type: Number,
                    default: 0,
                },
                date: {
                    type: Date,
                    required: [true, "date is required"],
                },
            },
        ],
        daily_stock: [
            {
                price: {
                    type: Number,
                    default: 0,
                },
                date: {
                    type: Date,
                    required: [true, "date is required"],
                },
            },
        ],
        weekly_stock: [
            {
                price: {
                    type: Number,
                    default: 0,
                },
                date: {
                    type: Date,
                    required: [true, "date is required"],
                },
            },
        ],
        monthly_stock: [
            {
                price: {
                    type: Number,
                    default: 0,
                },
                date: {
                    type: Date,
                    required: [true, "date is required"],
                },
            },
        ],
        yearly_stock: [
            {
                price: {
                    type: Number,
                    default: 0,
                },
                date: {
                    type: Date,
                    required: [true, "date is required"],
                },
            },
        ],
        buy_box_currency: {
            type: String,
            default: "SAR",
        },
        current_price: {
            type: Number,
        },
        buy_box_sku_fulfillment_type: {
            type: String,
        },
        number_of_sellers: {
            type: Number,
            default: 0,
        },
        stores: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Store",
            },
        ],
        total_stock: {
            type: Number,
            default: 0,
            select: false,
        },
        est_market_cap: {
            type: Number,
        },
        market_cap_history: [
            {
                price: {
                    type: Number,
                    default: 0,
                },
                date: {
                    type: Date,
                    required: [true, "date is required"],
                },
            },
        ],
        daily_market_cap: [
            {
                price: {
                    type: Number,
                    default: 0,
                },
                date: {
                    type: Date,
                    required: [true, "date is required"],
                },
            },
        ],
        weekly_market_cap: [
            {
                price: {
                    type: Number,
                    default: 0,
                },
                date: {
                    type: Date,
                    required: [true, "date is required"],
                },
            },
        ],
        monthly_market_cap: [
            {
                price: {
                    type: Number,
                    default: 0,
                },
                date: {
                    type: Date,
                    required: [true, "date is required"],
                },
            },
        ],
        yearly_market_cap: [
            {
                price: {
                    type: Number,
                    default: 0,
                },
                date: {
                    type: Date,
                    required: [true, "date is required"],
                },
            },
        ],
        trade_value: {
            type: Number,
            default: 0,
        },
        trade_value_history: [
            {
                price: {
                    type: Number,
                    default: 0,
                },
                date: {
                    type: Date,
                    required: [true, "date is required"],
                },
            },
        ],
        daily_trade_value: [
            {
                price: {
                    type: Number,
                    default: 0,
                },
                date: {
                    type: Date,
                    required: [true, "date is required"],
                },
            },
        ],
        weekly_trade_value: [
            {
                price: {
                    type: Number,
                    default: 0,
                },
                date: {
                    type: Date,
                    required: [true, "date is required"],
                },
            },
        ],
        monthly_trade_value: [
            {
                price: {
                    type: Number,
                    default: 0,
                },
                date: {
                    type: Date,
                    required: [true, "date is required"],
                },
            },
        ],
        yearly_trade_value: [
            {
                price: {
                    type: Number,
                    default: 0,
                },
                date: {
                    type: Date,
                    required: [true, "date is required"],
                },
            },
        ],
        est_net_revenue: {
            type: Number,
            default: 0,
        },
        days_on_hand: {
            type: Number,
            default: 0,
        },
        EQTI: {
            type: Number,
            default: 0,
        },
        sold_24_hours: {
            type: Number,
            default: 0,
        },
        sold_24_hours_history: [
            {
                price: {
                    type: Number,
                    default: 0,
                },
                date: {
                    type: Date,
                    required: [true, "date is required"],
                },
            },
        ],
        daily_sold_24_hours: [
            {
                price: {
                    type: Number,
                    default: 0,
                },
                date: {
                    type: Date,
                    required: [true, "date is required"],
                },
            },
        ],
        weekly_sold_24_hours: [
            {
                price: {
                    type: Number,
                    default: 0,
                },
                date: {
                    type: Date,
                    required: [true, "date is required"],
                },
            },
        ],
        monthly_sold_24_hours: [
            {
                price: {
                    type: Number,
                    default: 0,
                },
                date: {
                    type: Date,
                    required: [true, "date is required"],
                },
            },
        ],
        yearly_sold_24_hours: [
            {
                price: {
                    type: Number,
                    default: 0,
                },
                date: {
                    type: Date,
                    required: [true, "date is required"],
                },
            },
        ],
        price_change: {
            type: Number,
            default: 0,
        },
        average_selling_price: {
            type: Number,
            default: 0,
        },
        volume_to_market_cap_ratio: {
            type: Number,
            default: 0,
        },
        estimated_margin: {
            type: Number,
            default: 0,
        },
        max_investment: {
            type: Number,
            default: 0,
        },
        min_investment: {
            type: Number,
            default: 0,
        },
        price_updated_at: {
            type: Date,
        },

        sub_category: {
            type: String,
        },
        sellers: [
            {
                type: String,
            },
        ],
        sky_type: {
            type: String,
        },
        demand_percentage: {
            type: Number,
            default: 0,
        },
        supply_percentage: {
            type: Number,
            default: 0,
        },
        watch_list: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        alert_list: {
            type: Number,
            default: 0,
        },
        getTopBottomPrice: {
            topPrice: {
                last24Hours: {
                    type: Number,
                    default: 0,
                },
                last7Days: {
                    type: Number,
                    default: 0,
                },
                last2Weeks: {
                    type: Number,
                    default: 0,
                },
                last30Days: {
                    type: Number,
                    default: 0,
                },
            },
            bottomPrice: {
                last24Hours: {
                    type: Number,
                    default: 0,
                },
                last7Days: {
                    type: Number,
                    default: 0,
                },
                last2Weeks: {
                    type: Number,
                    default: 0,
                },
                last30Days: {
                    type: Number,
                    default: 0,
                },
            },
        },
        yearlyPrice: [
            {
                price: {
                    type: Number,
                    default: 0,
                },
                date: {
                    type: Date,
                    required: [true, "date is required"],
                },
            },
        ],
        monthlyPrice: [
            {
                price: {
                    type: Number,
                    default: 0,
                },
                date: {
                    type: Date,
                    required: [true, "date is required"],
                },
            },
        ],
        weeklyPrice: [
            {
                price: {
                    type: Number,
                    default: 0,
                },
                date: {
                    type: Date,
                    required: [true, "date is required"],
                },
            },
        ],
        dailyPrice: [
            {
                price: {
                    type: Number,
                    default: 0,
                },
                date: {
                    type: Date,
                    required: [true, "date is required"],
                },
            },
        ],
        opp_stock: {
            type: Boolean,
            default: false,
        },
        opp_ff: {
            type: Boolean,
            default: false,
        },
        opp_other_platform: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// set index with sku and marketplace
productSchema.index({ sku: 1, sku_marketplace: 1 }, { unique: true });

productSchema.pre("save", async function (next) {
    // if total stock is modified, update the estimated SOH
    if (this.isModified("total_stock")) {
        const est_stock = this.total_stock * 0.2;

        this.sold_24_hours =
            this.estimated_SOH > est_stock
                ? this.estimated_SOH - est_stock
                : this.estimated_SOH;

        // estimate the SOH is 20% of the total stock
        this.estimated_SOH = est_stock;
    }

    // if estimated SOH is modified, update the est_market_cap
    if (this.isModified("estimated_SOH") || this.isModified("current_price")) {
        // update the est_market_cap
        this.est_market_cap = (
            (this.estimated_SOH || 0) * (this.current_price || 0)
        ).toFixed(2);

        let trade_value = (this.current_price || 0) * this.sold_24_hours;

        // if trade value is a number fixed to 2 decimal places
        if (!isNaN(trade_value)) this.trade_value = trade_value.toFixed(2);

        // update the days on hand
        this.days_on_hand = Math.ceil(
            this.estimated_SOH /
                ((this.est_net_revenue * this.sold_24_hours) / 365)
        );

        this.EQTI = Math.ceil(
            (this.min_investment / this.average_selling_price) *
                (30 - this.days_on_hand)
        );
    }

    // if current price is modified, update the trade value
    if (this.isModified("current_price")) {
        // update the est_net_revenue
        this.est_net_revenue = (
            this.current_price -
            this.current_price * 0.25
        ).toFixed(2);

        // update max investment
        this.max_investment = (
            this.trade_value -
            this.current_price * 0.25 * this.sold_24_hours
        ).toFixed(2);

        // update min investment
        this.min_investment = this.max_investment / 4;
        // x/ 4 == x * 0.25

        // margin is 9% of the est_net_revenue
        this.estimated_margin = (
            this.est_net_revenue *
            this.estimated_SOH *
            0.09
        ).toFixed(2);
    }

    // if trade value or estimate market cap are modified, update the volume to market cap ratio
    if (this.isModified("trade_value") || this.isModified("est_market_cap")) {
        this.volume_to_market_cap_ratio = (
            this.trade_value / this.est_market_cap
        ).toFixed(2);
    }

    // estimate stock on hand is changed, update the days on hand
    if (this.isModified("estimated_SOH")) {
        // update demand_percentage
        this.demand_percentage = (
            (this.sold_24_hours / this.estimated_SOH) *
            100
        ).toFixed(2);

        // update supply_percentage
        this.supply_percentage = 100 - this.demand_percentage;
    }

    // if is_live is modified, update all Alert live for this product
    if (
        this.isModified("is_live") ||
        this.isModified("estimated_SOH") ||
        this.isModified("current_price") ||
        this.isModified("number_of_sellers") ||
        this.isModified("buy_box_sku_fulfillment_type")
    ) {
        AlertHandler({
            _id: this._id,
            is_live: this.is_live,
            price: this.current_price,
            stock: this.estimated_SOH,
            store: this.number_of_sellers,
            fulfillment_type: this.buy_box_sku_fulfillment_type,
        });
    }

    // opp_stock
    // estimated_SOH  = 0 && is_live = false && created_at > 3 days
    if (this.isModified("estimated_SOH") || this.isModified("is_live")) {
        if (this.estimated_SOH === 0 && this.is_live === false) {
            const created_at = new Date(this.createdAt);
            const now = new Date();
            const diffTime = Math.abs(now - created_at);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays > 3) {
                this.opp_stock = true;
            }
        }
    }

    // opp_ff
    //is_live: true && buy_box_sku_fulfillment_type === 'Fulfilled by Stores' && demand_percentage >= 50
    if (
        this.isModified("is_live") ||
        this.isModified("buy_box_sku_fulfillment_type") ||
        this.isModified("demand_percentage")
    ) {
        if (
            this.is_live === true &&
            this.buy_box_sku_fulfillment_type === "Fulfilled by Stores" &&
            this.demand_percentage >= 50
        ) {
            this.opp_ff = true;
        }
    }

    // if trade_value is modified store the value in the trade_value_history array
    if (this.isModified("trade_value")) {
        this.trade_value_history.push({
            price: this.trade_value,
            date: new Date(),
        });

        this.daily_trade_value = getDailyTradeValue(this.trade_value_history);
        this.weekly_trade_value = getWeeklyTradeValue(this.trade_value_history);
        this.yearly_trade_value = getYearlyTradeValue(this.trade_value_history);
        this.monthly_trade_value = getMonthlyTradeValue(
            this.trade_value_history
        );
    }

    if (this.isModified("est_market_cap")) {
        this.market_cap_history.push({
            price: this.est_market_cap,
            date: new Date(),
        });

        this.daily_market_cap = getDailyTradeValue(this.market_cap_history);
        this.weekly_market_cap = getWeeklyTradeValue(this.market_cap_history);
        this.yearly_market_cap = getYearlyTradeValue(this.market_cap_history);
        this.monthly_market_cap = getMonthlyTradeValue(this.market_cap_history);
    }

    // if estimated_SOH is modified
    if (this.isModified("estimated_SOH")) {
        this.stock_history.push({
            price: this.estimated_SOH,
            date: new Date(),
        });

        this.daily_stock = getDailyTradeValue(this.stock_history);
        this.weekly_stock = getWeeklyTradeValue(this.stock_history);
        this.yearly_stock = getYearlyTradeValue(this.stock_history);
        this.monthly_stock = getMonthlyTradeValue(this.stock_history);
    }

    // if sold_24_hours is modified
    if (this.isModified("sold_24_hours")) {
        this.sold_24_hours_history.push({
            price: this.sold_24_hours,
            date: new Date(),
        });

        this.daily_sold_24_hours = getDailyTradeValue(
            this.sold_24_hours_history
        );
        this.weekly_sold_24_hours = getWeeklyTradeValue(
            this.sold_24_hours_history
        );
        this.yearly_sold_24_hours = getYearlyTradeValue(
            this.sold_24_hours_history
        );
        this.monthly_sold_24_hours = getMonthlyTradeValue(
            this.sold_24_hours_history
        );
    }

    next();
});

// create a product model
const Product = mongoose.model("Product", productSchema);
module.exports = Product;
