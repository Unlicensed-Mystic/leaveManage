const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    createUser,
    updateUserRole,
    deleteUser,
    getStats,
} = require('../controllers/adminController');
const protect = require('../middleware/auth');
const authorize = require('../middleware/roleCheck');
const { validateCreateUser, validateUpdateUser } = require('../middleware/validate');

router.use(protect, authorize('admin'));

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.post('/users', validateCreateUser, createUser);
router.put('/users/:id/role', validateUpdateUser, updateUserRole);
router.delete('/users/:id', deleteUser);

module.exports = router;
