# 🗳️ Online Voting System - Frontend Demo

A **frontend-only voting system** built with vanilla JavaScript, Bootstrap 5, and localStorage. Perfect for university group assignments where each team member can work on separate pull requests.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [File Structure](#file-structure)
- [Getting Started](#getting-started)
- [Features](#features)
- [How It Works](#how-it-works)
- [Team Workflow](#team-workflow)
- [Developer Guide](#developer-guide)
- [Testing](#testing)

---

## 🎯 Project Overview

This is a **mock voting system** with no backend—all data is stored in the browser's `localStorage`. Each voter can:

1. **Login** with their name and ID
2. **View candidates** and their parties
3. **Cast a vote** (one per voter)
4. **See live results** with charts and statistics

The project uses **vanilla JavaScript** with **Bootstrap 5 CDN** for styling, making it lightweight and easy to host anywhere.

### Tech Stack

- **Frontend:** HTML5, CSS3 (Bootstrap 5), Vanilla JavaScript ES6+
- **Data Storage:** Browser localStorage
- **Build Tool:** None (no bundler needed)
- **Package Manager:** Not required

---

## 📁 File Structure

```
project-root/
├── index.html          # Login page (voter authentication)
├── voting.html         # Main voting interface with candidate list
├── results.html        # Results dashboard with charts
├── app.js              # Core application logic (localStorage management)
├── style.css           # Custom CSS styles (Bootstrap supplements)
└── README.md           # This file
```

### File Responsibilities

| File             | Purpose                                 | Team Member    |
| ---------------- | --------------------------------------- | -------------- |
| **index.html**   | Login form for voter authentication     | Frontend Dev 1 |
| **voting.html**  | Display candidates and voting interface | Frontend Dev 2 |
| **results.html** | Results dashboard with charts/tables    | Frontend Dev 3 |
| **app.js**       | Core business logic (CRITICAL - shared) | Frontend Dev 1 |
| **style.css**    | Styling and responsive design           | Frontend Dev 4 |

---

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- A code editor (VS Code recommended)
- Git for version control

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd voting-system
   ```

2. **Open in browser**
   - Double-click `index.html` to open the login page
   - **OR** use a local server:

     ```bash
     # Using Python 3
     python -m http.server 8000

     # Using Node.js (if http-server is installed)
     npx http-server
     ```

   - Then visit `http://localhost:8000`

3. **Test the application**
   - Login with any name and ID (must be unique)
   - Select a candidate and vote
   - View results on the results page

---

## ✨ Features

### 1. **Voter Authentication**

- Simple login form with name and ID validation
- Prevents duplicate voting with voter ID tracking
- Session management via localStorage

### 2. **Candidate List**

- 6 mock candidates with names, parties, and bios
- Visual cards with emoji avatars
- Direct "Vote for [Name]" buttons on each card
- Smooth hover effects and animations

### 3. **Voting Interface**

- Click "Vote for [Candidate]" button on any candidate card
- Confirmation modal appears showing candidate details
- Second confirmation required before vote is recorded
- One vote per voter ID (enforced)
- Clear visual feedback of successful voting

### 4. **Live Results**

- Real-time vote counts
- Bar chart and pie chart visualizations (Chart.js)
- Detailed results table with rankings
- Vote statistics (total votes, voter count, etc.)

### 5. **Data Persistence**

- All data stored in browser localStorage
- Survives page refreshes
- Prevents duplicate votes automatically

### 6. **Admin Functions**

- Reset all data button (useful for testing)
- Add mock votes for demonstration
- Debug state logging in console

---

## 🔧 How It Works

### Application Flow

```
User Opens index.html
        ↓
    Login Form
        ↓
   Validate & Store Session (localStorage)
        ↓
   Redirect to voting.html
        ↓
   Display Candidates with Vote Buttons
        ↓
   User Clicks "Vote for [Name]" Button
        ↓
   Confirmation Modal Appears
   (Shows candidate details & warning)
        ↓
   User Confirms or Changes Mind
        ↓
   If Confirmed:
   • Record Vote in localStorage
   • Mark Voter ID as "voted"
   • Show Success Message
   • Redirect to results.html
        ↓
   Display Results with Charts
```

### Data Structure (localStorage)

**Candidates** - `voting_candidates`

```javascript
[
  {
    id: 1,
    name: "Alice Johnson",
    party: "Progressive Party",
    bio: "Education and healthcare advocate",
    avatar: "👩‍💼",
    votes: 5,
  },
  // ... more candidates
];
```

**Voters** - `voting_voters`

```javascript
["voter_id_1", "voter_id_2", "voter_id_3"];
```

**Current Session** - `voting_session`

```javascript
{
  name: "John Doe",
  id: "12345",
  loginTime: "2026-02-22T10:30:00"
}
```

---

## 👥 Team Workflow

### How to Divide Work

Each team member can focus on a specific HTML file without conflicts:

#### **Developer 1: `index.html` + `app.js`**

- Create engaging login form
- Improve validation feedback
- Enhance form styling
- **Important:** Coordinate any changes to `app.js` with the team

#### **Developer 2: `voting.html`**

- Design and enhance candidate cards
- Implement animated vote buttons
- Create and style confirmation modal
- Add smooth transitions and feedback
- Improve candidate card hover effects
- Enhance modal animations

#### **Developer 3: `results.html`**

- Improve chart visualizations
- Add more analytics
- Enhance results table
- Add export functionality

#### **Developer 4: `style.css`**

- Create cohesive visual theme
- Ensure responsive design
- Add hover effects
- Implement light/dark mode (optional)

### Creating Pull Requests

1. **Create a feature branch**

   ```bash
   git checkout -b feature/my-feature
   ```

2. **Make your changes** to your assigned file(s)

3. **Test thoroughly**

   ```bash
   # Test the application
   python -m http.server 8000
   # Visit http://localhost:8000 in browser
   ```

4. **Commit with clear messages**

   ```bash
   git add .
   git commit -m "feat: improve candidate card styling in voting.html"
   ```

5. **Push and create PR**

   ```bash
   git push origin feature/my-feature
   ```

6. **Team reviews and merges**

---

## 👨‍💻 Developer Guide

### Understanding `app.js` (Core Logic)

The `app.js` file uses the **Module Pattern** (IIFE) to create a private namespace:

```javascript
const VotingApp = (function() {
  // Private variables and functions
  const MOCK_CANDIDATES = [...];

  // Private functions
  function initializeStorage() {...}

  // Public API
  return {
    getCandidates,
    loginVoter,
    recordVote,
    // ...
  };
})();
```

### Available Public API Methods

**Getters:**

```javascript
VotingApp.getCandidates(); // Get all candidates
VotingApp.getCurrentVoter(); // Get logged-in user
VotingApp.getVotingStats(); // Get statistics
VotingApp.isUserLoggedIn(); // Check login status
VotingApp.hasVoterVoted(voterId); // Check if already voted
```

**Authentication:**

```javascript
VotingApp.loginVoter(name, id); // Login a voter
VotingApp.logout(); // Logout current user
```

**Voting:**

```javascript
VotingApp.selectCandidate(id); // Select a candidate
VotingApp.recordVote(candidateId); // Record the vote
```

**Admin:**

```javascript
VotingApp.resetAllData(); // Clear everything
VotingApp.addMockVotes(); // Add demo votes
VotingApp.debugState(); // Log state to console
```

### Modifying Candidates

Edit the `MOCK_CANDIDATES` array in `app.js`:

```javascript
const MOCK_CANDIDATES = [
  {
    id: 1,
    name: "Your Name",
    party: "Your Party",
    bio: "Your bio here",
    avatar: "👤", // Emoji avatar
    votes: 0,
  },
  // Add more...
];
```

### Adding Features

**Example: Add a bio modal to candidate cards**

In `voting.html`:

```html
<div class="modal fade" id="bioModal">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-body" id="bioContent"></div>
    </div>
  </div>
</div>
```

In the candidate card click handler:

```javascript
candidateCard.addEventListener("click", function () {
  document.getElementById("bioContent").textContent = candidate.bio;
  new bootstrap.Modal(document.getElementById("bioModal")).show();
});
```

---

## 🧪 Testing

### Test Scenarios

1. **Test Login Validation**
   - Try empty fields (should fail)
   - Try duplicate voter IDs (should warn on second login)
   - Login with valid credentials

2. **Test Voting Process**
   - Login with valid credentials
   - Navigate to voting page
   - Click "Vote for [Candidate]" button on any card
   - Verify confirmation modal appears with candidate details
   - Click "Change Your Mind" to close modal
   - Click "Vote for" again on a different candidate
   - Click "Confirm Vote" in modal
   - Verify success message appears
   - Verify vote count increased on results page
   - Try to vote again with same ID (should fail on login)

3. **Test Results Dashboard**
   - Check if all candidates appear
   - Verify vote counts are correct
   - Test chart rendering
   - Click reset and verify data clears

4. **Test LocalStorage Persistence**
   - Record votes
   - Refresh the page
   - Verify votes are still there
   - Check browser console → Application → Local Storage

### Console Commands (Developer Tools)

Open browser console (F12) and try:

```javascript
// View all candidates
VotingApp.getCandidates();

// View statistics
VotingApp.getVotingStats();

// Add 100 mock votes for testing
VotingApp.addMockVotes();

// View complete state
VotingApp.debugState();

// Reset everything
VotingApp.resetAllData();
```

### Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ⚠️ IE 11 (not supported - uses modern JavaScript)

---

## 🎨 Customization

### Change Color Scheme

In `style.css`:

```css
:root {
  --primary-color: #0d6efd; /* Change this */
  --success-color: #198754;
  --info-color: #0dcaf0;
  /* ... etc */
}
```

### Add Your University Logo

In `index.html` navbar:

```html
<img src="path/to/logo.png" alt="University Logo" height="40" />
```

### Modify Bootstrap CDN Version

In any HTML file, change the version in the CDN URL:

```html
<!-- Change 5.3.0 to a different version -->
<link
  href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
  rel="stylesheet"
/>
```

---

## ⚠️ Limitations

- **No Backend:** All voting data is client-side. Resets if browser cache is cleared.
- **No Authentication:** Just a mock login for demo purposes.
- **Single Browser:** Each browser is independent (no across-device voting).
- **No Vote Verification:** Anyone can vote by changing voter ID.

> **For production:** Implement a real backend with OAuth, database, and vote verification.

---

## 🐛 Troubleshooting

### "Can't find app.js" error

- Make sure all files are in the same directory
- Check file names are exactly matching (case-sensitive on Linux)

### localStorage not working

- Check if you're running from `file://` (Open via local server instead)
- Clear browser cache and try again
- Check browser privacy settings

### Charts not appearing

- Verify Chart.js CDN is loading (check Network tab in DevTools)
- Check browser console for JavaScript errors

### Can't reset after voting

- Use the "Reset All Data" button on results page
- Or in console: `VotingApp.resetAllData()`

---

## 📚 Learning Resources

- [Bootstrap 5 Documentation](https://getbootstrap.com/docs/5.0/)
- [MDN: LocalStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [JavaScript Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [Chart.js Documentation](https://www.chartjs.org/)

---

## 📝 Assignment Checklist

- [x] Frontend-only implementation (no backend)
- [x] Modular file structure (each developer can work separately)
- [x] Bootstrap 5 for responsive design
- [x] localStorage for data persistence
- [x] Heavily commented code for beginners
- [x] Multiple pages (login, voting, results)
- [x] Data visualization (charts)
- [x] Input validation and error handling
- [x] README documentation

---

## 📄 License

This project is for educational purposes. Use freely for your university assignment.

---

## 👨‍🎓 Contributors

- **Developer 1:** index.html + app.js
- **Developer 2:** voting.html
- **Developer 3:** results.html
- **Developer 4:** style.css

---

## ✉️ Support

If you encounter issues:

1. Check this README first
2. Search GitHub Issues
3. Check browser console for errors (F12)
4. Review the code comments in `app.js`

---

**Happy coding! 🚀🗳️**
