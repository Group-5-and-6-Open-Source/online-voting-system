const VotingApp = (function () {
  const MOCK_CANDIDATES = [
    {
      id: 1,
      name: "Alice Johnson",
      party: "Progressive Party",
      bio: "Education and healthcare advocate",
      avatar: "👩‍💼",
      votes: 0,
    },
    {
      id: 2,
      name: "Bob Smith",
      party: "Conservative Alliance",
      bio: "Economic and business specialist",
      avatar: "👨‍💼",
      votes: 0,
    },
    {
      id: 3,
      name: "Carol Williams",
      party: "Green Initiative",
      bio: "Environmental and climate expert",
      avatar: "👩‍🌾",
      votes: 0,
    },
    {
      id: 4,
      name: "David Brown",
      party: "Labor Union",
      bio: "Worker rights and employment focus",
      avatar: "👨‍🔧",
      votes: 0,
    },
    {
      id: 5,
      name: "Emma Davis",
      party: "Free Democrats",
      bio: "Civil liberties and innovation",
      avatar: "👩‍💻",
      votes: 0,
    },
    {
      id: 6,
      name: "Frank Miller",
      party: "Independent",
      bio: "Community and social justice",
      avatar: "👨‍🎓",
      votes: 0,
    },
  ];

  // ========================================================================
  // 2. LOCAL STORAGE KEYS CONSTANTS
  // ========================================================================

  const STORAGE_KEYS = {
    CANDIDATES: "voting_candidates", // Stores candidate data with vote counts
    VOTERS: "voting_voters", // Stores list of voters who have voted
    CURRENT_SESSION: "voting_session", // Stores current logged-in user info
    SELECTED_CANDIDATE: "voting_selected", // Stores temporarily selected candidate
  };

  // ========================================================================
  // 3. INITIALIZATION FUNCTION
  // ========================================================================

  /**
   * Initialize the application with mock data if nothing is stored yet
   * This function is called on first page load to set up the voting system
   */
  function initializeStorage() {
    // Check if data already exists in localStorage
    if (!localStorage.getItem(STORAGE_KEYS.CANDIDATES)) {
      // First time setup - store the mock candidates data
      localStorage.setItem(
        STORAGE_KEYS.CANDIDATES,
        JSON.stringify(MOCK_CANDIDATES),
      );
      console.log("✓ Voting system initialized with mock candidates");
    }

    // Initialize voters list if it doesn't exist
    if (!localStorage.getItem(STORAGE_KEYS.VOTERS)) {
      localStorage.setItem(STORAGE_KEYS.VOTERS, JSON.stringify([]));
      console.log("✓ Voter registry initialized");
    }
  }

  // Initialize on script load
  initializeStorage();

  // ========================================================================
  // 4. PUBLIC API - GETTER FUNCTIONS (Read-only operations)
  // ========================================================================

  /**
   * Get all candidates with their current vote counts
   * @returns {Array} Array of candidate objects
   */
  function getCandidates() {
    const candidatesJson = localStorage.getItem(STORAGE_KEYS.CANDIDATES);
    return candidatesJson ? JSON.parse(candidatesJson) : MOCK_CANDIDATES;
  }

  /**
   * Get a single candidate by ID
   * @param {Number} candidateId - The ID of the candidate
   * @returns {Object|null} The candidate object or null if not found
   */
  function getCandidateById(candidateId) {
    const candidates = getCandidates();
    return candidates.find((c) => c.id === parseInt(candidateId)) || null;
  }

  /**
   * Get list of all voters who have already voted
   * This is used to prevent duplicate voting
   * @returns {Array} Array of voter IDs who have voted
   */
  function getVoterRegistry() {
    const votersJson = localStorage.getItem(STORAGE_KEYS.VOTERS);
    return votersJson ? JSON.parse(votersJson) : [];
  }

  /**
   * Check if a specific voter has already voted
   * @param {String} voterId - The voter's ID
   * @returns {Boolean} true if voter has voted, false otherwise
   */
  function hasVoterVoted(voterId) {
    const voters = getVoterRegistry();
    return voters.includes(voterId.toString());
  }

  /**
   * Get current logged-in user information
   * @returns {Object|null} Current session info or null if not logged in
   */
  function getCurrentVoter() {
    const sessionJson = localStorage.getItem(STORAGE_KEYS.CURRENT_SESSION);
    return sessionJson ? JSON.parse(sessionJson) : null;
  }

  /**
   * Check if a user is currently logged in
   * @returns {Boolean} true if user is logged in, false otherwise
   */
  function isUserLoggedIn() {
    return getCurrentVoter() !== null;
  }

  /**
   * Get the currently selected candidate (before voting)
   * @returns {Number|null} Candidate ID or null if none selected
   */
  function getSelectedCandidate() {
    const selectedJson = localStorage.getItem(STORAGE_KEYS.SELECTED_CANDIDATE);
    return selectedJson ? parseInt(JSON.parse(selectedJson)) : null;
  }

  /**
   * Calculate voting statistics for display on results page
   * @returns {Object} Statistics object with totals and percentages
   */
  function getVotingStats() {
    const candidates = getCandidates();
    const voters = getVoterRegistry();

    // Calculate totals
    const totalVotes = candidates.reduce((sum, c) => sum + c.votes, 0);
    const totalVoters = voters.length;

    // Calculate turnout percentage (assuming max voters is registered voters + new ones)
    const turnoutPercentage = totalVotes > 0 ? totalVoters : 0;

    return {
      totalVotes: totalVotes,
      totalVoters: totalVoters,
      totalCandidates: candidates.length,
      turnoutPercentage: turnoutPercentage,
      votingPercentages: calculatePercentages(candidates, totalVotes),
    };
  }

  /**
   * Helper function to calculate vote percentages for each candidate
   * @param {Array} candidates - Array of candidate objects
   * @param {Number} totalVotes - Total number of votes cast
   * @returns {Object} Map of candidate IDs to their percentage
   */
  function calculatePercentages(candidates, totalVotes) {
    const percentages = {};
    candidates.forEach((candidate) => {
      percentages[candidate.id] =
        totalVotes > 0 ? Math.round((candidate.votes / totalVotes) * 100) : 0;
    });
    return percentages;
  }

  // ========================================================================
  // 5. PUBLIC API - USER AUTHENTICATION FUNCTIONS
  // ========================================================================

  /**
   * Process voter login - store session information
   * @param {String} voterName - Name of the voter
   * @param {String} voterId - ID of the voter
   * @throws {Error} if invalid inputs provided
   */
  function loginVoter(voterName, voterId) {
    // Validate inputs
    if (!voterName || !voterId) {
      throw new Error("Voter name and ID are required");
    }

    // Check if voter has already voted
    if (hasVoterVoted(voterId)) {
      throw new Error("This voter ID has already voted");
    }

    // Create and store session
    const session = {
      name: voterName,
      id: voterId.toString(),
      loginTime: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(session));
    console.log(`✓ User "${voterName}" logged in`);
  }

  /**
   * Process voter logout - clear session information
   */
  function logout() {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
    localStorage.removeItem(STORAGE_KEYS.SELECTED_CANDIDATE);
    console.log("✓ User logged out");
  }

  // ========================================================================
  // 6. PUBLIC API - VOTING FUNCTIONS
  // ========================================================================

  /**
   * Store the voter's candidate selection (before final submission)
   * @param {Number} candidateId - ID of the selected candidate
   * @throws {Error} if candidate doesn't exist
   */
  function selectCandidate(candidateId) {
    const candidate = getCandidateById(candidateId);
    if (!candidate) {
      throw new Error("Invalid candidate ID");
    }

    localStorage.setItem(
      STORAGE_KEYS.SELECTED_CANDIDATE,
      JSON.stringify(candidateId),
    );
    console.log(`✓ Candidate "${candidate.name}" selected`);
  }

  /**
   * Record a vote for a candidate - main voting function
   * This increments the vote count and registers the voter
   * @param {Number} candidateId - ID of the candidate to vote for
   * @throws {Error} if validation fails
   */
  function recordVote(candidateId) {
    // Validate: user must be logged in
    const currentVoter = getCurrentVoter();
    if (!currentVoter) {
      throw new Error("User must be logged in to vote");
    }

    // Validate: voter cannot have already voted
    if (hasVoterVoted(currentVoter.id)) {
      throw new Error("This voter ID has already voted");
    }

    // Validate: candidate must exist
    const candidateToVoteFor = getCandidateById(candidateId);
    if (!candidateToVoteFor) {
      throw new Error("Invalid candidate ID");
    }

    // Get current candidates
    let candidates = getCandidates();

    // Find and increment the votes for this candidate
    const candidateIndex = candidates.findIndex(
      (c) => c.id === parseInt(candidateId),
    );
    if (candidateIndex !== -1) {
      candidates[candidateIndex].votes++;
    }

    // Save updated candidates back to storage
    localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(candidates));

    // Register voter in the voter registry
    let voters = getVoterRegistry();
    voters.push(currentVoter.id);
    localStorage.setItem(STORAGE_KEYS.VOTERS, JSON.stringify(voters));

    // Log the successful vote
    console.log(
      `✓ Vote recorded for "${candidateToVoteFor.name}" by voter "${currentVoter.name}"`,
    );
  }

  // ========================================================================
  // 7. PUBLIC API - ADMIN FUNCTIONS (Data Management)
  // ========================================================================

  /**
   * Reset all voting data for demo/testing purposes
   * WARNING: This clears all votes and voter records
   */
  function resetAllData() {
    // Reset candidates to initial state (zero votes)
    const resetCandidates = MOCK_CANDIDATES.map((c) => ({
      ...c,
      votes: 0,
    }));

    // Clear all storage
    localStorage.setItem(
      STORAGE_KEYS.CANDIDATES,
      JSON.stringify(resetCandidates),
    );
    localStorage.setItem(STORAGE_KEYS.VOTERS, JSON.stringify([]));
    localStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
    localStorage.removeItem(STORAGE_KEYS.SELECTED_CANDIDATE);

    console.log("⚠️  All voting data has been reset");
  }

  /**
   * Add mock votes for demonstration purposes
   * Used to quickly populate test data
   */
  function addMockVotes() {
    const mockVoteDistribution = {
      1: 25, // Alice gets 25 votes
      2: 18, // Bob gets 18 votes
      3: 22, // Carol gets 22 votes
      4: 15, // David gets 15 votes
      5: 20, // Emma gets 20 votes
      6: 10, // Frank gets 10 votes
    };

    let candidates = getCandidates();

    // Update vote counts
    Object.entries(mockVoteDistribution).forEach(([candidateId, voteCount]) => {
      const candidateIndex = candidates.findIndex(
        (c) => c.id === parseInt(candidateId),
      );
      if (candidateIndex !== -1) {
        candidates[candidateIndex].votes = voteCount;
      }
    });

    // Save updated candidates
    localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(candidates));

    // Also add mock voters to registry
    const mockVoters = Array.from({ length: 110 }, (_, i) => `voter_${i + 1}`);
    localStorage.setItem(STORAGE_KEYS.VOTERS, JSON.stringify(mockVoters));

    console.log("✓ Mock votes added for demonstration");
  }

  // ========================================================================
  // 8. PUBLIC API - UTILITY FUNCTIONS
  // ========================================================================

  /**
   * Clear a specific candidate's selection
   */
  function clearSelection() {
    localStorage.removeItem(STORAGE_KEYS.SELECTED_CANDIDATE);
    console.log("✓ Candidate selection cleared");
  }

  /**
   * Debug function - Log current state to console
   * Useful for troubleshooting localStorage issues
   */
  function debugState() {
    console.group("🔍 Voting System State Debug");
    console.log("Candidates:", getCandidates());
    console.log("Voters:", getVoterRegistry());
    console.log("Current Session:", getCurrentVoter());
    console.log("Statistics:", getVotingStats());
    console.groupEnd();
  }

  // ========================================================================
  // 9. PUBLIC API EXPORT (Reveal Pattern)
  // ========================================================================

  /**
   * Return public API methods
   * These are the only functions accessible outside this module
   */
  return {
    // Getter functions
    getCandidates: getCandidates,
    getCandidateById: getCandidateById,
    getVoterRegistry: getVoterRegistry,
    hasVoterVoted: hasVoterVoted,
    getCurrentVoter: getCurrentVoter,
    isUserLoggedIn: isUserLoggedIn,
    getSelectedCandidate: getSelectedCandidate,
    getVotingStats: getVotingStats,

    // Authentication functions
    loginVoter: loginVoter,
    logout: logout,

    // Voting functions
    selectCandidate: selectCandidate,
    recordVote: recordVote,

    // Admin functions
    resetAllData: resetAllData,
    addMockVotes: addMockVotes,
    clearSelection: clearSelection,

    // Debug utilities
    debugState: debugState,
  };
})();

// ============================================================================
// 10. INITIALIZATION CODE (Run on every page load)
// ============================================================================

document.addEventListener("DOMContentLoaded", function () {
  console.log("🎉 Voting System loaded and ready");
  console.log("Current time:", new Date().toLocaleString());

  // VotingApp.addMockVotes();
});
