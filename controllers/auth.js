const User = require('../models/user');
const admin = require('../firebase');

exports.createOrUpdateUser = async (req, res) => {
  const { name, email } = req.user;
  const user = await User.findOneAndUpdate({ email }, { name }, { new: true });

  if (user) {
    console.log('user updated', user);
    res.json(user);
  } else {
    const newUser = await new User({
      email,
      name,
    }).save();
    console.log('user created', newUser);
    res.json(newUser);
  }
};

exports.currentUser = async (req, res) => {
  try {
    const currentUser = await User.findOne({ email: req.user.email }).exec();
    res.json(currentUser);
  } catch (err) {
    // handle error
  }
};

exports.usersList = async (req, res) => {
  res.json(await User.find({}).sort({ createdAt: -1 }).exec());
  console.log(res);
};

// userController.js

exports.createUser = async (req, res) => {
  const { email, password, displayName, phoneNumber } = req.body;

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName,
      phoneNumber,
      disabled: false,
    });
    res.status(201).json({
      message: 'User created successfully',
      userId: userRecord.uid,
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error creating user',
      error: error.message,
    });
  }
};

// userController.js
exports.updateUser = async (req, res) => {
  const { userId, email, displayName, phoneNumber } = req.body;

  try {
    const userRecord = await admin.auth().updateUser(userId, {
      email,
      displayName,
      phoneNumber,
    });
    res.status(200).json({
      message: 'User updated successfully',
      userId: userRecord.uid,
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error updating user',
      error: error.message,
    });
  }
};
