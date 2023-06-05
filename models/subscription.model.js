const mongoose = require('mongoose');

const currentDate = new Date();
const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const subscriptionSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Must have an User Id"],
    },

    plan: {
      type: String,
      default: 'B2B Marketplace',
      enum: {
        values: [
          "B2B Marketplace",
          "B2C Partner Stores",
          "Data Analytics",
          "Portfolio for Other Platforms",
          "Automate Your Tasks",
          "Team Management"
        ],
        message: "Plan doesn't exist"
      }
    },

    plan_status: {
      type: String,
      default: 'pending',
      enum: {
        values: ['active', 'inactive', 'pending', 'dismissed'],
        message: "Invalid Plan Status"
      }
    },

    plan_type: {
      type: String,
      default: 'monthly',
      enum: {
        values: ['monthly', 'annually'],
        message: "Plan type should be monthly either annually"
      }
    },

    plan_start: {
      type: Date,
      default: Date.now(),
    },

    plan_end: {
      type: Date,
      default: new Date().setMonth(currentDate.getMonth() + 1),
    },

    subscription_fees: {
      type: Number,
      default: 0,
    },

    month: {
      type: String,
      default: months[currentDate.getMonth()],
    },

    year: {
      type: Number || String,
      default: currentDate.getFullYear(),
    },

    vat_rate: {
      type: Number,
      default: 15,
    },

    vat_price: {
      type: Number,
      default: 0,
    },

    net_cost: {
      type: Number,
      default: 0,
    },

    discount_rate: {
      type: Number,
      default: 0,
    },

    discount_price: {
      type: Number,
      default: 0,
    },

    promotion: {
      type: Number,
      default: 0,
    },

    prev_month: {
      type: String,
      default: months[currentDate.getMonth()-1]
    },

    prev_balance: {
      type: Number,
      default: 0,
    },

    total_cost: {
      type: Number,
      default: 0,
    },

    total_payment: {
      type: Number,
      default: 0,
    },

    payments: [
      {
        transaction_id: String,
        cost: Number,
        date: Date,
      }
    ],

    ending_balance: {
      type: Number,
      default: 0,
    },

    invoice: {
      url: String,
      id: String,
      currency: String,
      amount: Number,
      date: Date,
    }
  },
  {
    timestamps: true,
  }
);


// Setting Price accourding to plan
subscriptionSchema.pre('save', async function(next) {
  if(this.plan === "B2B Marketplace") {
    this.subscription_fees = 0;
    this.plan_status = 'active';
    this.plan_end = new Date().setFullYear(currentDate.getFullYear() + 5);
  } else if (this.plan === "B2C Partner Stores") {
    this.subscription_fees = 250;
  } else if (this.plan === "Data Analytics") {
    this.subscription_fees = 400;
  } else if (this.plan === "Portfolio for Other Platforms") {
    this.subscription_fees = 600;
  } else if (this.plan === "Automate Your Tasks") {
    this.subscription_fees = 1000;
  } else if (this.plan === "Team Management") {
    this.subscription_fees = 1500;
  }

  if(this.plan_type === 'annually') {
    this.discount_rate = 20;
    this.subscription_fees = 12 * this.subscription_fees;
    this.plan_end = new Date().setFullYear(currentDate.getFullYear() + 1);
  
    this.month = currentDate.getMonth() === 0 ? "Jan" - "Dec" : `${months[currentDate.getMonth()]} - ${months[currentDate.getMonth()-1]}`;
    this.year = currentDate.getMonth() === 0 ? currentDate.getFullYear() : `${currentDate.getFullYear().toString().substr(-2)}-${(currentDate.getFullYear()+1).toString().substr(-2)}`;
  }

  this.vat_price = (this.subscription_fees/100) * this.vat_rate;

  const discount_price = (this.subscription_fees/100) * this.discount_rate; // Discount Price
  const net_cost = this.subscription_fees + this.vat_price; // Subscription Fee + Vat (15%)
  const total_cost = net_cost - (discount_price + this.promotion); // Net cost - (Discount + Promotion)

  this.discount_price = discount_price;
  this.net_cost = net_cost;
  this.total_cost = total_cost;
  this.ending_balance = total_cost - this.total_payment;

  if(this.ending_balance < 0.1) {
    this.plan_status = 'active';
  }

  next();
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;
