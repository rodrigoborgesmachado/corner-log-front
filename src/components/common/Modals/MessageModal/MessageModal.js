import React from 'react';

const MessageModal = ({isOpen, message, click, optionText = 'fechar'}) => {

    if (!isOpen) return null;

    return (
        <div className="loading-backdrop">
        <div className="loading-modal">
            <span>{message}</span>
            <button className='main-button margin-top-default' onClick={click}>{optionText}</button>
        </div>
        </div>
    );
};

export default MessageModal;
