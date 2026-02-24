// Get DOM elements
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const loadingOverlay = document.getElementById('loading');
const errorMessage = document.getElementById('error-message');

// Check if user is already logged in
if (auth.isAuthenticated()) {
  window.location.href = 'pages/feed.html';
}

/**
 * Toggle between login and register forms
 */
function toggleForms() {
  const loginFormDiv = document.getElementById('login-form');
  const registerFormDiv = document.getElementById('register-form');

  loginFormDiv.classList.toggle('active');
  registerFormDiv.classList.toggle('active');
}

/**
 * Show loading indicator
 */
function showLoading() {
  loadingOverlay.style.display = 'flex';
}

/**
 * Hide loading indicator
 */
function hideLoading() {
  loadingOverlay.style.display = 'none';
}

/**
 * Show error message
 */
function showError(message) {
  errorMessage.style.display = 'block';
  errorMessage.textContent = message;
  errorMessage.classList.remove('success');

  // Auto hide after 5 seconds
  setTimeout(() => {
    errorMessage.style.display = 'none';
  }, 5000);
}

/**
 * Show success message
 */
function showSuccess(message) {
  errorMessage.style.display = 'block';
  errorMessage.textContent = message;
  errorMessage.classList.add('success');

  // Auto hide after 5 seconds
  setTimeout(() => {
    errorMessage.style.display = 'none';
  }, 5000);
}

/**
 * Handle login form submission
 */
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value.trim();

  // Validate input
  if (!email || !password) {
    showError('Please fill in all fields');
    return;
  }

  showLoading();

  try {
    // Use mock data - find user by email
    const user = mockUsers.find(u => u.email === email);

    if (!user || user.password !== password) {
      showError('Invalid email or password');
      hideLoading();
      return;
    }

    // Create mock token
    const mockToken = 'mock_jwt_token_' + user._id + '_' + Date.now();

    // Save token and user data
    auth.saveToken(mockToken);
    auth.saveUser(user);

    showSuccess('Login successful! Redirecting...');

    // Redirect to feed after short delay
    setTimeout(() => {
      window.location.href = 'pages/feed.html';
    }, 500);
  } catch (error) {
    showError(error.message || 'Login failed');
  } finally {
    hideLoading();
  }
});

/**
 * Handle register form submission
 */
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const fullName = document.getElementById('register-fullname').value.trim();
  const email = document.getElementById('register-email').value.trim();
  const username = document.getElementById('register-username').value.trim();
  const password = document.getElementById('register-password').value.trim();

  // Validate input
  if (!fullName || !email || !username || !password) {
    showError('Please fill in all fields');
    return;
  }

  // Validate username
  if (!/^[a-zA-Z0-9._]+$/.test(username)) {
    showError('Username can only contain letters, numbers, dots, and underscores');
    return;
  }

  // Validate password length
  if (password.length < 6) {
    showError('Password must be at least 6 characters long');
    return;
  }

  showLoading();

  try {
    // Use mock data - check if username/email already exists
    const existingUser = mockUsers.find(u => u.username === username || u.email === email);
    if (existingUser) {
      showError('Username or email already exists');
      hideLoading();
      return;
    }

    // Create new user
    const newUser = {
      _id: String(mockUsers.length + 1),
      username,
      email,
      fullName,
      password,
      profilePicture: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
      bio: '',
      followers: [],
      following: [],
      posts: []
    };

    // Add to mock users
    mockUsers.push(newUser);

    // Create mock token
    const mockToken = 'mock_jwt_token_' + newUser._id + '_' + Date.now();

    // Save token and user data
    auth.saveToken(mockToken);
    auth.saveUser(newUser);

    showSuccess('Account created successfully! Redirecting...');

    // Redirect to feed after short delay
    setTimeout(() => {
      window.location.href = 'pages/feed.html';
    }, 500);
  } catch (error) {
    showError(error.message || 'Registration failed');
  } finally {
    hideLoading();
  }
});

// Add event listeners for form switching
document.querySelectorAll('.link-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    toggleForms();
  });
});
