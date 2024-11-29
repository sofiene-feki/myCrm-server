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
};

// userController.js

exports.createUser = async (req, res) => {
  const { email, password, displayName, phoneNumber, role, uid, disabled } =
    req.body;

  try {
    // Create user in Firebase Authentication
    console.log(req.body);
    const userRecord = await admin.auth().createUser({
      uid,
      email,
      password,
      displayName,
      phoneNumber,
      disabled,
    });

    // Prepare user data for MongoDB
    const newUser = new User({
      uid,
      email,
      displayName,
      phoneNumber,
      disabled,
      role,
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
  const { uid, email, displayName, phoneNumber, password, disabled, role } =
    req.body;

  try {
    // Update user in Firebase Authentication
    const userRecord = await admin.auth().updateUser(uid, {
      email,
      password,
      displayName,
      phoneNumber,
      disabled,
    });

    // Update user data in MongoDB
    const updatedUser = await User.findOneAndUpdate(
      { uid },
      { email, displayName, phoneNumber, disabled, role },
      { new: true }
    );

    res.status(200).json({
      message: 'User updated successfully in Firebase and MongoDB',
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
      },
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error updating user',
      error: error.message,
    });
  }
};

exports.deleteUser = async (req, res) => {
  const { uid } = req.params; // Assuming the UID is passed as a route parameter

  try {
    // Delete user from Firebase
    await admin.auth().deleteUser(uid);

    // Delete user from MongoDB
    const deletedUser = await User.findOneAndDelete({ uid });
    if (!deletedUser) {
      return res.status(404).json({
        message: 'User not found in MongoDB',
      });
    }

    res.status(200).json({
      message: 'User successfully deleted from Firebase and MongoDB',
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error deleting user',
      error: error.message,
    });
  }
};
