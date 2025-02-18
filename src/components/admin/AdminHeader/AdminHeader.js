import React, {useState} from 'react';
import './AdminHeader.css';
import UserCustomIcon from '../../icons/UserCustomIcon';
import { useSelector } from 'react-redux';
import { selectUserName } from '../../../services/redux/authSlice';
import { useNavigate } from 'react-router-dom';

const AdminHeader = ({onclickMenu}) => {
  const navigate = useNavigate();
  const userName = useSelector(selectUserName);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const handleUserIconClick = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="admin-header">
      <div className={'admin-header__all'}>
        {/* Hamburger Button for Mobile */}
        <button 
            className={'sidebar-toggle-btn'} 
            onClick={() => onclickMenu()}
        >
          ☰
        </button>
        <div className="admin-header__left clickable" onClick={() => navigate('/')}>
          <h1>Portal Web</h1>
        </div>
        <div className='navbar__menu-item'>
          <div className="admin-header__right" onClick={handleUserIconClick}>
            <span>Olá, {userName.split(' ')[0]}</span>
            <UserCustomIcon size={32} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
