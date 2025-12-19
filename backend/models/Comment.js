const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: [true, 'Comment must be associated with a post']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Comment must have an author']
  },
  text: {
    type: String,
    required: [true, 'Comment must have text content'],
    maxlength: [500, 'Comment cannot exceed 500 characters']
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
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for faster queries
commentSchema.index({ post: 1, createdAt: -1 });
commentSchema.index({ author: 1 });

module.exports = mongoose.model('Comment', commentSchema);
