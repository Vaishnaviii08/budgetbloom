import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  pinHash: {
    type: String,
    required: false,
  },
  currentBalance: {
    type: Number,
    default: 0,
  },
  monthlyEarnings: {
    type: Number,
    default: 0,
  },
  monthlySpendings: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);
export default User;
