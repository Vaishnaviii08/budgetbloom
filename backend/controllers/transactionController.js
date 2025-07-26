import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

//Route to create transaction
export const createTransaction = async (req, res) => {
  try {
    const { type, category, amount, emotion, note, date } = req.body;

    if (!type || !["income", "expense"].includes(type)) {
      return res.status(400).json({ error: "Type must be income or expense" });
    }

    if (typeof amount !== "number" || amount < 0) {
      return res
        .status(400)
        .json({ error: "Amount must be a non-negative number" });
    }

    if (type === "expense" && (!category || !emotion)) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const transactionDate = date ? new Date(date) : new Date();

    const newTransaction = new Transaction({
      userId: req.user.userId,
      type,
      category: type === "expense" ? category : undefined,
      amount,
      emotion: type === "expense" ? emotion : undefined,
      note,
      date: transactionDate,
    });

    await newTransaction.save();

    user.currentBalance += type === "income" ? amount : -amount;

    const now = new Date();
    const isSameMonth = transactionDate.getMonth() === now.getMonth() && transactionDate.getFullYear() === now.getFullYear();

    if(isSameMonth) {
      if(type === "income") {
        user.monthlyEarnings += amount;
      } else if(type === "expense") {
        user.monthlySpendings += amount;
      }
    }

    await user.save();

    res.status(201).json({
      message: "Transaction added successfully",
      Transaction: newTransaction,
    });
  } catch (error) {
    console.error("Error while adding transaction : ", error.message);
    res.status(500).json({ message: "Servor error please try again later" });
  }
};

//Route to get transaction
export const getTransactions = async (req, res) => {
  try {
    const userId = req.user.userId; // decoded from JWT

    const transactions = await Transaction.find({ userId }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: transactions.length,
      transactions,
    });
  } catch (error) {
    console.log("Error fetching transactions: ", error.message);
    res.status(500).json({ message: "Server error. Please try again later" });
  }
};

//Route to edit a transaction
export const editTransaction = async (req, res) => {
  try {
    const transactionId = req.params.id;
    const userId = req.user.userId;
    const { type, category, amount, emotion, note, date } = req.body;

    //Check if transaction exists
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found." });
    }

    //Ensure the transaction belongs to the user
    if (transaction.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "Unauthorized to edit this transaction." });
    }

    // Get original data before modifying
    const originalAmount = transaction.amount;
    const originalType = transaction.type;
    const originalDate = new Date(transaction.date);

    // Fetch user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // 1. Reverse original transaction effect
    const now = new Date();
    const isOriginalSameMonth =
      originalDate.getMonth() === now.getMonth() &&
      originalDate.getFullYear() === now.getFullYear();

    if (originalType === "income") {
      user.currentBalance -= originalAmount;
      if (isOriginalSameMonth) {
        user.monthlyEarnings -= originalAmount;
      }
    } else if (originalType === "expense") {
      user.currentBalance += originalAmount;
      if (isOriginalSameMonth) {
        user.monthlySpendings -= originalAmount;
      }
    }

    //Type-specific validation
    if (type) {
      if (!["income", "expense"].includes(type)) {
        return res
          .status(400)
          .json({ error: "Type must be 'income' or 'expense'." });
      }

      const prevCategory = transaction.category;
      const prevEmotion = transaction.emotion;
      
      transaction.type = type;

      if (type === "income") {
        transaction.set("category", undefined, { strict: false });
        transaction.set("emotion", undefined, { strict: false });
      } else if (type === "expense") {
        if (!prevCategory || !prevEmotion) {
          return res
            .status(400)
            .json({ error: "Expense must include category and emotion." });
        }
        transaction.category = category;
        transaction.emotion = emotion;
      }
    }

    if (amount !== undefined) {
      if (typeof amount !== "number" || amount < 0) {
        return res
          .status(400)
          .json({ error: "Amount must be a non-negative number." });
      }
      transaction.amount = amount;
    }

    //Update fields only if they are present in the request
    if (note !== undefined) transaction.note = note;
    if (date !== undefined) transaction.date = date;

    await transaction.save();

    // 2. Apply updated transaction effect
    const newAmount = transaction.amount;
    const newType = transaction.type;
    const newDate = new Date(transaction.date);
    const isNewSameMonth =
      newDate.getMonth() === now.getMonth() &&
      newDate.getFullYear() === now.getFullYear();

    if (newType === "income") {
      user.currentBalance += newAmount;
      if (isNewSameMonth) {
        user.monthlyEarnings += newAmount;
      }
    } else if (newType === "expense") {
      user.currentBalance -= newAmount;
      if (isNewSameMonth) {
        user.monthlySpendings += newAmount;
      }
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Transaction updated successfully.",
      transaction,
    });
  } catch (error) {
    console.error("Error updating transaction:", error.message);
    res.status(500).json({ error: "Server error." });
  }
};

//Route to delete a transaction
export const deleteTransaction = async (req, res) => {
  try {
    const userId = req.user.userId;
    const transactionId = req.params.id;

    // Step 1: Find the transaction and verify ownership
    const transaction = await Transaction.findOne({
      _id: transactionId,
      userId,
    });

    if (!transaction) {
      return res
        .status(404)
        .json({ error: "Transaction not found or unauthorized" });
    }

    // Step 2: Fetch the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const transactionDate = new Date(transaction.date);
    const now = new Date();

    const isSameMonth =
      transactionDate.getMonth() === now.getMonth() &&
      transactionDate.getFullYear() === now.getFullYear();

    const { amount, type } = transaction;

    // Always update currentBalance
    if (type === "income") {
      user.currentBalance -= amount;
      if (isSameMonth) {
        user.monthlyEarnings -= amount;
      }
    } else if (type === "expense") {
      user.currentBalance += amount;
      if (isSameMonth) {
        user.monthlySpendings -= amount;
      }
    }

    await user.save();

    // Step 3: Delete the transaction
    await Transaction.deleteOne({ _id: transactionId });

    return res
      .status(200)
      .json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Error deleting transaction:", error.message);
    return res
      .status(500)
      .json({ error: "Server error while deleting transaction" });
  }
};
