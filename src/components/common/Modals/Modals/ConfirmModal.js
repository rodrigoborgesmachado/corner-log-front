// src/components/modals/ConfirmModal.js

import React from 'react';
import './ConfirmModal.css'; // Create a CSS file for modal styling

const ConfirmModal = ({ isOpen, title, message, onYes, onNo, confirmData, yesLabel = "Yes", noLabel = "No" }) => {
  if (!isOpen) return null;

  return (
    <div className="loading-backdrop">
      <div className="modal-container-generic">
        <h2 className="modal-title">{title}</h2>
        <p className="modal-message">{message}</p>
        <div className="modal-actions">
          <button className="modal-button modal-yes" onClick={() => onYes(confirmData)}>{yesLabel}</button>
          <button className="modal-button modal-no" onClick={onNo}>{noLabel}</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
