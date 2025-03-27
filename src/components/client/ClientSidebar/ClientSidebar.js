import './ClientSidebar.css'; // Import the corresponding CSS file
import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../services/redux/authSlice';
import { toast } from 'react-toastify';
import DashBoardIcon from '../../icons/DashBoardIcon';
import LogoffIcon from '../../icons/LogoffIcon';
import { useLocation } from 'react-router-dom';
import BasketIcon from '../../icons/BasketIcon';
import UserIcon from '../../icons/UserIcon';
import logo from '../../../assets/images/logo_orange_white.png';
import FootballFieldIcon from '../../icons/FootballFieldIcon';
import ClockIcon from '../../icons/ClockIcon';
import CalendarIcon from '../../icons/CalendarIcon';
import OrderIcon from '../../icons/OrderIcon';
import PaymentIcon from '../../icons/PaymentIcon';

const ClientSidebar = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
        <a href="/" className={pathSegments.length === 0 || (pathSegments[0] === 'dashboard') || pathSegments[1] === 'dashboard' ? "sidebar__menu-item sidebar__menu-item-selected" : "sidebar__menu-item"}><DashBoardIcon color='white'/>Dashboard</a>
        <a href="/Quadras" className={pathSegments[0] === 'Quadras' ? "sidebar__menu-item sidebar__menu-item-selected" : "sidebar__menu-item"}><FootballFieldIcon color='white'/>Quadras</a>
        <a href="/Horarios" className={pathSegments[0] === 'Horários' ? "sidebar__menu-item sidebar__menu-item-selected" : "sidebar__menu-item"}><ClockIcon color='white'/>Configuração Horários</a>
        <a href="/Reservas" className={pathSegments[0] === 'Reservas' ? "sidebar__menu-item sidebar__menu-item-selected" : "sidebar__menu-item"}><CalendarIcon color='white'/>Reservas</a>
        <a href="/Produtos" className={pathSegments[0] === 'Produtos' ? "sidebar__menu-item sidebar__menu-item-selected" : "sidebar__menu-item"}><OrderIcon color='white'/>Produtos</a>
        <a href="/Pagamentos" className={pathSegments[0] === 'Pagamentos' ? "sidebar__menu-item sidebar__menu-item-selected" : "sidebar__menu-item"}><PaymentIcon color='white'/>Pagamentos</a>
        <a href="/CashRegister" className={pathSegments[0] === 'CashRegister' ? "sidebar__menu-item sidebar__menu-item-selected" : "sidebar__menu-item"}><BasketIcon color='white'/>CashRegister</a>
        <a href="/Usuarios" className={pathSegments[0] === 'Usuarios' ? "sidebar__menu-item sidebar__menu-item-selected" : "sidebar__menu-item"}><UserIcon color='white'/>Usuários</a>
        </nav>
      <button className="sidebar__logoff" onClick={handleLogout}>
        Sair <LogoffIcon color='white'/>
      </button>
    </aside>
  );
};

export default ClientSidebar;
