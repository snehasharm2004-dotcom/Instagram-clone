const express = require('express');
const {
  getFeed,
  getPost,
  createPost,
  deletePost,
  getUserPosts,
  likePost,
  unlikePost
} = require('../controllers/post.controller');
const { protect } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

const router = express.Router();

// Protected routes
router.get('/feed', protect, getFeed);
router.post('/', protect, upload.single('image'), createPost);

// Public routes
router.get('/:postId', getPost);
router.get('/user/:userId', getUserPosts);

// Like routes (protected)
router.post('/:postId/like', protect, likePost);
router.delete('/:postId/like', protect, unlikePost);

// Delete route (protected)
router.delete('/:postId', protect, deletePost);

module.exports = router;
