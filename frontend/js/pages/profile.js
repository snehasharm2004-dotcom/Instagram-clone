// Check authentication
if (!auth.isAuthenticated()) {
  window.location.href = '../index.html';
}

const urlParams = new URLSearchParams(window.location.search);
const usernameParam = urlParams.get('username');
const currentUser = auth.getUser();
let profileData = null;
let isOwnProfile = false;

/**
 * Initialize profile page
 */
function initProfile() {
  const editForm = document.getElementById('edit-profile-form');
  const bioInput = document.getElementById('edit-bio');
  const bioCount = document.getElementById('bio-count');
  const editProfileModal = document.getElementById('edit-profile-modal');
  const followersModal = document.getElementById('followers-modal');

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
 * Load user profile
 */
async function loadProfile(username) {
  try {
    const { API_ENDPOINTS } = require('../config');
    const response = await api.get(API_ENDPOINTS.GET_USER(username));
    profileData = response.user;
    isOwnProfile = profileData._id === currentUser._id;

    // Populate profile info
    document.getElementById('profile-avatar').src = profileData.profilePicture;
    document.getElementById('profile-username').textContent = profileData.username;
    document.getElementById('profile-fullname').textContent = profileData.fullName;
    document.getElementById('profile-bio').textContent = profileData.bio || 'No bio';
    document.getElementById('posts-count').textContent = response.postsCount || 0;
    document.getElementById('followers-count').textContent = profileData.followers.length;
    document.getElementById('following-count').textContent = profileData.following.length;

    // Show appropriate buttons
    updateActionButtons();

    // Load posts
    loadUserPosts(profileData._id);
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
 * Load user posts
 */
async function loadUserPosts(userId) {
  try {
    const { API_ENDPOINTS } = require('../config');
    const response = await api.get(API_ENDPOINTS.GET_USER_POSTS(userId) + '?limit=50');

    const postsGrid = document.getElementById('posts-grid');
    const noPostsMessage = document.getElementById('no-posts-message');

    if (response.posts.length === 0) {
      postsGrid.innerHTML = '';
      noPostsMessage.style.display = 'block';
    } else {
      noPostsMessage.style.display = 'none';
      postsGrid.innerHTML = response.posts
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
 * Update profile
 */
async function updateProfile(e) {
  e.preventDefault();

  const fullName = document.getElementById('edit-fullname').value.trim();
  const bio = document.getElementById('edit-bio').value.trim();
  const email = document.getElementById('edit-email').value.trim();

  if (!fullName || !email) {
    showError('Full name and email are required');
    return;
  }

  try {
    const { API_ENDPOINTS } = require('../config');
    const response = await api.put(API_ENDPOINTS.UPDATE_PROFILE, {
      fullName,
      bio,
      email
    });

    // Update local user data
    profileData = response.user;
    auth.saveUser(response.user);

    // Reload profile
    loadProfile(profileData.username);
    closeEditModal();
    showSuccess('Profile updated successfully!');
  } catch (error) {
    showError(error.message || 'Failed to update profile');
  }
}

/**
 * Follow user
 */
async function followUser(userId) {
  try {
    const { API_ENDPOINTS } = require('../config');
    await api.post(API_ENDPOINTS.FOLLOW_USER(userId));

    // Update local user data
    currentUser.following.push(userId);
    auth.saveUser(currentUser);

    // Reload profile
    loadProfile(profileData.username);
    showSuccess('User followed!');
  } catch (error) {
    showError(error.message);
  }
}

/**
 * Unfollow user
 */
async function unfollowUser(userId) {
  try {
    const { API_ENDPOINTS } = require('../config');
    await api.delete(API_ENDPOINTS.UNFOLLOW_USER(userId));

    // Update local user data
    currentUser.following = currentUser.following.filter(id => id !== userId);
    auth.saveUser(currentUser);

    // Reload profile
    loadProfile(profileData.username);
    showSuccess('User unfollowed!');
  } catch (error) {
    showError(error.message);
  }
}

/**
 * Show followers list
 */
async function showFollowers(userId) {
  try {
    const { API_ENDPOINTS } = require('../config');
    const response = await api.get(API_ENDPOINTS.GET_FOLLOWERS(userId));

    const modal = document.getElementById('followers-modal');
    document.getElementById('followers-modal-title').textContent = 'Followers';
    const followersList = document.getElementById('followers-list');

    if (response.followers.length === 0) {
      followersList.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No followers yet</p>';
    } else {
      followersList.innerHTML = response.followers
        .map(follower => `
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
        `)
        .join('');
    }

    modal.style.display = 'flex';
  } catch (error) {
    showError(error.message);
  }
}

/**
 * Show following list
 */
async function showFollowing(userId) {
  try {
    const { API_ENDPOINTS } = require('../config');
    const response = await api.get(API_ENDPOINTS.GET_FOLLOWING(userId));

    const modal = document.getElementById('followers-modal');
    document.getElementById('followers-modal-title').textContent = 'Following';
    const followersList = document.getElementById('followers-list');

    if (response.following.length === 0) {
      followersList.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Not following anyone</p>';
    } else {
      followersList.innerHTML = response.following
        .map(user => `
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
        `)
        .join('');
    }

    modal.style.display = 'flex';
  } catch (error) {
    showError(error.message);
  }
}

/**
 * Toggle follow from modal
 */
async function toggleFollowFromModal(userId) {
  const isFollowing = currentUser.following.includes(userId);

  try {
    const { API_ENDPOINTS } = require('../config');

    if (isFollowing) {
      await api.delete(API_ENDPOINTS.UNFOLLOW_USER(userId));
      currentUser.following = currentUser.following.filter(id => id !== userId);
    } else {
      await api.post(API_ENDPOINTS.FOLLOW_USER(userId));
      currentUser.following.push(userId);
    }

    auth.saveUser(currentUser);
    // Reload followers/following list
    if (document.getElementById('followers-modal-title').textContent === 'Followers') {
      showFollowers(profileData._id);
    } else {
      showFollowing(profileData._id);
    }
  } catch (error) {
    showError(error.message);
  }
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

// Initialize on page load
document.addEventListener('DOMContentLoaded', initProfile);
