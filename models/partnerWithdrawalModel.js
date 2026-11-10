import mongoose from "mongoose";

const paymentMethodSnapshotSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["paypal", "bank"],
      required: true,
    },
    paypalEmail: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
    },
    bankDetails: {
      accountHolderName: {
        type: String,
        default: "",
        trim: true,
      },
      bankName: {
        type: String,
        default: "",
        trim: true,
      },
      accountNumber: {
        type: String,
        default: "",
        trim: true,
      },
      routingNumber: {
        type: String,
        default: "",
        trim: true,
      },
      accountType: {
        type: String,
        enum: ["checking", "savings"],
        default: "checking",
      },
    },
  },
  { _id: false },
);

const partnerWithdrawalSchema = new mongoose.Schema(
  {
    partner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Partner",
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    partnerName: {
      type: String,
      required: true,
      trim: true,
    },
    partnerTFN: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },
    paymentMethod: {
      type: paymentMethodSnapshotSchema,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
      index: true,
    },
    requestedAt: {
      type: Date,
      default: Date.now,
    },
    paidAt: {
      type: Date,
      default: null,
    },
    paidBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

partnerWithdrawalSchema.index({ partner: 1, status: 1, requestedAt: -1 });

const PartnerWithdrawal =
  mongoose.models.PartnerWithdrawal ||
  mongoose.model("PartnerWithdrawal", partnerWithdrawalSchema);

export default PartnerWithdrawal;
