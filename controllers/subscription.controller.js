const Subscription = require("../models/subscription.model");
const catchAsyncErrors = require("../util/catchAsyncErrors");
const AppError = require("../util/appError");

const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const currentDate = new Date();
const currentYear = new Date().getFullYear();


// Create a New Subscription for an User
exports.createSubscription = catchAsyncErrors(async(req, res, next) => {
  const {
    plan,
    month,
    plan_type,
  } = req.body;

  const prev = await Subscription.findOne({userId: req.user._id})
    .sort({createdAt: -1})
    .limit(1);

  // if(prev && prev.month === month && prev.year === currentYear) {
  //   return next(new AppError("Already Subscribed this month", 400));
  // }

  if(prev && prev?.ending_balance > 0.1) {
    next(new AppError('Please complete your previous payment to upgrade', 400));
  }

  const newData = {
    month: month,
    userId: req.user._id,
    plan: plan || prev?.plan,
    plan_type: plan_type,
    prev_balance: prev?.ending_balance,
  }
  const result = await Subscription.create(newData);

  res.status(201).json({
    success: true,
    message: "Subscription Successful",
    data: result,
  })
});

// Get Subscription Details
exports.getSubscription = catchAsyncErrors(async(req, res, next) => {

  // plan_status: {$ne: 'inactive'}

  const subscription = await Subscription.find({userId: req.user._id})
    .sort({ createdAt: -1 })
    .limit(12);

  res.status(200).json({
    success: true,
    data: subscription,
  })
});

// Make a payment
exports.makePayment = catchAsyncErrors(async(req, res, next) => {
  const { _id, amount, date = Date.now(), transaction_id = "SKU-123" } = req.body;
  const cost = Number(amount);

  const info = { transaction_id, cost, date};
  const data = await Subscription.findById(_id);

  data.payments.push(info);
  data.total_payment = data.total_payment + cost;
  data.ending_balance = data.ending_balance - cost;

  if(data.ending_balance <= 0.1) {
    data.plan_status = 'active';
  }

  await data.save();

  // const result = await Subscription.updateOne(
  //     { _id },
  //     { 
  //       $push: { 'payments': data },
  //       $inc: { 'total_payment': cost, 'ending_balance': -cost },
  //     },
  //     { runValidators: true }
  //   );


  res.status(200).json({
    success: true,
    message: "Payment Successful",
  })
});

// Cancel Subscription
exports.cancelSubscription = catchAsyncErrors(async(req, res, next) => {
  const { _id } = req.body;

  const prevSubscription = await Subscription.findById(_id);

  prevSubscription.plan_status = 'inactive';

  await prevSubscription.save();

  const result = await Subscription.create({ userId: req.user._id })

  res.status(200).json({
    success: true,
    message: 'Subscription cancalled',
    data: result,
  });

});