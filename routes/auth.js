const express = require('express');

const router = express.Router();

//middlewares
const { authCheck, adminCheck } = require('../middlewares/auth');

//controller
const {
  createOrUpdateUser,
  currentUser,
  usersList,
  createUser,
  updateUser,
} = require('../controllers/auth');

router.get('/users', usersList);
router.post('/create-or-update-user', authCheck, createOrUpdateUser);
router.post('/current-user', authCheck, currentUser);
router.post('/current-admin', authCheck, adminCheck, currentUser);
router.post('/create-user', createUser);
router.put('/update-user/:userId', updateUser);

module.exports = router;
