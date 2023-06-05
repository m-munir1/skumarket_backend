const BillingInfo = require("../models/billingInfo.model");
const User = require("../models/user.model");
const catchAsyncErrors = require("../util/catchAsyncErrors");
const  {Types}  = require("mongoose");

// Add a new address
exports.addAddress = catchAsyncErrors(async (req, res, next) => {
  const {
    phone,
    address,
    city,
    state,
    country,
    zipCode,
    location,
    isDefault
  } = req.body;
  const userId = req.user._id;
  const billingInfo = await BillingInfo.findOne({ userId });

  await billingInfo.addresses.push(req.body);
  await billingInfo.save();
  const info = billingInfo.addresses[billingInfo.addresses.length - 1];

  if (!billingInfo.defaultAddress) {
    await User.updateOne({_id: userId}, {phone, location, address, city, state, country, zipCode}, {runValidators: false});
    // info.isApproved = true;
    billingInfo.addresses[billingInfo.addresses.length - 1].isApproved = true;
    billingInfo.defaultAddress = info._id;
    await billingInfo.save();
  }

  if(isDefault) {
    billingInfo.defaultAddress = info._id;
    await billingInfo.save();
  }

  res.status(200).json({
    success: true,
    message: "New Address Added",
    data: { address: info, defaultAddress: billingInfo.defaultAddress },
  });
});

// Get user billing addresses by user id
exports.getBillingInfo = catchAsyncErrors(async (req, res, next) => {
  const data = await BillingInfo.findOne({ userId: req.user._id });

  res.status(200).json({
    success: true,
    data: { addresses: data.addresses, defaultAddress: data.defaultAddress },
  });
});

// Update billing addresses
exports.updateBillingInfo = catchAsyncErrors(async (req, res, next) => {
  const {
    _id,
    title,
    email,
    phone,
    address,
    city,
    state,
    zipCode,
    country,
    location,
  } = req.body;
  const userId = req.user._id;

  const result = await BillingInfo.updateOne(
    { userId, "addresses._id": _id },
    {
      $set: {
        "addresses.$.title": title,
        "addresses.$.email": email,
        "addresses.$.phone": phone,
        "addresses.$.address": address,
        "addresses.$.city": city,
        "addresses.$.state": state,
        "addresses.$.zipCode": zipCode,
        "addresses.$.country": country,
        "addresses.$.location": location,
        "addresses.$.isApproved": false,
      }
    },
    { runValidators: false }
  );

  const result2 = await BillingInfo.updateOne(
    { userId },
    [
      {
        $set: {
          "defaultAddress": {
            $cond: {
              if: {
                $eq: [Types.ObjectId(_id), { $getField: "defaultAddress" }]
              },
              then: "",
              else: "$defaultAddress",
            }
          }
        }
      }
    ],
    { runValidators: false }
  );

  res.status(200).json({
    success: true,
    message: "Address updated",
    data: result,
  });
});

// Update Default address
exports.updateDefaultAddress = catchAsyncErrors(async(req, res, next) => {
  const userId = req.user._id;
  const { addressId } = req.body;

  const result = await BillingInfo.updateOne(
    {userId},
    {defaultAddress: addressId},
    {runValidators: true}
  );

  res.status(200).json({
    success: true,
    message: "Default Address Updated"
  });
});
