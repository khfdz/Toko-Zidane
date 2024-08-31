const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    match: [/^\+?([0-9]{1,3})?([0-9]{10})$/, 'Please add a valid phone number'],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  address: {
    type: String,
    default: ''
  },
  profilePhoto: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    default: '',
    unique: true
  },
  storePhotos: {
    type: [String], // Array of strings to store multiple photo URLs or paths
    validate: {
      validator: function(value) {
        return value.length <= 4; // Maximum 4 photos allowed
      },
      message: 'You can upload a maximum of 4 photos'
    },
    default: []
  },
  debt: {
    type: Number,
    default: 0
  },
  orderHistory: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    }
  ]
}, { timestamps: true });

// Hash the password before saving
userSchema.pre('save', async function(next) {
  try {
    if (!this.isModified('password')) {
      return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
