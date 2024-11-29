const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    displayName: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    role: {
      type: String,
      default: 'subscriber',
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      //required: true,
    },
    photoURL: {
      type: String,
      default: '',
    },
    uid: {
      type: String,
      unique: true,
      // required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
