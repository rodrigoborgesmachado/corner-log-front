import './AdminSidebar.css'; // Import the corresponding CSS file
import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../services/redux/authSlice';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import DashBoardIcon from '../../icons/DashBoardIcon';
import LogoffIcon from '../../icons/LogoffIcon';
import { useLocation } from 'react-router-dom';
import BasketIcon from '../../icons/BasketIcon';
import UserIcon from '../../icons/UserIcon';
import logo from '../../../assets/images/logo_orange_white.png';
import BuildingIcon from '../../icons/BuildingIcon';
import FootballFieldIcon from '../../icons/FootballFieldIcon';
import ClockIcon from '../../icons/ClockIcon';
import CalendarIcon from '../../icons/CalendarIcon';
import OrderIcon from '../../icons/OrderIcon';

const AdminSidebar = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAdmin = useSelector((state) => state.auth.isAdmin);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    toast.success("Até breve!");
  };

  return (
    <aside className="sidebar">
      <div className="logo-class-img-sidebar">
          <img src={logo} alt="Logo" className="sidebar-logo" />
      </div>
      <nav className="sidebar__menu">
        {isAdmin && <a href="/" className={pathSegments.length === 0 || (pathSegments[0] === 'dashboard') || pathSegments[1] === 'dashboard' ? "sidebar__menu-item sidebar__menu-item-selected" : "sidebar__menu-item"}><DashBoardIcon color='white'/>Dashboard</a>}
        {isAdmin && <a href="/Empresas" className={pathSegments[0] === 'Empresas' ? "sidebar__menu-item sidebar__menu-item-selected" : "sidebar__menu-item"}><BuildingIcon color='white'/>Empresas</a>}
        {isAdmin && <a href="/Quadras" className={pathSegments[0] === 'Quadras' ? "sidebar__menu-item sidebar__menu-item-selected" : "sidebar__menu-item"}><FootballFieldIcon color='white'/>Quadras</a>}
        {isAdmin && <a href="/Horarios" className={pathSegments[0] === 'Horários' ? "sidebar__menu-item sidebar__menu-item-selected" : "sidebar__menu-item"}><ClockIcon color='white'/>Configuração Horários</a>}
        {isAdmin && <a href="/Reservas" className={pathSegments[0] === 'Reservas' ? "sidebar__menu-item sidebar__menu-item-selected" : "sidebar__menu-item"}><CalendarIcon color='white'/>Reservas</a>}
        {isAdmin && <a href="/Produtos" className={pathSegments[0] === 'Produtos' ? "sidebar__menu-item sidebar__menu-item-selected" : "sidebar__menu-item"}><OrderIcon color='white'/>Produtos</a>}
        {isAdmin && <a href="/CashRegister" className={pathSegments[0] === 'CashRegister' ? "sidebar__menu-item sidebar__menu-item-selected" : "sidebar__menu-item"}><BasketIcon color='white'/>CashRegister</a>}
        {isAdmin && <a href="/Logger" className={pathSegments[0] === 'Logger' ? "sidebar__menu-item sidebar__menu-item-selected" : "sidebar__menu-item"}><BasketIcon color='white'/>Logger</a>}
        {isAdmin && <a href="/MailMessage" className={pathSegments[0] === 'MailMessage' ? "sidebar__menu-item sidebar__menu-item-selected" : "sidebar__menu-item"}><BasketIcon color='white'/>MailMessage</a>}
        {isAdmin && <a href="/Payment" className={pathSegments[0] === 'Payment' ? "sidebar__menu-item sidebar__menu-item-selected" : "sidebar__menu-item"}><BasketIcon color='white'/>Payment</a>}
        {isAdmin && <a href="/Usuarios" className={pathSegments[0] === 'Usuarios' ? "sidebar__menu-item sidebar__menu-item-selected" : "sidebar__menu-item"}><UserIcon color='white'/>Usuários</a>}
        {isAdmin && <a href="/UserEntity" className={pathSegments[0] === 'UserEntity' ? "sidebar__menu-item sidebar__menu-item-selected" : "sidebar__menu-item"}><BasketIcon color='white'/>UserEntity</a>}
        </nav>
      <button className="sidebar__logoff" onClick={handleLogout}>
        Sair <LogoffIcon color='white'/>
      </button>
    </aside>
  );
};

export default AdminSidebar;
