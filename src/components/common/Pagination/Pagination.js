// src/components/Pagination/Pagination.js

import React from 'react';
import './Pagination.css';

const Pagination = ({ page, totalPages, onPageChange }) => {
  const getPages = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (page <= 3) {
        pages.push(1, 2, 3, '...', totalPages);
      } else if (page > totalPages - 3) {
        pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', page - 1, page, page + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="pagination">
      <button 
        className={page === 1 ? '' : 'brighten-on-hover'} 
        onClick={() => onPageChange(page - 1)} 
        disabled={page === 1}
      >
        ← Anterior
      </button>
      {getPages().map((pageNumber, index) =>
        pageNumber === '...' ? (
          <span key={index} className="ellipsis">...</span>
        ) : (
          <button
            key={index}
            className={`page-button ${pageNumber === page ? 'active' : 'brighten-on-hover'}`}
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </button>
        )
      )}
      <button 
        className={page === totalPages ? '' : 'brighten-on-hover'} 
        onClick={() => onPageChange(page + 1)} 
        disabled={page === totalPages}
      >
        Próximo →
      </button>
    </div>
  );
};

export default Pagination;

