// Check authentication
if (!auth.isAuthenticated()) {
  window.location.href = '../index.html';
}

let currentPage = 1;
let isLoading = false;
let hasMore = true;

/**
 * Initialize feed page
 */
function initFeed() {
  const postForm = document.getElementById('post-form');
  const imageInput = document.getElementById('post-image');
  const captionInput = document.getElementById('post-caption');
  const imagePreview = document.getElementById('image-preview');
  const captionCount = document.getElementById('caption-count');
  const closePostBtn = document.querySelector('.close-btn');
  const modal = document.getElementById('new-post-modal');

  // Close modal on background click
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closePostModal();
      }
    });
  }

  // Image preview
  if (imageInput) {
    imageInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          imagePreview.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Caption counter
  if (captionInput) {
    captionInput.addEventListener('input', (e) => {
      captionCount.textContent = `${e.target.value.length}/2200`;
    });
  }

  // Create post form
  if (postForm) {
    postForm.addEventListener('submit', createPost);
  }

  // Load initial posts
  loadPosts();

  // Infinite scroll
  window.addEventListener('scroll', () => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
      !isLoading &&
      hasMore
    ) {
      loadPosts();
    }
  });
}

/**
 * Load posts for the feed
 */
async function loadPosts() {
  if (isLoading || !hasMore) return;

  isLoading = true;
  const loadingDiv = document.getElementById('loading');
  const noPostsDiv = document.getElementById('no-posts');
  const feedDiv = document.getElementById('posts-feed');

  if (loadingDiv) loadingDiv.style.display = 'block';

  try {
    const { API_ENDPOINTS } = require('../config');
    const response = await api.get(
      API_ENDPOINTS.GET_FEED + `?page=${currentPage}&limit=10`
    );

    if (response.posts.length === 0 && currentPage === 1) {
      if (noPostsDiv) noPostsDiv.style.display = 'block';
      if (feedDiv) feedDiv.innerHTML = '';
    } else {
      if (noPostsDiv) noPostsDiv.style.display = 'none';

      const postsHTML = response.posts
        .map(post => createPostCard(post))
        .join('');

      feedDiv.innerHTML += postsHTML;
    }

    hasMore = response.hasMore;
    currentPage++;
  } catch (error) {
    console.error('Error loading posts:', error);
    showError('Failed to load posts');
  } finally {
    isLoading = false;
    if (loadingDiv) loadingDiv.style.display = 'none';
  }
}

/**
 * Create a new post
 */
async function createPost(e) {
  e.preventDefault();

  const imageInput = document.getElementById('post-image');
  const captionInput = document.getElementById('post-caption');
  const locationInput = document.getElementById('post-location');
  const file = imageInput.files[0];

  if (!file) {
    showError('Please select an image');
    return;
  }

  // Create FormData
  const formData = new FormData();
  formData.append('image', file);
  formData.append('caption', captionInput.value.trim());
  formData.append('location', locationInput.value.trim());

  try {
    const { API_ENDPOINTS } = require('../config');

    // Upload image and create post
    const response = await api.post(API_ENDPOINTS.CREATE_POST, formData);

    // Add new post to the top of feed
    const feedDiv = document.getElementById('posts-feed');
    const postHTML = createPostCard(response.post);
    feedDiv.innerHTML = postHTML + feedDiv.innerHTML;

    // Clear form and close modal
    closePostModal();
    showSuccess('Post created successfully!');
  } catch (error) {
    showError(error.message || 'Failed to create post');
  }
}

/**
 * Load suggested users for sidebar
 */
async function loadSuggestedUsers() {
  try {
    const user = auth.getUser();
    const { API_ENDPOINTS } = require('../config');

    // Get a list of users to suggest
    const response = await api.get(API_ENDPOINTS.SEARCH_USERS + '?q=');

    const suggestedDiv = document.getElementById('suggested-users');
    if (suggestedDiv && response.users) {
      const suggestedHTML = response.users
        .filter(u => u._id !== user._id && !user.following.includes(u._id))
        .slice(0, 5)
        .map(u => `
          <div class="suggested-user">
            <div class="user-info" onclick="goToProfile('${u.username}')">
              <img src="${u.profilePicture}" alt="${u.username}" class="user-avatar">
              <div class="user-details">
                <div class="user-username">${u.username}</div>
                <div class="user-status">Suggested for you</div>
              </div>
            </div>
            <button class="follow-btn" onclick="followUser('${u._id}')">Follow</button>
          </div>
        `)
        .join('');

      suggestedDiv.innerHTML = suggestedHTML;
    }
  } catch (error) {
    console.error('Error loading suggested users:', error);
  }
}

/**
 * Follow a user
 */
async function followUser(userId) {
  try {
    const { API_ENDPOINTS } = require('../config');
    await api.post(API_ENDPOINTS.FOLLOW_USER(userId));

    // Update local user data
    const user = auth.getUser();
    user.following.push(userId);
    auth.saveUser(user);

    // Update button
    const btn = event.target;
    btn.textContent = 'Following';
    btn.disabled = true;

    showSuccess('User followed!');
  } catch (error) {
    showError(error.message);
  }
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

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  initFeed();
  loadSuggestedUsers();
});
