import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "./store";
import { getCurrentUser, initializationComplete } from "./store/slices/authSlice";

// Layout et Pages
import DashboardLayout from "./dashboard/layout/DashboardLayout";
import DashboardHome from "./dashboard/pages/DashboardHome";
import Reservations from "./dashboard/pages/Reservations";
import Rooms from "./dashboard/pages/Rooms";
import Clients from "./dashboard/pages/Clients";
import Payments from "./dashboard/pages/Payments";
import Settings from "./dashboard/pages/Settings";
import Users from "./dashboard/pages/Users";
import RoomDetails from "./dashboard/pages/RoomDetails";
import EditReservation from "./dashboard/pages/EditReservation";
import ClientDetails from "./dashboard/pages/ClientDetails";
import PaymentDetails from "./dashboard/pages/PaymentDetails";
import UserDetails from "./dashboard/pages/UserDetails";
import AddUser from "./dashboard/pages/AddUser";
import AddRoom from "./dashboard/pages/AddRoom";
import AddReservation from "./dashboard/pages/AddReservation";
import Login from "./dashboard/pages/Login";
import SignUp from "./dashboard/pages/SignUp";
import EditRoom from "./dashboard/pages/EditRooms"; // ✅ AJOUT IMPORT

// Initialisation Auth
const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const { token, isAuthenticated, isInitializing } = useSelector((state) => state.auth);

  useEffect(() => {
    const initialize = async () => {
      if (token && !isAuthenticated) {
        console.log("🔄 Token trouvé, récupération des données utilisateur...");
        try {
          await dispatch(getCurrentUser()).unwrap();
        } catch (error) {
          console.warn("⚠️ Erreur lors de la récupération du profil :", error);
          dispatch(initializationComplete());
        }
      } else {
        // ✅ Si aucun token, ou déjà connecté → on termine l'initialisation
        dispatch(initializationComplete());
      }
    };

    initialize();
  }, [dispatch, token]);

  // ✅ N'affiche le loader que pendant l'initialisation réelle
  if (isInitializing) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 text-lg">Chargement de la session...</p>
      </div>
    );
  }

  return children;
};

// Route protégée
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const { isAuthenticated, isInitializing } = useSelector(state => state.auth);

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Chargement de la session...</p>
      </div>
    );
  }

  if (!token || !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Route publique
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

function AppContent() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* Routes publiques */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />
        <Route 
          path="/signup" 
          element={
            <PublicRoute>
              <SignUp />
            </PublicRoute>
          } 
        />
        
        {/* Route racine */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Dashboard protégé */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="reservations" element={<Reservations />} />
          <Route path="rooms" element={<Rooms />} />
          <Route path="clients" element={<Clients />} />
          <Route path="payments" element={<Payments />} />
          <Route path="settings" element={<Settings />} />
          <Route path="users" element={<Users />} />
          <Route path="add-user" element={<AddUser />} />
          <Route path="add-room" element={<AddRoom />} />
          <Route path="add-reservation" element={<AddReservation />} />
          <Route path="room/:id" element={<RoomDetails />} />
          <Route path="room/:id/edit" element={<EditRoom />} /> {/* ✅ AJOUT ROUTE EDIT ROOM */}
          <Route path="reservation/:id/edit" element={<EditReservation />} />
          <Route path="client/:id" element={<ClientDetails />} />
          <Route path="payment/:id" element={<PaymentDetails />} />
          <Route path="user/:id" element={<UserDetails />} />
           <Route path="user/:id/edit" element={<UserDetails />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AuthInitializer>
        <AppContent />
      </AuthInitializer>
    </Provider>
  );
}