// Demo feed - uses mock data instead of API
let allPosts = [...mockPosts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Copy and sort by newest first
let allUsers = [...mockUsers]; // Copy mock users

/**
 * Initialize demo feed page
 */
function initDemoFeed() {
  // Initialize sticky navbar
  initStickyFeedNavbar();

  // Initialize footer navbar
  initFooterNavbar();

  const homeBtn = document.getElementById('home-btn');
  const searchBtn = document.getElementById('search-btn');
  const profileBtn = document.getElementById('profile-btn');
  const menuBtn = document.getElementById('menu-btn');
  const dropdownMenu = document.getElementById('dropdown-menu');
  const refreshBtn = document.getElementById('refresh-btn');
  const viewProfileBtn = document.getElementById('view-profile-btn');
  const newPostBtn = document.getElementById('new-post-btn');
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  const searchModal = document.getElementById('search-modal');

  // Home button
  if (homeBtn) {
    homeBtn.addEventListener('click', () => {
      window.location.reload();
    });
  }

  // Search button - open search modal
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      searchModal.style.display = 'flex';
      searchInput.focus();
    });
  }

  // Menu button - toggle dropdown
  if (menuBtn) {
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdownMenu.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.sidebar-footer')) {
        dropdownMenu.classList.remove('active');
      }
    });
  }

  // Profile button - navigate to profile page
  if (profileBtn) {
    profileBtn.addEventListener('click', () => {
      window.location.href = 'pages/profile.html?username=' + currentUser.username;
    });
  }

  // Refresh posts
  if (refreshBtn) {
    refreshBtn.addEventListener('click', (e) => {
      e.preventDefault();
      location.reload();
    });
  }

  // View profile
  if (viewProfileBtn) {
    viewProfileBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showUserProfile(currentUser);
    });
  }

  // New post (demo alert)
  if (newPostBtn) {
    newPostBtn.addEventListener('click', () => {
      alert('📸 Post creation feature works with backend integration!\n\nThis is a demo version with mock data.');
    });
  }

  // Search functionality
  if (searchInput) {
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      const query = e.target.value.trim().toLowerCase();

      if (query.length < 1) {
        searchResults.style.display = 'none';
        return;
      }

      searchTimeout = setTimeout(() => {
        const results = mockUsers.filter(user =>
          user.username.toLowerCase().includes(query) ||
          user.fullName.toLowerCase().includes(query)
        );

        if (results.length === 0) {
          searchResults.innerHTML = '<div style="padding: 16px; text-align: center; color: var(--text-secondary);">No users found</div>';
        } else {
          searchResults.innerHTML = results
            .map(user => `
              <div class="search-result-item" onclick="showUserProfile({...${JSON.stringify(user).replace(/"/g, '&quot;')}})">
                <img src="${user.profilePicture}" alt="${user.username}" class="search-result-avatar">
                <div class="search-result-info">
                  <div class="search-result-username">${user.username}</div>
                  <div class="search-result-fullname">${user.fullName}</div>
                </div>
              </div>
            `)
            .join('');
        }

        searchResults.style.display = 'block';
      }, 300);
    });

    document.addEventListener('click', (e) => {
      if (e.target !== searchInput) {
        searchResults.style.display = 'none';
      }
    });
  }

  // Load posts
  loadDemoPosts();
  loadSuggestedUsers();
}

/**
 * Load posts from mock data
 */
function loadDemoPosts() {
  const feedDiv = document.getElementById('posts-feed');
  const noPostsDiv = document.getElementById('no-posts');

  console.log('Loading posts. Total posts:', allPosts.length);
  console.log('First post:', allPosts[0]);

  if (allPosts.length === 0) {
    noPostsDiv.style.display = 'block';
    feedDiv.innerHTML = '';
  } else {
    noPostsDiv.style.display = 'none';
    const postsHTML = allPosts
      .map(post => createDemoPostCard(post))
      .join('');
    feedDiv.innerHTML = postsHTML;
    console.log('Posts loaded into DOM');
  }
}

/**
 * Create a demo post card (without API calls)
 */
function createDemoPostCard(post) {
  const isLiked = post.likes.includes('current');

  const postHTML = `
    <div class="post" data-post-id="${post._id}">
      <div class="post-header">
        <div class="post-author" onclick="showUserProfile(${JSON.stringify(post.author).replace(/"/g, '&quot;')})">
          <img src="${post.author.profilePicture}" alt="${post.author.username}" class="post-avatar">
          <div class="post-author-info">
            <div class="post-author-username">${post.author.username}</div>
            ${post.location ? `<div class="post-location">${post.location}</div>` : ''}
          </div>
        </div>
      </div>

      <img src="${post.imageUrl}" alt="Post" class="post-image" onclick="likePostDouble('${post._id}')">

      <div class="post-actions">
        <button class="action-btn like-btn ${isLiked ? 'liked' : ''}"
                onclick="toggleDemoLike('${post._id}')"
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
            </div>
          `).join('') : '<div style="color: var(--text-secondary); font-size: 12px;">No comments yet</div>'
        }
      </div>

      <div class="post-comment-input">
        <input type="text" placeholder="Add a comment..." class="comment-text">
        <button onclick="addDemoComment('${post._id}', this)">Post</button>
      </div>
    </div>
  `;

  return postHTML;
}

/**
 * Toggle like on a post (demo version)
 */
function toggleDemoLike(postId) {
  const post = allPosts.find(p => p._id === postId);
  if (!post) return;

  const postEl = document.querySelector(`[data-post-id="${postId}"]`);
  const likeBtn = postEl.querySelector('.like-btn');
  const likesCountEl = postEl.querySelector('.likes-count');
  const isLiked = likeBtn.dataset.liked === 'true';

  if (isLiked) {
    post.likes = post.likes.filter(id => id !== 'current');
    post.likesCount--;
    likeBtn.dataset.liked = 'false';
    likeBtn.classList.remove('liked');
  } else {
    post.likes.push('current');
    post.likesCount++;
    likeBtn.dataset.liked = 'true';
    likeBtn.classList.add('liked');
  }

  likesCountEl.textContent = `${post.likesCount} likes`;
}

/**
 * Double tap to like
 */
function likePostDouble(postId) {
  const currentTime = new Date().getTime();
  const tapLength = currentTime - lastTap;

  if (tapLength < 300 && tapLength > 0) {
    const postEl = document.querySelector(`[data-post-id="${postId}"]`);
    const likeBtn = postEl.querySelector('.like-btn');

    if (likeBtn.dataset.liked === 'false') {
      toggleDemoLike(postId);
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
 * Add comment (demo version)
 */
function addDemoComment(postId, btn) {
  const input = btn.previousElementSibling;
  const commentText = input.value.trim();

  if (!commentText) {
    showError('Comment cannot be empty');
    return;
  }

  const post = allPosts.find(p => p._id === postId);
  if (!post) return;

  // Create new comment
  const newComment = {
    _id: 'c' + Date.now(),
    author: currentUser,
    text: commentText,
    likes: []
  };

  post.comments.push(newComment);
  post.commentsCount++;

  // Add to UI
  const postEl = document.querySelector(`[data-post-id="${postId}"]`);
  const commentsDiv = postEl.querySelector('.post-comments');

  const commentHTML = `
    <div class="comment" data-comment-id="${newComment._id}">
      <div>
        <strong>${newComment.author.username}</strong> ${escapeHtml(newComment.text)}
      </div>
    </div>
  `;

  commentsDiv.innerHTML += commentHTML;
  input.value = '';
  showSuccess('Comment added!');
}

/**
 * Load suggested users
 */
function loadSuggestedUsers() {
  const suggestedDiv = document.getElementById('suggested-users');
  if (!suggestedDiv) return;

  const suggestedHTML = mockUsers
    .slice(0, 5)
    .map(user => `
      <div class="suggested-user">
        <div class="user-info" onclick="showUserProfile(${JSON.stringify(user).replace(/"/g, '&quot;')})">
          <img src="${user.profilePicture}" alt="${user.username}" class="user-avatar">
          <div class="user-details">
            <div class="user-username">${user.username}</div>
            <div class="user-status">Suggested for you</div>
          </div>
        </div>
        <button class="follow-btn" onclick="showMessage('Follow feature works with backend!')">Follow</button>
      </div>
    `)
    .join('');

  suggestedDiv.innerHTML = suggestedHTML;
}

/**
 * Show user profile
 */
function showUserProfile(user) {
  window.location.href = 'pages/profile.html?username=' + user.username;
}

/**
 * Escape HTML
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

/**
 * Show error message
 */
function showError(message) {
  const errorDiv = document.getElementById('error-message');
  if (errorDiv) {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    setTimeout(() => {
      errorDiv.style.display = 'none';
    }, 5000);
  }
}

/**
 * Show success message
 */
function showSuccess(message) {
  const successDiv = document.getElementById('success-message');
  if (successDiv) {
    successDiv.textContent = message;
    successDiv.style.display = 'block';
    setTimeout(() => {
      successDiv.style.display = 'none';
    }, 5000);
  }
}

/**
 * Show message
 */
function showMessage(message) {
  alert(message);
}

/**
 * Close search modal
 */
function closeSearchModal() {
  const searchModal = document.getElementById('search-modal');
  if (searchModal) {
    searchModal.style.display = 'none';
    document.getElementById('search-input').value = '';
    document.getElementById('search-results').innerHTML = '';
  }
}

/**
 * Initialize sticky feed navbar
 */
function initStickyFeedNavbar() {
  const navbarLogo = document.querySelector('.navbar-sticky-logo');
  const navbarHomeBtn = document.getElementById('navbar-home-btn');
  const navbarMessageBtn = document.getElementById('navbar-message-btn');
  const navbarProfileBtn = document.getElementById('navbar-profile-btn');
  const navbarDropdownMenu = document.getElementById('navbar-dropdown-menu');
  const searchInput = document.getElementById('navbar-search-input');
  const searchResults = document.getElementById('navbar-search-results');

  // Logo click - reload page
  if (navbarLogo) {
    navbarLogo.addEventListener('click', () => {
      window.location.reload();
    });
  }

  // Home button - reload page
  if (navbarHomeBtn) {
    navbarHomeBtn.addEventListener('click', () => {
      window.location.reload();
    });
  }

  // Message button - show alert
  if (navbarMessageBtn) {
    navbarMessageBtn.addEventListener('click', () => {
      alert('💬 Messages feature works with backend integration!\n\nThis is a demo version.');
    });
  }

  // Profile dropdown
  if (navbarProfileBtn) {
    navbarProfileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navbarDropdownMenu.classList.toggle('active');
    });
  }

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.navbar-icon-dropdown')) {
      navbarDropdownMenu.classList.remove('active');
    }
  });

  // Profile menu links
  const viewProfileLink = document.getElementById('navbar-view-profile-btn');
  const settingsLink = document.getElementById('navbar-settings-btn');
  const logoutLink = document.getElementById('navbar-logout-btn');

  if (viewProfileLink) {
    viewProfileLink.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'pages/profile.html?username=' + currentUser.username;
    });
  }

  if (settingsLink) {
    settingsLink.addEventListener('click', (e) => {
      e.preventDefault();
      alert('⚙️ Settings feature coming soon!');
    });
  }

  if (logoutLink) {
    logoutLink.addEventListener('click', (e) => {
      e.preventDefault();
      alert('👋 Logged out! Redirecting to home...');
      window.location.href = 'index.html';
    });
  }

  // Search functionality
  if (searchInput) {
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      const query = e.target.value.trim().toLowerCase();

      if (query.length < 1) {
        searchResults.classList.remove('active');
        return;
      }

      searchTimeout = setTimeout(() => {
        const results = mockUsers.filter(user =>
          user.username.toLowerCase().includes(query) ||
          user.fullName.toLowerCase().includes(query)
        );

        if (results.length === 0) {
          searchResults.innerHTML = '<div style="padding: 16px; text-align: center; color: var(--text-secondary);">No users found</div>';
        } else {
          searchResults.innerHTML = results
            .map(user => `
              <div style="padding: 12px 16px; border-bottom: 1px solid var(--border-color); cursor: pointer; transition: background-color 0.2s;"
                   onclick="showUserProfile(${JSON.stringify(user).replace(/"/g, '&quot;')})"
                   onmouseover="this.style.backgroundColor = 'var(--background)'"
                   onmouseout="this.style.backgroundColor = 'transparent'">
                <div style="display: flex; gap: 12px; align-items: center;">
                  <img src="${user.profilePicture}" alt="${user.username}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;">
                  <div>
                    <div style="font-weight: 600; font-size: 13px;">${user.username}</div>
                    <div style="font-size: 12px; color: var(--text-secondary);">${user.fullName}</div>
                  </div>
                </div>
              </div>
            `)
            .join('');
        }

        searchResults.classList.add('active');
      }, 300);
    });

    document.addEventListener('click', (e) => {
      if (e.target !== searchInput && !e.target.closest('.navbar-sticky-search')) {
        searchResults.classList.remove('active');
      }
    });
  }
}

/**
 * Initialize footer navbar
 */
function initFooterNavbar() {
  const footerSearchBtn = document.getElementById('footer-search-btn');
  const footerCreateBtn = document.getElementById('footer-create-btn');
  const footerProfileBtn = document.getElementById('footer-profile-btn');

  // Search button - open search modal
  if (footerSearchBtn) {
    footerSearchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const searchModal = document.getElementById('search-modal');
      if (searchModal) {
        searchModal.style.display = 'flex';
        document.getElementById('search-input').focus();
      }
    });
  }

  // Create button - show alert
  if (footerCreateBtn) {
    footerCreateBtn.addEventListener('click', (e) => {
      e.preventDefault();
      alert('📸 Post creation feature works with backend integration!\n\nThis is a demo version with mock data.');
    });
  }

  // Profile button - navigate to profile
  if (footerProfileBtn) {
    footerProfileBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'pages/profile.html?username=' + currentUser.username;
    });
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initDemoFeed);
