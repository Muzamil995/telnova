import mongoose from "mongoose";
import { getEmptyBankDetails } from "@/lib/partner-utils";

const partnerPaymentMethodSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["paypal", "bank", null],
      default: null,
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
        default: getEmptyBankDetails().accountHolderName,
        trim: true,
      },
      bankName: {
        type: String,
        default: getEmptyBankDetails().bankName,
        trim: true,
      },
      accountNumber: {
        type: String,
        default: getEmptyBankDetails().accountNumber,
        trim: true,
      },
      routingNumber: {
        type: String,
        default: getEmptyBankDetails().routingNumber,
        trim: true,
      },
      accountType: {
        type: String,
        enum: ["checking", "savings"],
        default: getEmptyBankDetails().accountType,
      },
    },
  },
  { _id: false },
);

const partnerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    partnerName: {
      type: String,
      required: [true, "Partner name is required"],
      trim: true,
    },
    partnerTFN: {
      type: String,
      required: [true, "Partner TFN is required"],
      trim: true,
      unique: true,
    },
    currentBalance: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalWithdrawn: {
      type: Number,
      default: 0,
      min: 0,
    },
    paymentMethod: {
      type: partnerPaymentMethodSchema,
      default: () => ({ type: null, paypalEmail: "", bankDetails: {} }),
    },
  },
  {
    timestamps: true,
  },
);

partnerSchema.index({ partnerName: 1 });
partnerSchema.index({ partnerTFN: 1 });

const Partner =
  mongoose.models.Partner || mongoose.model("Partner", partnerSchema);

export default Partner;
