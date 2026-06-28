/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const vanillaSourceCode = {
  indexHtml: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Google Sign-In - Educational Practice</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <!-- Educational Safety Disclaimer Banner -->
  <div class="safety-banner">
    ⚠️ <strong>Educational UI Demonstration Only</strong>. Real credentials are not collected, saved, or transmitted.
  </div>

  <div class="container">
    <!-- Left Section: Large Classic G Logo & Forgot Password Text -->
    <div class="left-section">
      <svg class="g-logo" viewBox="0 0 24 24" width="220" height="220">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
      <div class="forgot-text">Forgot Password!</div>
    </div>

    <!-- Right Section: Login Card -->
    <div class="right-section">
      <div class="login-card">
        <!-- Logo Header inside Card -->
        <div class="card-header">
          <span class="logo-g">G</span><span class="logo-o1">o</span><span class="logo-o2">o</span><span class="logo-g2">g</span><span class="logo-l">l</span><span class="logo-e">e</span>
        </div>

        <div class="card-sub-header">
          <span class="signin-title">Sign in</span>
          <span class="gray-google-logo">Google</span>
        </div>

        <!-- Form for Login Practice -->
        <form id="loginForm">
          <div class="form-group">
            <label for="emailOrPhone">Email</label>
            <input type="text" id="emailOrPhone" placeholder="Enter email or phone" autocomplete="username">
            <div class="error-message" id="emailError"></div>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" autocomplete="new-password">
            <div class="error-message" id="passwordError"></div>
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input type="password" id="confirmPassword" autocomplete="new-password">
            <div class="error-message" id="confirmError"></div>
          </div>

          <div class="action-row">
            <button type="submit" class="btn-signin">Sign in</button>
            <label class="checkbox-container">
              <input type="checkbox" id="staySignedIn" checked>
              <span class="checkmark"></span>
              Stay signed in
            </label>
          </div>
        </form>

        <div class="card-footer">
          <a href="#" class="footer-link">Can't access your account?</a>
        </div>
      </div>
      
      <!-- Developer Route Link -->
      <div class="dev-nav">
        <a href="admin-demo.html">🛠️ Practice Admin Dashboard (/admin-demo.html)</a>
      </div>
    </div>
  </div>

  <script src="js/app.js"></script>
</body>
</html>`,

  adminDemoHtml: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Dashboard - Educational Practice</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body class="admin-body">
  <!-- Educational Safety Disclaimer Banner -->
  <div class="safety-banner">
    ⚠️ <strong>Educational Admin Dashboard Only</strong>. Submissions below are local metadata and do not include actual passwords.
  </div>

  <div class="admin-container">
    <header class="admin-header">
      <div class="admin-title-group">
        <h1>🛠️ Educational Submission Log</h1>
        <p>No passwords are ever recorded. We only track password lengths, browser metadata, and matching state.</p>
      </div>
      <div class="admin-actions-top">
        <button id="themeToggle" class="btn-secondary">🌓 Toggle Theme</button>
        <a href="index.html" class="btn-back">← Back to Login</a>
      </div>
    </header>

    <div class="dashboard-controls">
      <div class="search-box">
        <input type="text" id="searchInput" placeholder="Search by email or phone...">
      </div>
      <div class="control-buttons">
        <button id="exportBtn" class="btn-action">📥 Export to JSON</button>
        <button id="clearBtn" class="btn-danger">🗑️ Clear All Records</button>
      </div>
    </div>

    <!-- Submissions Table Wrapper -->
    <div class="table-wrapper">
      <table id="submissionsTable">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Email / Phone</th>
            <th>Password Length</th>
            <th>Passwords Match?</th>
            <th>Browser Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="tableBody">
          <!-- Populated dynamically via JS -->
        </tbody>
      </table>
      <div id="noRecords" class="no-records-message" style="display: none;">
        No educational submission records found. Fill out the login form to see logs here.
      </div>
    </div>
  </div>

  <script src="js/admin.js"></script>
</body>
</html>`,

  styleCss: `/* Core Variables and Font Styling */
:root {
  --font-family: Arial, sans-serif;
  --bg-color: #f1f1f1;
  --card-bg: #ffffff;
  --text-primary: #222222;
  --text-muted: #666666;
  --border-color: #d9d9d9;
  --primary-blue: #4285f4;
  --primary-blue-hover: #357ae8;
  --danger-red: #ea4335;
  --success-green: #34a853;
}

[data-theme="dark"] {
  --bg-color: #121212;
  --card-bg: #1e1e1e;
  --text-primary: #f3f4f6;
  --text-muted: #9ca3af;
  --border-color: #374151;
  --primary-blue: #3b82f6;
  --primary-blue-hover: #2563eb;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-family);
  background-color: var(--bg-color);
  color: var(--text-primary);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Educational Safety Banner */
.safety-banner {
  background-color: #fffbeb;
  border-bottom: 1px solid #fef3c7;
  color: #b45309;
  padding: 10px 15px;
  text-align: center;
  font-size: 13px;
  z-index: 10;
}

[data-theme="dark"] .safety-banner {
  background-color: #78350f;
  color: #fef3c7;
  border-bottom: 1px solid #92400e;
}

/* Container Structure */
.container {
  max-width: 960px;
  width: 100%;
  margin: auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  padding: 40px 20px;
  gap: 40px;
}

/* Left Section Details */
.left-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  flex: 1;
}

.g-logo {
  margin-bottom: 15px;
}

.forgot-text {
  color: var(--danger-red);
  font-size: 28px;
  font-weight: bold;
  letter-spacing: -0.5px;
  margin-top: 10px;
}

/* Right Section & Login Card */
.right-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.login-card {
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 3px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;
  padding: 30px 40px 40px 40px;
}

/* Classic Google Typography Logos */
.card-header {
  text-align: center;
  font-size: 32px;
  font-weight: 500;
  margin-bottom: 24px;
}

.card-header .logo-g { color: #4285F4; }
.card-header .logo-o1 { color: #EA4335; }
.card-header .logo-o2 { color: #FBBC05; }
.card-header .logo-g2 { color: #4285F4; }
.card-header .logo-l { color: #34A853; }
.card-header .logo-e { color: #EA4335; }

.card-sub-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 25px;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 15px;
}

.signin-title {
  font-size: 20px;
  font-weight: 400;
}

.gray-google-logo {
  color: #aaaaaa;
  font-size: 16px;
  font-weight: bold;
}

/* Form Styles */
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 6px;
  color: var(--text-primary);
}

.form-group input {
  width: 100%;
  height: 36px;
  padding: 8px;
  font-size: 15px;
  border: 1px solid var(--border-color);
  border-radius: 2px;
  background-color: transparent;
  color: var(--text-primary);
  outline: none;
}

.form-group input:focus {
  border-color: var(--primary-blue);
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);
}

.error-message {
  color: var(--danger-red);
  font-size: 12px;
  margin-top: 5px;
  min-height: 15px;
}

/* Action Rows */
.action-row {
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;
  margin-top: 25px;
}

.btn-signin {
  background-color: var(--primary-blue);
  border: 1px solid #3079ed;
  color: white;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: bold;
  border-radius: 2px;
  cursor: pointer;
  transition: background-color 0.1s;
}

.btn-signin:hover {
  background-color: var(--primary-blue-hover);
}

.checkbox-container {
  display: flex;
  align-items: center;
  font-size: 13px;
  color: var(--text-muted);
  cursor: pointer;
  user-select: none;
}

.checkbox-container input {
  margin-right: 6px;
}

/* Card Footer */
.card-footer {
  margin-top: 25px;
  text-align: left;
}

.footer-link {
  color: var(--primary-blue);
  font-size: 13px;
  text-decoration: none;
}

.footer-link:hover {
  text-decoration: underline;
}

.dev-nav {
  margin-top: 25px;
  text-align: center;
}

.dev-nav a {
  font-size: 13px;
  color: var(--text-muted);
  text-decoration: none;
  background-color: rgba(0,0,0,0.03);
  padding: 6px 12px;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  transition: all 0.2s;
}

.dev-nav a:hover {
  background-color: rgba(0,0,0,0.07);
  color: var(--text-primary);
}

/* Admin Dashboard Specific Styles */
.admin-body {
  background-color: #f8f9fa;
}

.admin-container {
  max-width: 1100px;
  width: 100%;
  margin: 0 auto;
  padding: 40px 20px;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid var(--border-color);
  padding-bottom: 20px;
  margin-bottom: 30px;
}

.admin-header h1 {
  font-size: 24px;
  margin-bottom: 5px;
}

.admin-header p {
  color: var(--text-muted);
  font-size: 14px;
}

.admin-actions-top {
  display: flex;
  gap: 10px;
}

.btn-secondary, .btn-back, .btn-action, .btn-danger {
  padding: 8px 16px;
  font-size: 13px;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid var(--border-color);
  background-color: var(--card-bg);
  color: var(--text-primary);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
}

.btn-secondary:hover, .btn-back:hover {
  background-color: rgba(0,0,0,0.05);
}

.btn-action {
  background-color: var(--primary-blue);
  color: white;
  border-color: var(--primary-blue-hover);
}

.btn-action:hover {
  background-color: var(--primary-blue-hover);
}

.btn-danger {
  background-color: var(--danger-red);
  color: white;
  border-color: #d13024;
}

.btn-danger:hover {
  background-color: #d13024;
}

.dashboard-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 15px;
  flex-wrap: wrap;
}

.search-box input {
  height: 38px;
  width: 300px;
  padding: 0 12px;
  border-radius: 4px;
  border: 1px solid var(--border-color);
  font-size: 14px;
  background-color: var(--card-bg);
  color: var(--text-primary);
}

.control-buttons {
  display: flex;
  gap: 10px;
}

/* Responsive Data Table */
.table-wrapper {
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  overflow-x: auto;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 14px;
}

th, td {
  padding: 12px 15px;
  border-bottom: 1px solid var(--border-color);
}

th {
  background-color: rgba(0,0,0,0.02);
  font-weight: bold;
  color: var(--text-muted);
}

tr:last-child td {
  border-bottom: none;
}

.no-records-message {
  text-align: center;
  padding: 40px;
  color: var(--text-muted);
  font-size: 15px;
}

.badge {
  padding: 3px 8px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: bold;
}

.badge-success {
  background-color: #d1fae5;
  color: #065f46;
}

.badge-error {
  background-color: #fee2e2;
  color: #991b1b;
}

/* Responsive Adaptations */
@media (max-width: 768px) {
  .container {
    flex-direction: column;
    padding: 20px 10px;
    gap: 20px;
  }
  
  .forgot-text {
    font-size: 22px;
    margin-bottom: 15px;
  }
  
  .left-section svg {
    width: 120px;
    height: 120px;
  }
  
  .login-card {
    padding: 20px 25px;
  }
  
  .dashboard-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-box input {
    width: 100%;
  }
}
`,

  appJs: `// Helper to parse simple browser name from User Agent
function getBrowserName() {
  const userAgent = navigator.userAgent;
  if (userAgent.indexOf("Chrome") > -1) return "Chrome";
  if (userAgent.indexOf("Safari") > -1) return "Safari";
  if (userAgent.indexOf("Firefox") > -1) return "Firefox";
  if (userAgent.indexOf("MSIE") > -1 || !!document.documentMode) return "IE";
  if (userAgent.indexOf("Edge") > -1) return "Edge";
  return "Unknown Browser";
}

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  
  const emailInput = document.getElementById("emailOrPhone");
  const passwordInput = document.getElementById("password");
  const confirmInput = document.getElementById("confirmPassword");
  
  const emailError = document.getElementById("emailError");
  const passwordError = document.getElementById("passwordError");
  const confirmError = document.getElementById("confirmError");

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    // Reset standard error messages
    emailError.textContent = "";
    passwordError.textContent = "";
    confirmError.textContent = "";
    
    let isValid = true;
    
    // Email or Phone validation
    const emailVal = emailInput.value.trim();
    if (!emailVal) {
      emailError.textContent = "Email or Phone Number is required.";
      isValid = false;
    } else if (emailVal.includes("@") && !/^\\S+@\\S+\\.\\S+$/.test(emailVal)) {
      emailError.textContent = "Please enter a valid email format.";
      isValid = false;
    }
    
    // Password validation
    const passwordVal = passwordInput.value;
    if (!passwordVal) {
      passwordError.textContent = "Password is required.";
      isValid = false;
    } else if (passwordVal.length < 6) {
      passwordError.textContent = "Password must be at least 6 characters.";
      isValid = false;
    }
    
    // Confirm Password validation
    const confirmVal = confirmInput.value;
    if (confirmVal !== passwordVal) {
      confirmError.textContent = "Confirm Password must exactly match Password.";
      isValid = false;
    }

    if (isValid) {
      // SUCCESSFUL DEMO SUBMISSION (Record only educational metadata)
      const submission = {
        id: "submission_" + Date.now(),
        timestamp: new Date().toLocaleString(),
        emailOrPhone: emailVal,
        passwordLength: passwordVal.length,
        isMatched: passwordVal === confirmVal,
        browser: getBrowserName()
      };
      
      // Load current local logs, add new submission metadata, then save back
      const existing = JSON.parse(localStorage.getItem("demo_submissions") || "[]");
      existing.push(submission);
      localStorage.setItem("demo_submissions", JSON.stringify(existing));
      
      alert("🎉 Sign in submitted successfully (Educational Demo only)! Record stored safely in local logs without actual passwords.");
      
      // Reset form fields
      loginForm.reset();
    }
  });
});`,

  adminJs: `document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.getElementById("tableBody");
  const noRecords = document.getElementById("noRecords");
  const searchInput = document.getElementById("searchInput");
  const exportBtn = document.getElementById("exportBtn");
  const clearBtn = document.getElementById("clearBtn");
  const themeToggle = document.getElementById("themeToggle");

  let submissions = [];

  // Load submissions from localStorage
  function loadSubmissions() {
    submissions = JSON.parse(localStorage.getItem("demo_submissions") || "[]");
    renderTable(submissions);
  }

  // Render submissions table
  function renderTable(dataToRender) {
    tableBody.innerHTML = "";
    
    if (dataToRender.length === 0) {
      noRecords.style.display = "block";
      return;
    }
    
    noRecords.style.display = "none";
    
    dataToRender.forEach(item => {
      const row = document.createElement("tr");
      
      row.innerHTML = \`
        <td>\${item.timestamp}</td>
        <td><strong>\${escapeHtml(item.emailOrPhone)}</strong></td>
        <td>\${item.passwordLength} characters</td>
        <td>
          <span class="badge \${item.isMatched ? 'badge-success' : 'badge-error'}">
            \${item.isMatched ? 'Yes' : 'No'}
          </span>
        </td>
        <td>\${item.browser}</td>
        <td>
          <button class="btn-danger btn-sm" onclick="deleteRecord('\${item.id}')" style="padding: 4px 8px; font-size: 11px;">Delete</button>
        </td>
      \`;
      
      tableBody.appendChild(row);
    });
  }

  // Escape HTML helper to prevent XSS in educational labs
  function escapeHtml(text) {
    const div = document.createElement("div");
    div.innerText = text;
    return div.innerHTML;
  }

  // Delete a single record helper
  window.deleteRecord = function(id) {
    submissions = submissions.filter(item => item.id !== id);
    localStorage.setItem("demo_submissions", JSON.stringify(submissions));
    renderTable(submissions);
  };

  // Search filter
  searchInput.addEventListener("input", (e) => {
    const term = e.target.value.toLowerCase().trim();
    const filtered = submissions.filter(item => 
      item.emailOrPhone.toLowerCase().includes(term)
    );
    renderTable(filtered);
  });

  // Export to JSON file
  exportBtn.addEventListener("click", () => {
    if (submissions.length === 0) {
      alert("No data available to export.");
      return;
    }
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(submissions, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "educational_demo_submissions.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  });

  // Clear all records
  clearBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to clear all educational demo submission metadata?")) {
      localStorage.removeItem("demo_submissions");
      submissions = [];
      renderTable([]);
    }
  });

  // Theme Toggle for practice (light & dark mode toggle)
  themeToggle.addEventListener("click", () => {
    const currentTheme = document.body.getAttribute("data-theme");
    if (currentTheme === "dark") {
      document.body.removeAttribute("data-theme");
    } else {
      document.body.setAttribute("data-theme", "dark");
    }
  });

  // Initial load
  loadSubmissions();
});`
};
