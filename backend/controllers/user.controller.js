const User = require('../models/User');

// @route   GET /api/users/:username
// @desc    Get user profile
// @access  Public
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .populate('followers', 'username profilePicture')
      .populate('following', 'username profilePicture');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      user: userResponse
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/users/:userId/followers
// @desc    Get user followers
// @access  Public
const getUserFollowers = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate('followers', 'username profilePicture fullName');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      followers: user.followers
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/users/:userId/following
// @desc    Get users that the user is following
// @access  Public
const getUserFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate('following', 'username profilePicture fullName');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      following: user.following
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { fullName, bio, email } = req.body;

    // Find and update user
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        fullName: fullName || req.user.fullName,
        bio: bio || req.user.bio,
        email: email || req.user.email
      },
      { new: true }
    );

    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      user: userResponse
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   POST /api/users/:userId/follow
// @desc    Follow a user
// @access  Private
const followUser = async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.userId);
    const currentUser = req.user;

    if (!userToFollow) {
      return res.status(404).json({ message: 'User to follow not found' });
    }

    // Check if already following
    if (currentUser.following.includes(req.params.userId)) {
      return res.status(400).json({ message: 'Already following this user' });
    }

    // Add to following list
    currentUser.following.push(req.params.userId);
    await currentUser.save();

    // Add to followers list
    userToFollow.followers.push(currentUser._id);
    await userToFollow.save();

    res.status(200).json({
      success: true,
      message: 'User followed successfully',
      followingCount: currentUser.following.length,
      followerCount: userToFollow.followers.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   DELETE /api/users/:userId/follow
// @desc    Unfollow a user
// @access  Private
const unfollowUser = async (req, res) => {
  try {
    const userToUnfollow = await User.findById(req.params.userId);
    const currentUser = req.user;

    if (!userToUnfollow) {
      return res.status(404).json({ message: 'User to unfollow not found' });
    }

    // Check if following
    if (!currentUser.following.includes(req.params.userId)) {
      return res.status(400).json({ message: 'Not following this user' });
    }

    // Remove from following list
    currentUser.following = currentUser.following.filter(
      id => id.toString() !== req.params.userId
    );
    await currentUser.save();

    // Remove from followers list
    userToUnfollow.followers = userToUnfollow.followers.filter(
      id => id.toString() !== currentUser._id.toString()
    );
    await userToUnfollow.save();

    res.status(200).json({
      success: true,
      message: 'User unfollowed successfully',
      followingCount: currentUser.following.length,
      followerCount: userToUnfollow.followers.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/users/search?q=query
// @desc    Search for users
// @access  Public
const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const users = await User.find({
      $or: [
        { username: { $regex: q, $options: 'i' } },
        { fullName: { $regex: q, $options: 'i' } }
      ]
    }).select('username fullName profilePicture').limit(10);

    res.status(200).json({
      success: true,
      users
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUserProfile,
  getUserFollowers,
  getUserFollowing,
  updateProfile,
  followUser,
  unfollowUser,
  searchUsers
};
