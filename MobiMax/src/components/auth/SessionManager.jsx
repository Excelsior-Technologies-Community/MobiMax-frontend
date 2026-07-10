import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import Suspended from '../../pages/Auth/Suspended';

const socket = io('http://localhost:5001');

const SessionManager = ({ children }) => {
  const [isSuspendedLocally, setIsSuspendedLocally] = useState(false);
  const suspendedUserIdRef = useRef(null);
  const suspendedPartnerIdRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleUserStatus = ({ id, status }) => {
      const userData = JSON.parse(localStorage.getItem('userData'));
      const isActiveUser = localStorage.getItem('userToken');
      
      if (isActiveUser && userData?.id === id && status === 'suspended') {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');
        window.dispatchEvent(new Event('authChange'));
        setIsSuspendedLocally(true);
        suspendedUserIdRef.current = id;
      } else if (status === 'active' && suspendedUserIdRef.current === id) {
        setIsSuspendedLocally(false);
        suspendedUserIdRef.current = null;
        if (!window.location.pathname.startsWith('/admin')) {
          navigate('/login');
        }
      }
    };

    const handlePartnerStatus = ({ id, status }) => {
      const partnerData = JSON.parse(localStorage.getItem('partnerData'));
      const isActivePartner = localStorage.getItem('partnerToken');
      
      if (isActivePartner && partnerData?.id === id && status === 'suspended') {
        localStorage.removeItem('partnerToken');
        localStorage.removeItem('partnerData');
        window.dispatchEvent(new Event('authChange'));
        setIsSuspendedLocally(true);
        suspendedPartnerIdRef.current = id;
      } else if (status === 'active' && suspendedPartnerIdRef.current === id) {
        setIsSuspendedLocally(false);
        suspendedPartnerIdRef.current = null;
        if (!window.location.pathname.startsWith('/admin')) {
          navigate('/partner/login');
        }
      }
    };

    const handleUserDelete = ({ id }) => {
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (localStorage.getItem('userToken') && userData?.id === id) {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');
        window.dispatchEvent(new Event('authChange'));
        if (!window.location.pathname.startsWith('/admin')) {
          navigate('/login');
        }
      }
    };

    const handlePartnerDelete = ({ id }) => {
      const partnerData = JSON.parse(localStorage.getItem('partnerData'));
      if (localStorage.getItem('partnerToken') && partnerData?.id === id) {
        localStorage.removeItem('partnerToken');
        localStorage.removeItem('partnerData');
        window.dispatchEvent(new Event('authChange'));
        if (!window.location.pathname.startsWith('/admin')) {
          navigate('/partner/login');
        }
      }
    };

    socket.on('user_status_updated', handleUserStatus);
    socket.on('partner_status_updated', handlePartnerStatus);
    socket.on('user_deleted', handleUserDelete);
    socket.on('partner_deleted', handlePartnerDelete);

    return () => {
      socket.off('user_status_updated', handleUserStatus);
      socket.off('partner_status_updated', handlePartnerStatus);
      socket.off('user_deleted', handleUserDelete);
      socket.off('partner_deleted', handlePartnerDelete);
    };
  }, [navigate]);

  if (isSuspendedLocally && !location.pathname.startsWith('/admin')) {
    return <Suspended />;
  }

  return <>{children}</>;
};

export default SessionManager;
