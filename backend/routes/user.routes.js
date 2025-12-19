const express = require('express');
const {
  getUserProfile,
  getUserFollowers,
  getUserFollowing,
  updateProfile,
  followUser,
  unfollowUser,
  searchUsers
} = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// Public routes
router.get('/search', searchUsers);
router.get('/:username', getUserProfile);
router.get('/:userId/followers', getUserFollowers);
router.get('/:userId/following', getUserFollowing);

// Protected routes
router.put('/profile', protect, updateProfile);
router.post('/:userId/follow', protect, followUser);
router.delete('/:userId/follow', protect, unfollowUser);

module.exports = router;
