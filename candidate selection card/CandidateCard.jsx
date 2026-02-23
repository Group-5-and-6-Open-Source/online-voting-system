import React from 'react';
import './CandidateCard.css';

/**
 * CandidateCard Component
 * 
 * A premium React component to showcase election candidates.
 * 
 * @param {Object} props
 * @param {string} props.name - Candidate's full name.
 * @param {string} props.party - Name of the political party.
 * @param {string} props.image - URL to the candidate's portrait image.
 * @param {string} props.manifesto - A brief summary of the candidate's goals.
 * @param {function} props.onSelect - Callback function when the candidate is selected.
 * @param {boolean} props.isSelected - Indicates if this candidate is currently selected.
 */
const CandidateCard = ({ name, party, image, manifesto, onSelect, isSelected }) => {
  return (
    <div className={`candidate-card ${isSelected ? 'selected' : ''}`}>
      <div className="card-image-container">
        <img 
          src={image || 'https://via.placeholder.com/150'} 
          alt={`${name}'s portrait`} 
          className="candidate-image" 
        />
        <div className="party-badge">{party}</div>
      </div>
      
      <div className="card-content">
        <h3 className="candidate-name">{name}</h3>
        <p className="candidate-manifesto">{manifesto}</p>
        
        <button 
          className={`select-btn ${isSelected ? 'btn-selected' : ''}`}
          onClick={() => onSelect(name)}
        >
          {isSelected ? 'Selected' : 'Select Candidate'}
        </button>
      </div>
    </div>
  );
};

export default CandidateCard;
