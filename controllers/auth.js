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
  const { email, password, displayName, phoneNumber, role } = req.body;

  try {
    // Create user in Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName,
      phoneNumber,
      disabled: false,
    });

    // Prepare user data for MongoDB
    const newUser = new User({
      uid: userRecord.uid, // Firebase UID
      email: userRecord.email,
      password: userRecord.password,
      displayName: userRecord.displayName || '',
      phoneNumber: userRecord.phoneNumber || '',
      role: role || 'subscriber', // Default role if not provided
      emailVerified: userRecord.emailVerified,
      disabled: userRecord.disabled,
      photoURL: userRecord.photoURL || '',
    });

    // Save the user in MongoDB
    await newUser.save();

    res.status(201).json({
      message: 'User created successfully in Firebase and MongoDB',
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
      },
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
  const { uid, email, displayName, phoneNumber, password, disabled } = req.body;

  try {
    const userRecord = await admin.auth().updateUser(uid, {
      email,
      password,
      displayName,
      phoneNumber,
      disabled,
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
