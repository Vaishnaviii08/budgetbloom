import mongoose from "mongoose";
const { Schema } = mongoose;
import cron from "node-cron";

const CATEGORY_OPTIONS = [
  'food', 'rent', 'transport', 'entertainment', 'shopping', 'bills', 'health', 'education', 'other',
];

const EMOTION_OPTIONS = ['happy', 'sad', 'stressed', 'neutral', 'guilty', 'excited'];

const transactionSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["income", "expense"],
    required: true,
  },
  category: {
    type: String,
    enum : CATEGORY_OPTIONS,
    validate: {
      validator: function (value) {
        // only validate if type is 'expense'
        return this.type !== 'expense' || CATEGORY_OPTIONS.includes(value);
      },
      message: 'Invalid or missing category for expense transaction',
    },
    trim: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  emotion: {
    type: String,
    enum: EMOTION_OPTIONS,
    validate: {
      validator: function (value) {
        // only validate if type is 'expense'
        return this.type !== 'expense' || EMOTION_OPTIONS.includes(value);
      },
      message: 'Emotion is required and must be valid for expense transactions',
    },
    default: undefined, // so it fails validation if missing when required
  },
  note: {
    type: String,
    maxlength: 100,
    default: '',
  },
  date: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
