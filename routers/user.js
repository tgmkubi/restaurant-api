const express = require('express');
const router = express.Router();
const User = require('../models/User');
const userQueryMiddleware = require('../middlewares/query/UserQueryMiddleware');
const { checkUserExist } = require('../middlewares/database/databaseErrorHelpers');
const { getSingleUser, getAllUsers } = require('../controllers/user');

router.get('/:id', checkUserExist, getSingleUser);
router.get('', userQueryMiddleware(User), getAllUsers);

module.exports = router;