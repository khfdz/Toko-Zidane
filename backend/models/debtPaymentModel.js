const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const debtPaymentSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  payDebt_id: {
    type: String,
    required: true,
    unique: true,
    default: function() {
      return `DB-${uuidv4().split('-')[0].toUpperCase()}`; // Generate ID like PD-1234
    }
  },
  amount: {
    type: Number,
    required: true
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  orders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  }]
});

const DebtPayment = mongoose.model('DebtPayment', debtPaymentSchema);

module.exports = DebtPayment;
