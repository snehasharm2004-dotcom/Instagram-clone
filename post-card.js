/**
 * Create a post card HTML
 */
function createPostCard(post) {
  const user = auth.getUser();
  const isLiked = post.likes.includes(user._id);

  const postHTML = `
    <div class="post" data-post-id="${post._id}">
      <div class="post-header">
        <div class="post-author" onclick="goToProfile('${post.author.username}')">
          <img src="${post.author.profilePicture}" alt="${post.author.username}" class="post-avatar">
          <div class="post-author-info">
            <div class="post-author-username">${post.author.username}</div>
            ${post.location ? `<div class="post-location">${post.location}</div>` : ''}
          </div>
        </div>
        ${post.author._id === user._id ? `
          <button class="post-more-btn" onclick="deletePost('${post._id}')">
            <i class="fas fa-times"></i>
          </button>
        ` : ''}
      </div>

      <img src="${post.imageUrl}" alt="Post" class="post-image" onclick="likePostDouble('${post._id}')">

      <div class="post-actions">
        <button class="action-btn like-btn ${isLiked ? 'liked' : ''}"
                onclick="toggleLike('${post._id}')"
                data-liked="${isLiked}">
          <i class="fas fa-heart"></i>
        </button>
        <button class="action-btn" onclick="toggleComments(this)">
          <i class="fas fa-comment"></i>
        </button>
        <button class="action-btn">
          <i class="fas fa-share"></i>
        </button>
      </div>

      <div class="post-stats">
        <span class="likes-count" data-post-id="${post._id}">${post.likesCount} likes</span>
      </div>

      ${post.caption ? `
        <div class="post-caption">
          <strong>${post.author.username}</strong> ${escapeHtml(post.caption)}
        </div>
      ` : ''}

      <div class="post-time">
        ${getTimeAgo(new Date(post.createdAt))}
      </div>

      <div class="post-comments">
        ${post.comments && post.comments.length > 0 ? post.comments
          .slice(-3)
          .map(comment => `
            <div class="comment" data-comment-id="${comment._id}">
              <div>
                <strong>${comment.author.username}</strong> ${escapeHtml(comment.text)}
              </div>
              ${comment.author._id === user._id ? `
                <button class="comment-delete" onclick="deleteComment('${post._id}', '${comment._id}')">Delete</button>
              ` : ''}
            </div>
          `).join('') : '<div style="color: var(--text-secondary); font-size: 12px;">No comments yet</div>'
        }
      </div>

      <div class="post-comment-input">
        <input type="text" placeholder="Add a comment..." class="comment-text">
        <button onclick="addComment('${post._id}', this)">Post</button>
      </div>
    </div>
  `;

  return postHTML;
}

/**
 * Toggle like on a post
 */
async function toggleLike(postId) {
  try {
    const post = document.querySelector(`[data-post-id="${postId}"]`);
    const likeBtn = post.querySelector('.like-btn');
    const likesCountEl = post.querySelector('.likes-count');
    const isLiked = likeBtn.dataset.liked === 'true';

    // Use mock data - find the post in mockPosts
    const mockPost = mockPosts.find(p => p._id === postId);
    if (!mockPost) {
      showError('Post not found');
      return;
    }

    const user = auth.getUser();

    if (isLiked) {
      // Unlike
      mockPost.likes = mockPost.likes.filter(id => id !== user._id);
      mockPost.likesCount--;
      likeBtn.dataset.liked = 'false';
      likeBtn.classList.remove('liked');
    } else {
      // Like
      if (!mockPost.likes.includes(user._id)) {
        mockPost.likes.push(user._id);
        mockPost.likesCount++;
      }
      likeBtn.dataset.liked = 'true';
      likeBtn.classList.add('liked');
    }

    // Update UI
    likesCountEl.textContent = `${mockPost.likesCount} likes`;
  } catch (error) {
    showError(error.message);
  }
}

/**
 * Double tap to like
 */
let lastTap = 0;
async function likePostDouble(postId) {
  const currentTime = new Date().getTime();
  const tapLength = currentTime - lastTap;

  if (tapLength < 300 && tapLength > 0) {
    // Double tap detected
    const post = document.querySelector(`[data-post-id="${postId}"]`);
    const likeBtn = post.querySelector('.like-btn');

    if (likeBtn.dataset.liked === 'false') {
      toggleLike(postId);
    }

    lastTap = 0;
  } else {
    lastTap = currentTime;
  }
}

/**
 * Toggle comments visibility
 */
function toggleComments(btn) {
  const post = btn.closest('.post');
  const comments = post.querySelector('.post-comments');
  comments.style.display = comments.style.display === 'none' ? 'block' : 'none';
}

/**
 * Add comment to post
 */
async function addComment(postId, btn) {
  try {
    const input = btn.previousElementSibling;
    const commentText = input.value.trim();

    if (!commentText) {
      showError('Comment cannot be empty');
      return;
    }

    // Use mock data - find the post in mockPosts
    const mockPost = mockPosts.find(p => p._id === postId);
    if (!mockPost) {
      showError('Post not found');
      return;
    }

    const user = auth.getUser();

    // Create new comment
    const newComment = {
      _id: 'c' + Date.now(),
      author: user,
      text: commentText,
      likes: []
    };

    // Add to mock post
    mockPost.comments.push(newComment);
    mockPost.commentsCount++;

    // Add new comment to UI
    const post = document.querySelector(`[data-post-id="${postId}"]`);
    const commentsDiv = post.querySelector('.post-comments');

    const commentHTML = `
      <div class="comment" data-comment-id="${newComment._id}">
        <div>
          <strong>${newComment.author.username}</strong> ${escapeHtml(newComment.text)}
        </div>
        <button class="comment-delete" onclick="deleteComment('${postId}', '${newComment._id}')">Delete</button>
      </div>
    `;

    commentsDiv.innerHTML += commentHTML;
    input.value = '';
  } catch (error) {
    showError(error.message);
  }
}

/**
 * Delete comment
 */
async function deleteComment(postId, commentId) {
  if (!confirm('Delete this comment?')) return;

  try {
    // Use mock data - find the post and comment
    const mockPost = mockPosts.find(p => p._id === postId);
    if (!mockPost) {
      showError('Post not found');
      return;
    }

    // Find and remove the comment
    const commentIndex = mockPost.comments.findIndex(c => c._id === commentId);
    if (commentIndex !== -1) {
      mockPost.comments.splice(commentIndex, 1);
      mockPost.commentsCount--;
    }

    // Remove from UI
    const commentEl = document.querySelector(`[data-comment-id="${commentId}"]`);
    if (commentEl) {
      commentEl.remove();
    }

    showSuccess('Comment deleted');
  } catch (error) {
    showError(error.message);
  }
}

/**
 * Delete post
 */
async function deletePost(postId) {
  if (!confirm('Delete this post?')) return;

  try {
    // Use mock data - find and remove the post
    const postIndex = mockPosts.findIndex(p => p._id === postId);
    if (postIndex !== -1) {
      mockPosts.splice(postIndex, 1);
    }

    // Remove from UI
    const postEl = document.querySelector(`[data-post-id="${postId}"]`);
    if (postEl) {
      postEl.remove();
    }

    showSuccess('Post deleted');
  } catch (error) {
    showError(error.message);
  }
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Get time ago string
 */
function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + ' years ago';

  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ' months ago';

  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' days ago';

  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + ' hours ago';

  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ' minutes ago';

  return 'just now';
}
