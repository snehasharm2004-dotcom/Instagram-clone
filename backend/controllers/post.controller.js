const Post = require('../models/Post');
const User = require('../models/User');
const cloudinary = require('../config/cloudinary');

// @route   GET /api/posts/feed
// @desc    Get feed posts from followed users
// @access  Private
const getFeed = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const currentUser = await User.findById(req.user._id);
    const followingIds = [...currentUser.following, currentUser._id];

    const posts = await Post.find({ author: { $in: followingIds } })
      .populate('author', 'username profilePicture fullName')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'username profilePicture'
        }
      })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .lean();

    const total = await Post.countDocuments({ author: { $in: followingIds } });

    res.status(200).json({
      success: true,
      posts,
      hasMore: skip + parseInt(limit) < total,
      page: parseInt(page),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/posts/:postId
// @desc    Get single post
// @access  Public
const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
      .populate('author', 'username profilePicture fullName')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'username profilePicture'
        }
      });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json({
      success: true,
      post
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   POST /api/posts
// @desc    Create new post
// @access  Private
const createPost = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image' });
    }

    const { caption, location, tags } = req.body;

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'instagram-clone/posts',
          transformation: [
            { width: 1080, height: 1080, crop: 'limit' },
            { quality: 'auto' }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(req.file.buffer);
    });

    // Create post
    const post = await Post.create({
      author: req.user._id,
      imageUrl: result.secure_url,
      caption: caption || '',
      location: location || '',
      tags: tags ? tags.split(',').map(tag => tag.trim()) : []
    });

    // Populate author
    const populatedPost = await post.populate('author', 'username profilePicture fullName');

    res.status(201).json({
      success: true,
      post: populatedPost
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   DELETE /api/posts/:postId
// @desc    Delete post
// @access  Private
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user is the author
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    // Delete from Cloudinary
    const publicId = post.imageUrl.split('/').slice(-1)[0].split('.')[0];
    await cloudinary.uploader.destroy(`instagram-clone/posts/${publicId}`);

    await Post.findByIdAndDelete(req.params.postId);

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/posts/user/:userId
// @desc    Get user posts
// @access  Public
const getUserPosts = async (req, res) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ author: req.params.userId })
      .populate('author', 'username profilePicture fullName')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .lean();

    const total = await Post.countDocuments({ author: req.params.userId });

    res.status(200).json({
      success: true,
      posts,
      hasMore: skip + parseInt(limit) < total,
      page: parseInt(page),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   POST /api/posts/:postId/like
// @desc    Like a post
// @access  Private
const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if already liked
    if (post.likes.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already liked this post' });
    }

    post.likes.push(req.user._id);
    post.likesCount = post.likes.length;
    await post.save();

    res.status(200).json({
      success: true,
      liked: true,
      likesCount: post.likesCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   DELETE /api/posts/:postId/like
// @desc    Unlike a post
// @access  Private
const unlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if not liked
    if (!post.likes.includes(req.user._id)) {
      return res.status(400).json({ message: 'Have not liked this post' });
    }

    post.likes = post.likes.filter(id => id.toString() !== req.user._id.toString());
    post.likesCount = post.likes.length;
    await post.save();

    res.status(200).json({
      success: true,
      liked: false,
      likesCount: post.likesCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getFeed,
  getPost,
  createPost,
  deletePost,
  getUserPosts,
  likePost,
  unlikePost
};
