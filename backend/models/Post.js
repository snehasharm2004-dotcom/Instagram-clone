const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Post must have an author']
  },
  imageUrl: {
    type: String,
    required: [true, 'Post must have an image']
  },
  caption: {
    type: String,
    maxlength: [2200, 'Caption cannot exceed 2200 characters'],
    default: ''
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    default: []
  },
  likesCount: {
    type: Number,
    default: 0
  },
  comments: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Comment',
    default: []
  },
  commentsCount: {
    type: Number,
    default: 0
  },
  location: {
    type: String,
    maxlength: [100, 'Location cannot exceed 100 characters']
  },
  tags: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for faster queries
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ createdAt: -1 });
postSchema.index({ tags: 1 });
postSchema.index({ likes: 1 });

module.exports = mongoose.model('Post', postSchema);
