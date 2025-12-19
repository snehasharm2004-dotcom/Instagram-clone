const Comment = require('../models/Comment');
const Post = require('../models/Post');

// @route   GET /api/posts/:postId/comments
// @desc    Get comments for a post
// @access  Public
const getComments = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comments = await Comment.find({ post: req.params.postId })
      .populate('author', 'username profilePicture')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .lean();

    const total = await Comment.countDocuments({ post: req.params.postId });

    res.status(200).json({
      success: true,
      comments,
      hasMore: skip + parseInt(limit) < total,
      page: parseInt(page),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   POST /api/posts/:postId/comments
// @desc    Create a comment
// @access  Private
const createComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Create comment
    const comment = await Comment.create({
      post: req.params.postId,
      author: req.user._id,
      text
    });

    // Add comment to post
    post.comments.push(comment._id);
    post.commentsCount = post.comments.length;
    await post.save();

    // Populate author
    const populatedComment = await comment.populate('author', 'username profilePicture');

    res.status(201).json({
      success: true,
      comment: populatedComment
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   DELETE /api/comments/:commentId
// @desc    Delete a comment
// @access  Private
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user is the author
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    // Remove comment from post
    const post = await Post.findById(comment.post);
    post.comments = post.comments.filter(id => id.toString() !== req.params.commentId);
    post.commentsCount = post.comments.length;
    await post.save();

    await Comment.findByIdAndDelete(req.params.commentId);

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   POST /api/comments/:commentId/like
// @desc    Like a comment
// @access  Private
const likeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.likes.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already liked this comment' });
    }

    comment.likes.push(req.user._id);
    comment.likesCount = comment.likes.length;
    await comment.save();

    res.status(200).json({
      success: true,
      liked: true,
      likesCount: comment.likesCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   DELETE /api/comments/:commentId/like
// @desc    Unlike a comment
// @access  Private
const unlikeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (!comment.likes.includes(req.user._id)) {
      return res.status(400).json({ message: 'Have not liked this comment' });
    }

    comment.likes = comment.likes.filter(id => id.toString() !== req.user._id.toString());
    comment.likesCount = comment.likes.length;
    await comment.save();

    res.status(200).json({
      success: true,
      liked: false,
      likesCount: comment.likesCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getComments,
  createComment,
  deleteComment,
  likeComment,
  unlikeComment
};
