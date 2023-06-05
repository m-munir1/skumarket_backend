const mongoose = require("mongoose");

const sellerBoardFlowSetupSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    B2B: {
      promisingTime: {
        orders: {
          requestNew: {
            sameCityProcessingDays: {
              type: Number,
              default: 3,
            },
            sameCountryProcessingDays: {
              type: Number,
              default: 3,
            },
            worldwideProcessingDays: {
              type: Number,
              default: 3,
            },
          },
          requestReview: {
            sameCityProcessingDays: {
              type: Number,
              default: 3,
            },
            sameCountryProcessingDays: {
              type: Number,
              default: 3,
            },
            worldwideProcessingDays: {
              type: Number,
              default: 3,
            },
          },
        },
        payments: {
          pending: {
            sameCityProcessingDays: {
              type: Number,
              default: 3,
            },
            sameCountryProcessingDays: {
              type: Number,
              default: 3,
            },
            worldwideProcessingDays: {
              type: Number,
              default: 3,
            },
          },
        },
        shipments: {
          preparing: {
            pick: {
              sameCityProcessingDays: {
                type: Number,
                default: 3,
              },
              sameCountryProcessingDays: {
                type: Number,
                default: 3,
              },
              worldwideProcessingDays: {
                type: Number,
                default: 3,
              },
            },
            pack: {
              sameCityProcessingDays: {
                type: Number,
                default: 3,
              },
              sameCountryProcessingDays: {
                type: Number,
                default: 3,
              },
              worldwideProcessingDays: {
                type: Number,
                default: 3,
              },
            },
            readyToDeliver: {
              sameCityProcessingDays: {
                type: Number,
                default: 3,
              },
              sameCountryProcessingDays: {
                type: Number,
                default: 3,
              },
              worldwideProcessingDays: {
                type: Number,
                default: 3,
              },
            },
          },
          shipping: {
            shipped: {
              sameCityProcessingDays: {
                type: Number,
                default: 3,
              },
              sameCountryProcessingDays: {
                type: Number,
                default: 7,
              },
              worldwideProcessingDays: {
                type: Number,
                default: 14,
              },
            },
            delivered: {
              sameCityProcessingDays: {
                type: Number,
                default: 3,
              },
              sameCountryProcessingDays: {
                type: Number,
                default: 3,
              },
              worldwideProcessingDays: {
                type: Number,
                default: 3,
              },
            },
          },
          returning: {
            acceptance: {
              sameCityProcessingDays: {
                type: Number,
                default: 3,
              },
              sameCountryProcessingDays: {
                type: Number,
                default: 3,
              },
              worldwideProcessingDays: {
                type: Number,
                default: 3,
              },
            },
            awaiting: {
              sameCityProcessingDays: {
                type: Number,
                default: 3,
              },
              sameCountryProcessingDays: {
                type: Number,
                default: 3,
              },
              worldwideProcessingDays: {
                type: Number,
                default: 3,
              },
            },
            shipped: {
              sameCityProcessingDays: {
                type: Number,
                default: 3,
              },
              sameCountryProcessingDays: {
                type: Number,
                default: 7,
              },
              worldwideProcessingDays: {
                type: Number,
                default: 14,
              },
            },
            delivered: {
              sameCityProcessingDays: {
                type: Number,
                default: 3,
              },
              sameCountryProcessingDays: {
                type: Number,
                default: 3,
              },
              worldwideProcessingDays: {
                type: Number,
                default: 3,
              },
            },
          },
        },
      },
      flowControl: {
        shipments: {
          preparing: {
            pick: {
              type: Boolean,
              default: false,
            },
            pack: {
              type: Boolean,
              default: false,
            },
            readyToDeliver: {
              type: Boolean,
              default: true,
            },
          },
          shipping: {
            shipped: {
              type: Boolean,
              default: false,
            },
            delivered: {
              type: Boolean,
              default: true,
            },
          },
          returning: {
            acceptance: {
              type: Boolean,
              default: true,
            },
            awaiting: {
              type: Boolean,
              default: true,
            },
            shipped: {
              type: Boolean,
              default: false,
            },
            delivered: {
              type: Boolean,
              default: true,
            },
          },
        },
      },
    },
    B2C: {
      promisingTime: {
        orders: {
          requestNew: {
            sameCityProcessingDays: {
              type: Number,
              default: 3,
            },
            sameCountryProcessingDays: {
              type: Number,
              default: 3,
            },
            worldwideProcessingDays: {
              type: Number,
              default: 3,
            },
          },
        },
        shipments: {
          preparing: {
            pick: {
              sameCityProcessingDays: {
                type: Number,
                default: 3,
              },
              sameCountryProcessingDays: {
                type: Number,
                default: 3,
              },
              worldwideProcessingDays: {
                type: Number,
                default: 3,
              },
            },
            pack: {
              sameCityProcessingDays: {
                type: Number,
                default: 3,
              },
              sameCountryProcessingDays: {
                type: Number,
                default: 3,
              },
              worldwideProcessingDays: {
                type: Number,
                default: 3,
              },
            },
            readyToDeliver: {
              sameCityProcessingDays: {
                type: Number,
                default: 3,
              },
              sameCountryProcessingDays: {
                type: Number,
                default: 3,
              },
              worldwideProcessingDays: {
                type: Number,
                default: 3,
              },
            },
          },
          shipping: {
            shipped: {
              sameCityProcessingDays: {
                type: Number,
                default: 3,
              },
              sameCountryProcessingDays: {
                type: Number,
                default: 7,
              },
              worldwideProcessingDays: {
                type: Number,
                default: 14,
              },
            },
          },
          returning: {
            acceptance: {
              sameCityProcessingDays: {
                type: Number,
                default: 3,
              },
              sameCountryProcessingDays: {
                type: Number,
                default: 3,
              },
              worldwideProcessingDays: {
                type: Number,
                default: 3,
              },
            },
            awaiting: {
              sameCityProcessingDays: {
                type: Number,
                default: 3,
              },
              sameCountryProcessingDays: {
                type: Number,
                default: 3,
              },
              worldwideProcessingDays: {
                type: Number,
                default: 3,
              },
            },
            delivered: {
              sameCityProcessingDays: {
                type: Number,
                default: 3,
              },
              sameCountryProcessingDays: {
                type: Number,
                default: 3,
              },
              worldwideProcessingDays: {
                type: Number,
                default: 3,
              },
            },
          },
        },
      },
      flowControl: {
        orders: {
          requestsNew: {
            type: Boolean,
            default: true,
          },
          requestsReview: {
            type: Boolean,
            default: false,
          },
        },
        payments: {
          pending: {
            type: Boolean,
            default: true,
          },
        },
        shipments: {
          preparing: {
            pick: {
              type: Boolean,
              default: false,
            },
            pack: {
              type: Boolean,
              default: false,
            },
            readyToDeliver: {
              type: Boolean,
              default: true,
            },
          },
          shipping: {
            shipped: {
              type: Boolean,
              default: false,
            },
            delivered: {
              type: Boolean,
              default: true,
            },
          },
          returning: {
            acceptance: {
              type: Boolean,
              default: true,
            },
            awaiting: {
              type: Boolean,
              default: true,
            },
            shipped: {
              type: Boolean,
              default: false,
            },
            delivered: {
              type: Boolean,
              default: true,
            },
          },
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

const SellerBoardFlowSetup = mongoose.model(
  "SellerBoardFlowSetup",
  sellerBoardFlowSetupSchema
);

module.exports = SellerBoardFlowSetup;
