import React from 'react';
import './PasswordLengthSelector.css';

interface PasswordLengthSelectorProps {
  length: number;
  onChange: (length: number) => void;
}

const PasswordLengthSelector: React.FC<PasswordLengthSelectorProps> = ({ length, onChange }) => {
  return (
    <div className="password-length-selector">
      <label htmlFor="password-length">Password Length:</label>
      <select 
        id="password-length"
        value={length}
        onChange={(e) => onChange(Number(e.target.value))}
        className="password-length-dropdown"
      >
        {Array.from({ length: 27 }, (_, i) => i + 10).map((num) => (
          <option key={num} value={num}>
            {num} characters
          </option>
        ))}
      </select>
    </div>
  );
};

export default PasswordLengthSelector;
