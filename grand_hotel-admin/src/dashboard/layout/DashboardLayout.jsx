import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { logout, getCurrentUser } from "../../store/slices/authSlice";
import Sidebar from "../layout/Sidebar";
import Header from "../layout/Header";

const DashboardLayout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isLoading, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    console.log('🏢 DashboardLayout - État auth:', {
      user: user,
      isAuthenticated: isAuthenticated,
      token: localStorage.getItem('token'),
      userFromStorage: JSON.parse(localStorage.getItem('user')),
      isLoading: isLoading
    });

    // 🔥 CORRECTION : Vérifier d'abord le token dans localStorage
    const token = localStorage.getItem('token');
    
    if (token && !user) {
      console.log('🔄 Token présent mais user manquant, récupération...');
      dispatch(getCurrentUser());
    }
  }, [dispatch, user, isAuthenticated, isLoading]);

  // 🔥 CORRECTION : Meilleure gestion de la redirection
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token && !isLoading) {
      console.log('🚫 Aucun token trouvé, redirection vers login');
      navigate("/login");
    }
  }, [isLoading, navigate]);

  const handleLogout = () => {
    console.log('👋 Déconnexion utilisateur');
    dispatch(logout());
    navigate("/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de votre espace...</p>
        </div>
      </div>
    );
  }

  // 🔥 CORRECTION : Vérifier le token plutôt que isAuthenticated
  const token = localStorage.getItem('token');
  if (!token) {
    return null; // La redirection se fera via le useEffect
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} onLogout={handleLogout} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-6 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;