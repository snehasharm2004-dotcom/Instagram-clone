/**
 * Initialize navbar
 */
function initNavbar() {
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  const profileBtn = document.getElementById('profile-btn');
  const dropdownMenu = document.getElementById('dropdown-menu');
  const logoutBtn = document.getElementById('logout-btn');
  const newPostBtn = document.getElementById('new-post-btn');
  const homeBtn = document.getElementById('home-btn');
  const viewProfileBtn = document.getElementById('view-profile-btn');

  // Search users
  if (searchInput) {
    let searchTimeout;
    searchInput.addEventListener('input', async (e) => {
      clearTimeout(searchTimeout);
      const query = e.target.value.trim();

      if (query.length < 2) {
        searchResults.style.display = 'none';
        return;
      }

      searchTimeout = setTimeout(async () => {
        try {
          const { API_ENDPOINTS } = require('../config');
          const response = await api.get(API_ENDPOINTS.SEARCH_USERS + `?q=${query}`);

          if (response.users.length === 0) {
            searchResults.innerHTML = '<div style="padding: 16px; text-align: center; color: var(--text-secondary);">No users found</div>';
          } else {
            searchResults.innerHTML = response.users
              .map(user => `
                <div class="search-result-item" onclick="goToProfile('${user.username}')">
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
        } catch (error) {
          console.error('Search error:', error);
          searchResults.style.display = 'none';
        }
      }, 300);
    });

    // Close search results when clicking outside
    document.addEventListener('click', (e) => {
      if (e.target !== searchInput) {
        searchResults.style.display = 'none';
      }
    });
  }

  // Toggle dropdown menu
  if (profileBtn && dropdownMenu) {
    profileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdownMenu.classList.toggle('active');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav-dropdown')) {
        dropdownMenu.classList.remove('active');
      }
    });
  }

  // Logout
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      auth.logout();
      window.location.href = '../index.html';
    });
  }

  // New post
  if (newPostBtn) {
    newPostBtn.addEventListener('click', () => {
      const modal = document.getElementById('new-post-modal');
      if (modal) {
        modal.style.display = 'flex';
      }
    });
  }

  // Home button
  if (homeBtn) {
    homeBtn.addEventListener('click', () => {
      window.location.reload();
    });
  }

  // View profile
  if (viewProfileBtn) {
    viewProfileBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const user = auth.getUser();
      if (user) {
        window.location.href = `profile.html?username=${user.username}`;
      }
    });
  }
}

/**
 * Navigate to user profile
 */
function goToProfile(username) {
  window.location.href = `profile.html?username=${username}`;
}

/**
 * Close post modal
 */
function closePostModal() {
  const modal = document.getElementById('new-post-modal');
  if (modal) {
    modal.style.display = 'none';
    document.getElementById('post-form').reset();
    document.getElementById('image-preview').innerHTML = '';
    document.getElementById('caption-count').textContent = '0/2200';
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

// Initialize navbar on page load
document.addEventListener('DOMContentLoaded', initNavbar);
