import React from 'react';
import './LoadingModal.css';

const LoadingModal = () => {
  return (
    <div className="loading-backdrop super-z-index">
      <div className="loading-modal">
        <div className="spinner"></div>
        <span>Carregando...</span>
      </div>
    </div>
  );
};

export default LoadingModal;
