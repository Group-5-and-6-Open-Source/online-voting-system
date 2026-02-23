class VotingSystem {
  constructor() {
    this.polls = [];
    this.currentPollIndex = 0;
    this.userVotes = {};
    this.hasVoted = false;
    this.init();
  }

  init() {
    this.loadPolls();
    this.setupEventListeners();
    this.displayCurrentPoll();
  }

  loadPolls() {
    // Sample polls data - replace with API call in production
    this.polls = [
      {
        id: 1,
        question: "What is your favorite programming language?",
        description: "Help us understand what the community prefers",
        options: [
          { id: 1, text: "JavaScript", votes: 245 },
          { id: 2, text: "Python", votes: 312 },
          { id: 3, text: "Java", votes: 198 },
          { id: 4, text: "C++", votes: 156 }
        ]
      },
      {
        id: 2,
        question: "Which framework do you prefer for web development?",
        description: "Share your framework preference",
        options: [
          { id: 1, text: "React", votes: 450 },
          { id: 2, text: "Vue.js", votes: 280 },
          { id: 3, text: "Angular", votes: 190 },
          { id: 4, text: "Svelte", votes: 120 }
        ]
      }
    ];
  }

  setupEventListeners() {
    document.getElementById('submitBtn').addEventListener('click', () => this.submitVote());
    document.getElementById('viewResultsBtn').addEventListener('click', () => this.viewResults());
    document.getElementById('resetBtn').addEventListener('click', () => this.resetVote());
  }

  displayCurrentPoll() {
    if (this.currentPollIndex >= this.polls.length) {
      this.showMessage('All polls completed!', 'success');
      return;
    }

    const poll = this.polls[this.currentPollIndex];
    
    // Update poll question and description
    document.getElementById('pollQuestion').textContent = poll.question;
    document.getElementById('pollDescription').textContent = poll.description;

    // Clear previous options
    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';

    // Display options
    poll.options.forEach((option, index) => {
      const optionDiv = document.createElement('div');
      optionDiv.className = 'option-item';
      optionDiv.innerHTML = `
        <input type="radio" id="option${option.id}" name="poll${poll.id}" value="${option.id}" class="option-input">
        <label for="option${option.id}" class="option-label">${option.text}</label>
      `;
      optionsContainer.appendChild(optionDiv);
    });

    // Reset UI
    document.getElementById('resultsSection').style.display = 'none';
    document.getElementById('submitBtn').style.display = 'inline-block';
    document.getElementById('viewResultsBtn').style.display = 'none';
    document.getElementById('resetBtn').style.display = 'none';
    document.getElementById('statusMessage').innerHTML = '';
    this.hasVoted = false;
  }

  submitVote() {
    const poll = this.polls[this.currentPollIndex];
    const selectedOption = document.querySelector(`input[name="poll${poll.id}"]:checked`);

    if (!selectedOption) {
      this.showMessage('Please select an option before voting!', 'error');
      return;
    }

    // Record the vote
    const optionId = parseInt(selectedOption.value);
    this.userVotes[poll.id] = optionId;
    
    // Increment vote count
    const option = poll.options.find(opt => opt.id === optionId);
    if (option) {
      option.votes += 1;
    }

    this.hasVoted = true;
    this.showMessage('Vote submitted successfully!', 'success');
    
    // Update button visibility
    document.getElementById('submitBtn').style.display = 'none';
    document.getElementById('viewResultsBtn').style.display = 'inline-block';
    document.getElementById('resetBtn').style.display = 'inline-block';
  }

  viewResults() {
    const poll = this.polls[this.currentPollIndex];
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = '';

    // Calculate total votes
    const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);

    // Display results
    poll.options.forEach(option => {
      const percentage = totalVotes > 0 ? ((option.votes / totalVotes) * 100).toFixed(1) : 0;
      const resultDiv = document.createElement('div');
      resultDiv.className = 'result-item';
      resultDiv.innerHTML = `
        <div class="result-label">
          <span>${option.text}</span>
          <span>${option.votes} votes (${percentage}%)</span>
        </div>
        <div class="result-bar">
          <div class="result-fill" style="width: ${percentage}%">
            ${percentage > 10 ? percentage + '%' : ''}
          </div>
        </div>
      `;
      resultsContainer.appendChild(resultDiv);
    });

    document.getElementById('resultsSection').style.display = 'block';
  }

  resetVote() {
    this.hasVoted = false;
    this.displayCurrentPoll();
    this.showMessage('Vote reset. Please select an option to vote again.', 'info');
  }

  showMessage(message, type) {
    const statusDiv = document.getElementById('statusMessage');
    statusDiv.innerHTML = `<div class="status-message status-${type}">${message}</div>`;
    
    // Auto-hide info messages after 3 seconds
    if (type === 'info') {
      setTimeout(() => {
        statusDiv.innerHTML = '';
      }, 3000);
    }
  }
}

// Initialize the voting system when the page loads
document.addEventListener('DOMContentLoaded', () => {
  new VotingSystem();
});
