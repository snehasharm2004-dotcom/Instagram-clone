// Get username from URL parameter
const urlParams = new URLSearchParams(window.location.search);
const usernameParam = urlParams.get('username');

// Use mock data for demo
let profileData = null;
let currentUser = null;
let isOwnProfile = false;

/**
 * Initialize profile page
 */
function initProfile() {
  // Sticky Navbar initialization
  initStickyNavbar();

  const homeBtn = document.getElementById('home-btn');
  const editForm = document.getElementById('edit-profile-form');
  const bioInput = document.getElementById('edit-bio');
  const bioCount = document.getElementById('bio-count');
  const editProfileModal = document.getElementById('edit-profile-modal');
  const followersModal = document.getElementById('followers-modal');

  // Home button - navigate back to feed
  if (homeBtn) {
    homeBtn.addEventListener('click', () => {
      window.location.href = '../index.html';
    });
  }

  // Bio counter
  if (bioInput) {
    bioInput.addEventListener('input', (e) => {
      bioCount.textContent = `${e.target.value.length}/150`;
    });
  }

  // Edit profile form
  if (editForm) {
    editForm.addEventListener('submit', updateProfile);
  }

  // Close modal on background click
  if (editProfileModal) {
    editProfileModal.addEventListener('click', (e) => {
      if (e.target === editProfileModal) {
        closeEditModal();
      }
    });
  }

  if (followersModal) {
    followersModal.addEventListener('click', (e) => {
      if (e.target === followersModal) {
        closeFollowersModal();
      }
    });
  }

  // Load profile
  if (usernameParam) {
    loadProfile(usernameParam);
  } else if (currentUser) {
    loadProfile(currentUser.username);
  }

  // Stats click handlers
  document.getElementById('followers-count').addEventListener('click', () => {
    showFollowers(profileData._id);
  });

  document.getElementById('following-count').addEventListener('click', () => {
    showFollowing(profileData._id);
  });
}

/**
 * Load user profile (using mock data)
 */
function loadProfile(username) {
  try {
    // Find user in mock data
    profileData = mockUsers.find(u => u.username === username);

    if (!profileData) {
      showError('User not found');
      return;
    }

    // Set current user (for comparison)
    if (!currentUser) {
      currentUser = mockUsers[0]; // Set to first user for demo
    }

    isOwnProfile = profileData._id === currentUser._id;

    // Populate profile info
    document.getElementById('profile-avatar').src = profileData.profilePicture;
    document.getElementById('profile-username').textContent = profileData.username;
    document.getElementById('profile-fullname').textContent = profileData.fullName;
    document.getElementById('profile-bio').textContent = profileData.bio || 'No bio';

    // Count posts for this user
    const userPosts = mockPosts.filter(p => p.author._id === profileData._id);
    document.getElementById('posts-count').textContent = userPosts.length;
    document.getElementById('followers-count').textContent = profileData.followers.length;
    document.getElementById('following-count').textContent = profileData.following.length;

    // Show appropriate buttons
    updateActionButtons();

    // Load posts
    loadUserPosts(profileData._id, userPosts);
  } catch (error) {
    showError(error.message || 'Failed to load profile');
  }
}

/**
 * Update action buttons based on profile type
 */
function updateActionButtons() {
  const followBtn = document.getElementById('follow-btn');
  const unfollowBtn = document.getElementById('unfollow-btn');
  const editBtn = document.getElementById('edit-profile-btn');

  // Clear all buttons first
  followBtn.style.display = 'none';
  unfollowBtn.style.display = 'none';
  editBtn.style.display = 'none';

  if (isOwnProfile) {
    editBtn.style.display = 'block';
    editBtn.addEventListener('click', openEditModal);
  } else {
    const isFollowing = currentUser.following.includes(profileData._id);

    if (isFollowing) {
      unfollowBtn.style.display = 'block';
      unfollowBtn.addEventListener('click', () => unfollowUser(profileData._id));
    } else {
      followBtn.style.display = 'block';
      followBtn.addEventListener('click', () => followUser(profileData._id));
    }
  }
}

/**
 * Load user posts (using mock data)
 */
function loadUserPosts(userId, userPosts) {
  try {
    const postsGrid = document.getElementById('posts-grid');
    const noPostsMessage = document.getElementById('no-posts-message');

    if (!userPosts || userPosts.length === 0) {
      postsGrid.innerHTML = '';
      noPostsMessage.style.display = 'block';
    } else {
      noPostsMessage.style.display = 'none';
      postsGrid.innerHTML = userPosts
        .map(post => `
          <div class="post-grid-item">
            <img src="${post.imageUrl}" alt="Post">
            <div class="post-grid-overlay">
              <span>
                <i class="fas fa-heart"></i><br>${post.likesCount}
              </span>
              <span>
                <i class="fas fa-comment"></i><br>${post.commentsCount}
              </span>
            </div>
          </div>
        `)
        .join('');
    }
  } catch (error) {
    showError(error.message || 'Failed to load posts');
  }
}

/**
 * Open edit profile modal
 */
function openEditModal() {
  const modal = document.getElementById('edit-profile-modal');
  document.getElementById('edit-fullname').value = profileData.fullName;
  document.getElementById('edit-bio').value = profileData.bio || '';
  document.getElementById('edit-email').value = profileData.email;
  document.getElementById('bio-count').textContent = `${profileData.bio?.length || 0}/150`;
  modal.style.display = 'flex';
}

/**
 * Close edit profile modal
 */
function closeEditModal() {
  const modal = document.getElementById('edit-profile-modal');
  modal.style.display = 'none';
}

/**
 * Update profile (demo - shows success message)
 */
function updateProfile(e) {
  e.preventDefault();

  const fullName = document.getElementById('edit-fullname').value.trim();
  const bio = document.getElementById('edit-bio').value.trim();
  const email = document.getElementById('edit-email').value.trim();

  if (!fullName || !email) {
    showError('Full name and email are required');
    return;
  }

  // Update mock data
  profileData.fullName = fullName;
  profileData.bio = bio;

  // Update UI
  document.getElementById('profile-fullname').textContent = fullName;
  document.getElementById('profile-bio').textContent = bio || 'No bio';

  closeEditModal();
  showSuccess('Profile updated successfully!');
}

/**
 * Follow user (demo - shows success message)
 */
function followUser(userId) {
  try {
    // Update mock data
    if (!currentUser.following.includes(userId)) {
      currentUser.following.push(userId);
      profileData.followers.push(currentUser._id);
    }

    // Update UI
    updateActionButtons();
    document.getElementById('followers-count').textContent = profileData.followers.length;
    showSuccess('User followed!');
  } catch (error) {
    showError(error.message);
  }
}

/**
 * Unfollow user (demo - shows success message)
 */
function unfollowUser(userId) {
  try {
    // Update mock data
    currentUser.following = currentUser.following.filter(id => id !== userId);
    profileData.followers = profileData.followers.filter(id => id !== currentUser._id);

    // Update UI
    updateActionButtons();
    document.getElementById('followers-count').textContent = profileData.followers.length;
    showSuccess('User unfollowed!');
  } catch (error) {
    showError(error.message);
  }
}

/**
 * Show followers list (demo)
 */
function showFollowers(userId) {
  try {
    const modal = document.getElementById('followers-modal');
    document.getElementById('followers-modal-title').textContent = 'Followers';
    const followersList = document.getElementById('followers-list');

    if (profileData.followers.length === 0) {
      followersList.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No followers yet</p>';
    } else {
      followersList.innerHTML = profileData.followers
        .map(followerId => {
          const follower = mockUsers.find(u => u._id === followerId);
          if (!follower) return '';
          return `
            <div class="follower-item">
              <div class="follower-info" onclick="goToProfile('${follower.username}')">
                <img src="${follower.profilePicture}" alt="${follower.username}" class="follower-avatar">
                <div class="follower-details">
                  <div class="follower-username">${follower.username}</div>
                  <div class="follower-fullname">${follower.fullName}</div>
                </div>
              </div>
              <button class="follower-action" onclick="toggleFollowFromModal('${follower._id}')">
                ${currentUser.following.includes(follower._id) ? 'Following' : 'Follow'}
              </button>
            </div>
          `;
        })
        .join('');
    }

    modal.style.display = 'flex';
  } catch (error) {
    showError(error.message);
  }
}

/**
 * Show following list (demo)
 */
function showFollowing(userId) {
  try {
    const modal = document.getElementById('followers-modal');
    document.getElementById('followers-modal-title').textContent = 'Following';
    const followersList = document.getElementById('followers-list');

    if (profileData.following.length === 0) {
      followersList.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Not following anyone</p>';
    } else {
      followersList.innerHTML = profileData.following
        .map(userId => {
          const user = mockUsers.find(u => u._id === userId);
          if (!user) return '';
          return `
            <div class="follower-item">
              <div class="follower-info" onclick="goToProfile('${user.username}')">
                <img src="${user.profilePicture}" alt="${user.username}" class="follower-avatar">
                <div class="follower-details">
                  <div class="follower-username">${user.username}</div>
                  <div class="follower-fullname">${user.fullName}</div>
                </div>
              </div>
              <button class="follower-action" onclick="toggleFollowFromModal('${user._id}')">
                ${currentUser.following.includes(user._id) ? 'Following' : 'Follow'}
              </button>
            </div>
          `;
        })
        .join('');
    }

    modal.style.display = 'flex';
  } catch (error) {
    showError(error.message);
  }
}

/**
 * Toggle follow from modal (demo)
 */
function toggleFollowFromModal(userId) {
  const isFollowing = currentUser.following.includes(userId);

  if (isFollowing) {
    currentUser.following = currentUser.following.filter(id => id !== userId);
  } else {
    currentUser.following.push(userId);
  }

  // Reload followers/following list
  if (document.getElementById('followers-modal-title').textContent === 'Followers') {
    showFollowers(profileData._id);
  } else {
    showFollowing(profileData._id);
  }
}

/**
 * Go to user profile
 */
function goToProfile(username) {
  window.location.href = 'profile.html?username=' + username;
}

/**
 * Close followers modal
 */
function closeFollowersModal() {
  const modal = document.getElementById('followers-modal');
  modal.style.display = 'none';
}

/**
 * Show error message
 */
function showError(message) {
  const errorDiv = document.getElementById('error-message');
  errorDiv.textContent = message;
  errorDiv.style.display = 'block';
  setTimeout(() => {
    errorDiv.style.display = 'none';
  }, 5000);
}

/**
 * Show success message
 */
function showSuccess(message) {
  const successDiv = document.getElementById('success-message');
  successDiv.textContent = message;
  successDiv.style.display = 'block';
  setTimeout(() => {
    successDiv.style.display = 'none';
  }, 5000);
}

/**
 * Initialize sticky navbar
 */
function initStickyNavbar() {
  const navbarLogo = document.querySelector('.navbar-sticky-logo');
  const navbarHomeBtn = document.getElementById('navbar-home-btn');
  const navbarMessageBtn = document.getElementById('navbar-message-btn');
  const navbarProfileBtn = document.getElementById('navbar-profile-btn');
  const navbarDropdownMenu = document.getElementById('navbar-dropdown-menu');
  const searchInput = document.getElementById('navbar-search-input');
  const searchResults = document.getElementById('navbar-search-results');

  // Logo click - go to home
  if (navbarLogo) {
    navbarLogo.addEventListener('click', () => {
      window.location.href = '../index.html';
    });
  }

  // Home button - navigate to feed
  if (navbarHomeBtn) {
    navbarHomeBtn.addEventListener('click', () => {
      window.location.href = '../index.html';
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
      if (currentUser) {
        window.location.href = 'profile.html?username=' + currentUser.username;
      }
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
      window.location.href = '../index.html';
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
                   onclick="goToProfile('${user.username}')"
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

// Initialize on page load
document.addEventListener('DOMContentLoaded', initProfile);
