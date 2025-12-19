const express = require('express');
const {
  getComments,
  createComment,
  deleteComment,
  likeComment,
  unlikeComment
} = require('../controllers/comment.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router({ mergeParams: true });

// Public routes
router.get('/', getComments);

// Protected routes
router.post('/', protect, createComment);
router.delete('/:commentId', protect, deleteComment);
router.post('/:commentId/like', protect, likeComment);
router.delete('/:commentId/like', protect, unlikeComment);

module.exports = router;
