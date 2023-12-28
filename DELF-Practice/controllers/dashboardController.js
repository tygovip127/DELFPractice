const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');
const User = require('../models/userModel');
const Examination = require('../models/examinationModel');
const Result = require('../models/resultModel');
const Transaction = require('../models/transactionModel');

exports.summary = catchAsync(async (req, res, next) => {
  const users = await User.find();
  const examinations = await Examination.find();
  const results = await Result.find();
  const transactions = await Transaction.find();

  const response = {
    users,
    examinations,
    results,
    transactions,
  };

  res.status(200).json({
    status: 'success',
    data: response,
  });
});
