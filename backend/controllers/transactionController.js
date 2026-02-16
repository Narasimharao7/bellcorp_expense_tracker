import Transaction from "../models/Transaction.js";

export const createTransaction = async (req, res) => {
  const transaction = await Transaction.create({
    ...req.body,
    user: req.user._id,
  });

  res.status(201).json(transaction);
};

export const getTransactions = async (req, res) => {
  const { page = 1, limit = 10, search, category, min, max } = req.query;

  let query = { user: req.user._id };

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { notes: { $regex: search, $options: "i" } },
    ];
  }

  if (category) query.category = category;
  if (min || max)
    query.amount = {
      ...(min && { $gte: min }),
      ...(max && { $lte: max }),
    };

  const transactions = await Transaction.find(query)
    .sort({ date: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const count = await Transaction.countDocuments(query);

  res.json({
    transactions,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
  });
};

export const updateTransaction = async (req, res) => {
  const transaction = await Transaction.findById(req.params.id);

  if (!transaction || transaction.user.toString() !== req.user._id.toString()) {
    res.status(404);
    throw new Error("Transaction not found");
  }

  Object.assign(transaction, req.body);
  const updated = await transaction.save();

  res.json(updated);
};

export const deleteTransaction = async (req, res) => {
  const transaction = await Transaction.findById(req.params.id);

  if (!transaction || transaction.user.toString() !== req.user._id.toString()) {
    res.status(404);
    throw new Error("Transaction not found");
  }

  await transaction.deleteOne();
  res.json({ message: "Transaction removed" });
};
